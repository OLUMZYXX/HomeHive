import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

import { navigateToHome } from "../../utils/navigation";
import useScrollToTop from "../../hooks/useScrollToTop";
import { ButtonLoader } from "../common/Loader";
import { toast } from "sonner";
import { useAPI } from "../../contexts/APIContext";
import GoogleAuth from "../../config/googleAuth";

const Createacct = () => {
  useScrollToTop();

  const navigate = useNavigate();
  const location = useLocation();
  const { registerHost, googleAuth } = useAPI();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("individual");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleHomeNavigation = () => navigateToHome(navigate, location);
  const isEmailValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-green-400",
    "bg-green-500",
  ][strength];

  const isPasswordValid = (p) =>
    p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!businessName.trim()) {
      setError("Business name is required.");
      return;
    }
    if (!isPasswordValid(password)) {
      setError(
        "Password must be at least 8 characters with an uppercase letter and a number.",
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerHost({
        email: email.trim(),
        password,
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        businessName: businessName.trim(),
        businessType,
      });
      if (result.success) {
        toast.success("Welcome to HomeHive!", { duration: 4000 });
        setTimeout(() => navigate("/host-dashboard"), 1000);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create account. Please try again.";
      setError(msg);
      toast.error(msg, { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await GoogleAuth.initialize();
      const googleUser = await GoogleAuth.signIn();
      const result = await googleAuth(googleUser.idToken, {
        email: googleUser.email,
        name: googleUser.name,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        picture: googleUser.picture,
        googleId: googleUser.id,
        businessName: `${googleUser.name || "User"}'s Properties`,
        businessType: "individual",
        isHost: true,
      });
      if (result.success) {
        toast.success("Welcome to HomeHive!", { duration: 4000 });
        setTimeout(() => navigate("/host-dashboard"), 1000);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Google sign up failed. Please try again.";
      toast.error(msg, { duration: 3000 });
      setError(msg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-neutral-200 hover:border-neutral-400 focus:border-neutral-800 focus:outline-none bg-white text-neutral-800 placeholder-neutral-400 text-sm transition-colors duration-200";

  return (
    <div className="min-h-screen flex">
      {/* Left — dark editorial panel */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-neutral-900 flex-col justify-between p-12">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Amber left line */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-amber-500/60 to-transparent" />

        {/* Back to home */}
        <button
          onClick={handleHomeNavigation}
          className="relative flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors duration-200 self-start"
        >
          <HiArrowLeft className="text-base" />
          HomeHive
        </button>

        {/* Brand copy */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-amber-500" />
            <span className="text-amber-400 text-xs font-semibold tracking-[0.25em] uppercase">
              Become a Host
            </span>
          </div>
          <h1 className="font-Cormorant text-4xl xl:text-5xl font-light text-white leading-tight mb-4">
            Start your hosting
            <br />
            <span className="italic">journey today</span>
          </h1>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
            Join hundreds of hosts earning income by sharing their properties on
            HomeHive.
          </p>

          {/* Benefits list */}
          <ul className="mt-10 space-y-4">
            {[
              "Earn extra income on your schedule",
              "Comprehensive host protection included",
              "Access to thousands of verified guests",
              "Smart pricing & calendar sync tools",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                <span className="text-neutral-300 text-sm">{item}</span>
              </li>
            ))}
          </ul>

          {/* Quote */}
          <blockquote className="mt-10 border-l-2 border-amber-400/60 pl-4">
            <p className="text-white/70 text-sm italic leading-relaxed">
              &ldquo;I started hosting six months ago and it&apos;s been
              life-changing. The platform makes everything easy.&rdquo;
            </p>
            <cite className="text-white/40 text-xs mt-2 block not-italic">
              — Jennifer K., Superhost since 2024
            </cite>
          </blockquote>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile back */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6">
          <button
            onClick={handleHomeNavigation}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
          >
            <HiArrowLeft />
            Back
          </button>
          <span className="font-Cormorant text-xl font-semibold text-neutral-800">
            HomeHive
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-amber-500" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600">
                  Host Sign Up
                </span>
              </div>
              <h2 className="font-Cormorant text-4xl font-light text-neutral-900 mb-2">
                Create your <span className="italic">host account</span>
              </h2>
              <p className="text-neutral-500 text-sm">
                Free to register — your first booking could be days away
              </p>
            </div>

            {/* Google first */}
            <button
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 border border-neutral-200 hover:border-neutral-400 bg-white text-neutral-700 text-sm font-medium py-3.5 transition-colors duration-200 disabled:opacity-50 mb-6"
            >
              <FcGoogle className="text-lg" />
              {isGoogleLoading ? "Creating account…" : "Continue with Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-400 font-medium">
                or fill in your details
              </span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleCreateAccount} className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                />
              </div>

              {/* Business name + phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your business"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-1.5">
                    Phone{" "}
                    <span className="text-neutral-400 normal-case font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Business type */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-1.5">
                  Business Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "individual", label: "Individual" },
                    { value: "company", label: "Company" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setBusinessType(opt.value)}
                      className={`px-4 py-3 border text-sm font-medium tracking-wide transition-colors duration-200 ${
                        businessType === opt.value
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 hover:border-neutral-400 text-neutral-700 bg-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="8+ chars, uppercase, number"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-11`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-sm" />
                    ) : (
                      <FaEye className="text-sm" />
                    )}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                            strength >= level ? strengthColor : "bg-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-400 w-10">
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-neutral-900 cursor-pointer"
                />
                <span className="text-xs text-neutral-500 leading-relaxed">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="text-neutral-900 font-semibold hover:text-amber-600 transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-neutral-900 font-semibold hover:text-amber-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* Error */}
              {error && (
                <p className="text-red-600 text-xs font-medium border-l-2 border-red-400 pl-3">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-sm font-medium tracking-[0.15em] uppercase py-4 flex items-center justify-center gap-2 transition-colors duration-200 mt-2"
              >
                {isLoading ? (
                  <ButtonLoader />
                ) : (
                  <>
                    Create Host Account
                    <HiArrowRight className="text-base" />
                  </>
                )}
              </button>
            </form>

            {/* Sign in link */}
            <p className="text-center text-sm text-neutral-500 mt-6">
              Already have a host account?{" "}
              <button
                onClick={() => navigate("/hostlogin")}
                className="text-neutral-900 font-semibold hover:text-amber-600 transition-colors duration-200"
              >
                Sign in
              </button>
            </p>

            {/* Footer links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400 mt-6 pt-6 border-t border-neutral-100">
              <a
                href="/privacy"
                className="hover:text-neutral-600 transition-colors duration-200"
              >
                Privacy
              </a>
              <span className="text-neutral-300">·</span>
              <a
                href="/terms"
                className="hover:text-neutral-600 transition-colors duration-200"
              >
                Terms
              </a>
              <span className="text-neutral-300">·</span>
              <a
                href="/partner-help"
                className="hover:text-neutral-600 transition-colors duration-200"
              >
                Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createacct;

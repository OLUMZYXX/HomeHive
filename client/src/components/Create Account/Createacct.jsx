import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { toast } from "../../utils/toast.jsx";
import { useAPI } from "../../contexts/APIContext";
import GoogleAuth from "../../config/googleAuth";
import { ButtonLoader } from "../common/Loader";

const Createacct = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { register, googleAuth } = useAPI();

  const isEmailValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  // Password strength: 0-4
  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[^a-zA-Z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-green-400", "bg-green-500"][strength];

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      await register({
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        password,
      });
      toast.success("Account created! Welcome to HomeHive.");
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      setTimeout(() => navigate(redirectPath), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create account. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await GoogleAuth.initialize();
      const googleUser = await GoogleAuth.signIn();
      await googleAuth(googleUser.idToken, {
        email: googleUser.email,
        name: googleUser.name,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        picture: googleUser.picture,
        googleId: googleUser.id,
        isHost: false,
      });
      toast.success(`Welcome, ${googleUser.name}!`);
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      setTimeout(() => navigate(redirectPath), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Google sign-up failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-neutral-200 hover:border-neutral-400 focus:border-neutral-800 focus:outline-none bg-white text-neutral-800 placeholder-neutral-400 text-sm transition-colors duration-200";

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative panel (desktop only) */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-neutral-900 flex-col justify-between p-12">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Amber left line */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-amber-500/60 to-transparent" />

        {/* Back to home */}
        <button
          onClick={() => navigate("/")}
          className="relative flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors duration-200"
        >
          <HiArrowLeft className="text-base" />
          HomeHive
        </button>

        {/* Brand copy */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-amber-500" />
            <span className="text-amber-400 text-xs font-semibold tracking-[0.25em] uppercase">
              Join Us
            </span>
          </div>
          <h1 className="font-Cormorant text-4xl font-light text-white leading-tight mb-4">
            Your perfect stay<br />
            <span className="italic">starts here</span>
          </h1>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Join thousands of guests discovering Nigeria's finest accommodations on HomeHive.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            {[
              { num: "500+", label: "Properties" },
              { num: "4.9★", label: "Guest Rating" },
              { num: "10K+", label: "Happy Guests" },
              { num: "24/7", label: "Support" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-Cormorant text-2xl font-light text-white">{num}</div>
                <div className="text-neutral-500 text-xs uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile back */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
          >
            <HiArrowLeft />
            Back
          </button>
          <span className="font-Cormorant text-xl font-semibold text-neutral-800">HomeHive</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-amber-500" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600">
                  Create Account
                </span>
              </div>
              <h2 className="font-Cormorant text-4xl font-light text-neutral-900 mb-2">
                Get <span className="italic">started</span>
              </h2>
              <p className="text-neutral-500 text-sm">Create your free account in seconds</p>
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
              <span className="text-xs text-neutral-400 font-medium">or fill in your details</span>
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

              {/* Phone (optional) */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-1.5">
                  Phone <span className="text-neutral-400 normal-case font-normal">(optional)</span>
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

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
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
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {/* Strength indicator */}
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
                    <span className="text-xs text-neutral-400 w-10">{strengthLabel}</span>
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
                    Create Account
                    <HiArrowRight className="text-base" />
                  </>
                )}
              </button>
            </form>

            {/* Sign in link */}
            <p className="text-center text-sm text-neutral-500 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-neutral-900 font-semibold hover:text-amber-600 transition-colors duration-200"
              >
                Sign in
              </button>
            </p>

            {/* Terms */}
            <p className="text-center text-xs text-neutral-400 mt-4 leading-relaxed">
              By creating an account you agree to our{" "}
              <span className="underline cursor-pointer hover:text-neutral-600 transition-colors">Terms of Service</span>{" "}
              and{" "}
              <span className="underline cursor-pointer hover:text-neutral-600 transition-colors">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createacct;

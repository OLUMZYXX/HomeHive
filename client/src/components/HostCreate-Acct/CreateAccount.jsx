import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { HiMail, HiLockClosed, HiPhone } from "react-icons/hi";
import { HiUser, HiHome, HiBuildingOffice2 } from "react-icons/hi2";
import { navigateToHome } from "../../utils/navigation";
import useScrollToTop from "../../hooks/useScrollToTop";
import { toast } from "sonner";
import { useAPI } from "../../contexts/APIContext";
import GoogleAuth from "../../config/googleAuth";

const Createacct = () => {
  useScrollToTop();

  const navigate = useNavigate();
  const location = useLocation();
  const { registerHost, googleAuth } = useAPI();

  const handleHomeNavigation = () => {
    navigateToHome(navigate, location);
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("individual");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = (password) =>
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!email.trim() || !isEmailValid(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!businessName.trim()) {
      setError("Business name is required");
      return;
    }
    if (!password || !isPasswordValid(password)) {
      setError(
        "Password must be at least 8 characters with uppercase and number",
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the terms and conditions");
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
        toast.success(
          "Host account created successfully! Welcome to HomeHive!",
          { duration: 4000 },
        );
        setTimeout(() => navigate("/host-dashboard"), 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create account. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
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
        toast.success(
          "Google account created successfully! Welcome to HomeHive!",
          { duration: 4000 },
        );
        setTimeout(() => navigate("/host-dashboard"), 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Google sign up failed. Please try again.";
      toast.error(errorMessage, { duration: 3000 });
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/hostlogin")}
        className="absolute top-6 left-6 flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors duration-300 font-medium z-20"
      >
        <FaArrowLeft className="text-sm" />
        <span>Back to Login</span>
      </button>

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-strong overflow-hidden border border-primary-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
          {/* Left Side: Branding & Benefits */}
          <div className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 p-8 lg:p-12 hidden lg:flex flex-col justify-center text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'></div>
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-8">
              {/* Logo */}
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={handleHomeNavigation}
              >
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <HiHome className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-NotoSans font-bold text-white">
                    Homehive
                  </h1>
                  <p className="text-primary-200 text-sm font-medium">
                    Host Portal
                  </p>
                </div>
              </div>

              {/* Hero Text */}
              <div className="space-y-4">
                <h2 className="font-NotoSans text-3xl lg:text-4xl font-bold leading-tight">
                  Start Your Hosting
                  <span className="block text-transparent bg-gradient-to-r from-primary-200 to-white bg-clip-text">
                    Journey Today
                  </span>
                </h2>
                <p className="text-lg text-primary-100 leading-relaxed">
                  Join thousands of hosts earning income by sharing their
                  properties with travelers worldwide.
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10 flex-shrink-0">
                    <span className="text-lg">💰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Earn Extra Income
                    </h3>
                    <p className="text-sm text-primary-200">
                      Turn your property into a reliable income stream
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10 flex-shrink-0">
                    <span className="text-lg">🛡️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Host Protection
                    </h3>
                    <p className="text-sm text-primary-200">
                      Comprehensive coverage for peace of mind
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10 flex-shrink-0">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Powerful Tools
                    </h3>
                    <p className="text-sm text-primary-200">
                      Analytics, calendar sync, and smart pricing
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10 flex-shrink-0">
                    <span className="text-lg">🌍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Global Reach
                    </h3>
                    <p className="text-sm text-primary-200">
                      Connect with travelers from around the world
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 mt-6">
                <p className="text-primary-100 italic mb-3">
                  &ldquo;I started hosting 6 months ago and it&apos;s been
                  life-changing. The platform makes everything so easy!&rdquo;
                </p>
                <div className="text-sm text-primary-200">
                  - Jennifer K., Superhost since 2024
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Sign Up Form */}
          <div className="p-6 lg:p-10 flex flex-col justify-center overflow-y-auto max-h-[90vh] lg:max-h-none">
            <div className="max-w-md mx-auto w-full space-y-6">
              {/* Mobile Logo */}
              <div
                className="lg:hidden flex items-center justify-center gap-3 cursor-pointer"
                onClick={handleHomeNavigation}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                  <HiHome className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-NotoSans font-bold text-primary-800">
                    Homehive
                  </h1>
                  <p className="text-primary-500 text-sm">Host Portal</p>
                </div>
              </div>

              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-full px-4 py-2 mb-2">
                  <HiUser className="text-primary-600 text-sm" />
                  <span className="text-sm font-medium text-primary-700">
                    Host Sign Up
                  </span>
                </div>
                <h2 className="font-NotoSans text-2xl lg:text-3xl font-bold text-primary-900">
                  Create Account
                </h2>
                <p className="text-primary-600">
                  Join our community and start hosting
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateAccount} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-primary-700">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiUser className="h-5 w-5 text-primary-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-primary-700">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiUser className="h-5 w-5 text-primary-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-primary-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiMail className="h-5 w-5 text-primary-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 text-sm"
                    />
                  </div>
                </div>

                {/* Business Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-primary-700">
                      Business Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiBuildingOffice2 className="h-5 w-5 text-primary-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Your business"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-primary-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiPhone className="h-5 w-5 text-primary-400" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Your phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-primary-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiLockClosed className="h-5 w-5 text-primary-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 text-sm"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-4 w-4 text-primary-500 hover:text-primary-700 transition-colors duration-300" />
                        ) : (
                          <FaEye className="h-4 w-4 text-primary-500 hover:text-primary-700 transition-colors duration-300" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-primary-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiLockClosed className="h-5 w-5 text-primary-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 text-sm"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-4 w-4 text-primary-500 hover:text-primary-700 transition-colors duration-300" />
                        ) : (
                          <FaEye className="h-4 w-4 text-primary-500 hover:text-primary-700 transition-colors duration-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-primary-500">
                  Password must be 8+ characters with uppercase and number
                </p>

                {/* Error Message */}
                {error && (
                  <div className="bg-error-50 border border-error-200 rounded-xl p-3">
                    <p className="text-error-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-primary-600 leading-relaxed"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="text-primary-800 font-semibold hover:underline"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-primary-800 font-semibold hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-800 hover:bg-primary-900 disabled:bg-primary-400 text-white font-semibold py-4 px-6 rounded-xl border border-primary-200 hover:border-primary-300 shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center gap-3 text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <HiUser className="text-lg" />
                      <span>Create Host Account</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-primary-500 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign Up Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                  className="w-full bg-white hover:bg-primary-50 border-2 border-primary-200 hover:border-primary-300 text-primary-800 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-soft hover:shadow-medium text-base"
                >
                  {isGoogleLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <FcGoogle className="w-6 h-6" />
                      <span>Sign up with Google</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="text-center pt-4 border-t border-primary-200">
                <p className="text-primary-600">
                  Already have a host account?{" "}
                  <button
                    onClick={() => navigate("/hostlogin")}
                    className="text-primary-800 hover:text-primary-900 font-semibold transition-colors duration-300"
                  >
                    Sign In
                  </button>
                </p>

                {/* Footer Links */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-primary-500 mt-4 pt-4 border-t border-primary-100">
                  <a
                    href="/privacy"
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                  <span className="text-primary-300">•</span>
                  <a
                    href="/terms"
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                  <span className="text-primary-300">•</span>
                  <a
                    href="/partner-help"
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    Help Center
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createacct;

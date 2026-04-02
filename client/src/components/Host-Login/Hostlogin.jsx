import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { HiHome } from "react-icons/hi2";
import { navigateToHome } from "../../utils/navigation";
import useScrollToTop from "../../hooks/useScrollToTop";
import { ButtonLoader } from "../common/Loader";
import { toast } from "sonner";
import { useAPI } from "../../contexts/APIContext";
import GoogleAuth from "../../config/googleAuth";
import { HostTokenManager } from "../../services/jwtAuthService";

const Hostlogin = () => {
  // Use scroll to top hook
  useScrollToTop();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get API functions
  const { login, googleAuth } = useAPI();

  // Smart home navigation handler
  const handleHomeNavigation = () => {
    navigateToHome(navigate, location);
  };

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isPasswordValid(password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Call the actual API login with isHost = true
      const result = await login(email, password, true);
      if (result?.token) {
        HostTokenManager.setTokens(result.token, result.refreshToken);
        HostTokenManager.setUserData(result.user || result.host);
      }
      if (result.success) {
        toast.success("Login successful! Welcome back to your dashboard!", {
          duration: 2000,
          className: "text-sm font-medium",
        });
        // Navigate to host dashboard
        setTimeout(() => {
          navigate("/host-dashboard");
        }, 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 3000,
        className: "text-sm font-medium",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // Initialize and sign in with Google
      await GoogleAuth.initialize();
      const googleUser = await GoogleAuth.signIn();

      // Call API with Google token
      const result = await googleAuth(googleUser.idToken, {
        email: googleUser.email,
        name: googleUser.name,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        picture: googleUser.picture,
        googleId: googleUser.id,
        isHost: true,
      });
      if (result?.token) {
        HostTokenManager.setTokens(result.token, result.refreshToken);
        HostTokenManager.setUserData(result.user || result.host);
      }
      if (result.success) {
        toast.success("Google login successful! Welcome to your dashboard!", {
          duration: 2000,
          className: "text-sm font-medium",
        });
        setTimeout(() => {
          navigate("/host-dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Google login failed. Please try again.";
      toast.error(errorMessage, {
        duration: 3000,
        className: "text-sm font-medium",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/host")}
        className="absolute top-6 left-6 flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors duration-300 font-medium z-20"
      >
        <FaArrowLeft className="text-sm" />
        <span>Back to Host</span>
      </button>

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-strong overflow-hidden border border-primary-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Side: Branding & Features */}
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
                  Welcome Back,
                  <span className="block text-transparent bg-gradient-to-r from-primary-200 to-white bg-clip-text">
                    Partner Host
                  </span>
                </h2>
                <p className="text-lg text-primary-100 leading-relaxed">
                  Access your dashboard to manage properties, track bookings,
                  and grow your hosting business.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-semibold text-white mb-1">Analytics</h3>
                  <p className="text-sm text-primary-200">
                    Track your earnings
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl mb-2">🏠</div>
                  <h3 className="font-semibold text-white mb-1">Listings</h3>
                  <p className="text-sm text-primary-200">Manage properties</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl mb-2">📅</div>
                  <h3 className="font-semibold text-white mb-1">Bookings</h3>
                  <p className="text-sm text-primary-200">View reservations</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl mb-2">💬</div>
                  <h3 className="font-semibold text-white mb-1">Messages</h3>
                  <p className="text-sm text-primary-200">
                    Guest communications
                  </p>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <p className="text-primary-100 italic mb-3">
                  &ldquo;Managing my properties has never been easier. The
                  dashboard is intuitive and powerful!&rdquo;
                </p>
                <div className="text-sm text-primary-200">
                  - Michael R., Superhost
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-8">
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
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-full px-4 py-2 mb-2">
                  <HiHome className="text-primary-600 text-sm" />
                  <span className="text-sm font-medium text-primary-700">
                    Host Login
                  </span>
                </div>
                <h2 className="font-NotoSans text-3xl lg:text-4xl font-bold text-primary-900">
                  Sign In
                </h2>
                <p className="text-lg text-primary-600">
                  Access your host dashboard
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-primary-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiMail className="h-5 w-5 text-primary-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-primary-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiLockClosed className="h-5 w-5 text-primary-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-primary-500 hover:text-primary-700 transition-colors duration-300" />
                      ) : (
                        <FaEye className="h-5 w-5 text-primary-500 hover:text-primary-700 transition-colors duration-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-error-50 border border-error-200 rounded-xl p-3">
                    <p className="text-error-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Forgot Password */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors duration-300"
                  >
                    Forgot your password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-800 hover:bg-primary-900 disabled:bg-primary-400 text-white font-semibold py-4 px-6 rounded-xl border border-primary-200 hover:border-primary-300 shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <ButtonLoader />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <HiHome className="text-lg" />
                      <span>Sign In to Dashboard</span>
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

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full bg-white hover:bg-primary-50 border-2 border-primary-200 hover:border-primary-300 text-primary-800 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-soft hover:shadow-medium"
                >
                  {isGoogleLoading ? (
                    <>
                      <ButtonLoader dark />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <FcGoogle className="w-6 h-6" />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center pt-6 border-t border-primary-200 mt-6">
                <p className="text-primary-600">
                  New to hosting with us?{" "}
                  <button
                    onClick={() => navigate("/host-signup")}
                    className="text-primary-800 hover:text-primary-900 font-semibold transition-colors duration-300"
                  >
                    Create Host Account
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

export default Hostlogin;

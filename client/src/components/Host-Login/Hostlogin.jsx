import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

import hostImg from "../../assets/homeexterior.jpg";
import { navigateToHome } from "../../utils/navigation";
import useScrollToTop from "../../hooks/useScrollToTop";
import { ButtonLoader } from "../common/Loader";
import { toast } from "sonner";
import { useAPI } from "../../contexts/APIContext";
import GoogleAuth from "../../config/googleAuth";
import { HostTokenManager } from "../../services/jwtAuthService";

const Hostlogin = () => {
  useScrollToTop();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleAuth } = useAPI();

  const handleHomeNavigation = () => navigateToHome(navigate, location);
  const isEmailValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const result = await login(email, password, true);
      if (result?.token) {
        HostTokenManager.setTokens(result.token, result.refreshToken);
        HostTokenManager.setUserData(result.user || result.host);
      }
      if (result.success) {
        toast.success("Welcome back to your dashboard!", { duration: 2000 });
        setTimeout(() => navigate("/host-dashboard"), 1000);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(msg);
      toast.error(msg, { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
        isHost: true,
      });
      if (result?.token) {
        HostTokenManager.setTokens(result.token, result.refreshToken);
        HostTokenManager.setUserData(result.user || result.host);
      }
      if (result.success) {
        toast.success("Welcome to your dashboard!", { duration: 2000 });
        setTimeout(() => navigate("/host-dashboard"), 1000);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Google login failed. Please try again.";
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
      {/* Left — cinematic image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={hostImg}
          alt="Host your property"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

        {/* Back to home */}
        <button
          onClick={handleHomeNavigation}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors duration-200"
        >
          <HiArrowLeft className="text-base" />
          HomeHive
        </button>

        {/* Branding overlay */}
        <div className="absolute bottom-12 left-10 right-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-amber-400" />
            <span className="text-amber-400 text-xs font-semibold tracking-[0.25em] uppercase">
              Host Portal
            </span>
          </div>
          <h1 className="font-Cormorant text-4xl xl:text-5xl font-light text-white leading-tight mb-3">
            Welcome back,
            <br />
            <span className="italic">partner host</span>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Manage your properties, track bookings, and grow your hosting
            business.
          </p>
          <blockquote className="mt-8 border-l-2 border-amber-400/60 pl-4">
            <p className="text-white/70 text-sm italic leading-relaxed">
              &ldquo;Managing my properties has never been easier. The dashboard
              is intuitive and powerful.&rdquo;
            </p>
            <cite className="text-white/40 text-xs mt-2 block not-italic">
              — Michael R., Superhost
            </cite>
          </blockquote>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex flex-col">
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

        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-amber-500" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600">
                  Host Sign In
                </span>
              </div>
              <h2 className="font-Cormorant text-4xl font-light text-neutral-900 mb-2">
                Sign in to your <span className="italic">dashboard</span>
              </h2>
              <p className="text-neutral-500 text-sm">
                Access your properties and bookings
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-2">
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

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-11`}
                    autoComplete="current-password"
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
                className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-sm font-medium tracking-[0.15em] uppercase py-4 flex items-center justify-center gap-2 transition-colors duration-200"
              >
                {isLoading ? (
                  <ButtonLoader />
                ) : (
                  <>
                    Sign In
                    <HiArrowRight className="text-base" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-400 font-medium">or</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 border border-neutral-200 hover:border-neutral-400 bg-white text-neutral-700 text-sm font-medium py-3.5 transition-colors duration-200 disabled:opacity-50"
            >
              <FcGoogle className="text-lg" />
              {isGoogleLoading ? "Signing in…" : "Continue with Google"}
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm text-neutral-500 mt-8">
              New to hosting?{" "}
              <button
                onClick={() => navigate("/host-signup")}
                className="text-neutral-900 font-semibold hover:text-amber-600 transition-colors duration-200"
              >
                Create host account
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

export default Hostlogin;

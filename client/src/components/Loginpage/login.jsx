import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import loginImg from "../../assets/login.jpg";
import { toast } from "../../utils/toast.jsx";
import { navigateToHome } from "../../utils/navigation";
import useScrollToTop from "../../hooks/useScrollToTop";
import { ButtonLoader } from "../common/Loader";
import { useAPI } from "../../contexts/APIContext";
import { FcGoogle } from "react-icons/fc";
import GoogleAuth from "../../config/googleAuth";
import { TokenManager } from "../../services/jwtAuthService";

const Login = () => {
  useScrollToTop();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleAuth } = useAPI();

  const handleHomeNavigation = () => navigateToHome(navigate, location);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
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
      const result = await login(email, password, false);
      if (result?.token) {
        TokenManager.setTokens(result.token, result.refreshToken);
        TokenManager.setUserData(result.user);
      }
      toast.success("Welcome back!");
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      setTimeout(() => navigate(redirectPath), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      setError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — cinematic image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={loginImg}
          alt="Luxury accommodation"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

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
              Premium Stays
            </span>
          </div>
          <h1 className="font-Cormorant text-4xl xl:text-5xl font-light text-white leading-tight mb-3">
            Welcome back to<br />
            <span className="italic">HomeHive</span>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Discover exceptional accommodations across Nigeria's finest cities.
          </p>
          <blockquote className="mt-8 border-l-2 border-amber-400/60 pl-4">
            <p className="text-white/70 text-sm italic leading-relaxed">
              "The best accommodation platform I've used. Exceptional quality and service."
            </p>
            <cite className="text-white/40 text-xs mt-2 block not-italic">— Sarah J., Verified Guest</cite>
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
          <span className="font-Cormorant text-xl font-semibold text-neutral-800">HomeHive</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-amber-500" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600">
                  Sign In
                </span>
              </div>
              <h2 className="font-Cormorant text-4xl font-light text-neutral-900 mb-2">
                Welcome <span className="italic">back</span>
              </h2>
              <p className="text-neutral-500 text-sm">
                Sign in to continue your journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
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
                  className="w-full px-4 py-3 border border-neutral-200 hover:border-neutral-400 focus:border-neutral-800 focus:outline-none bg-white text-neutral-800 placeholder-neutral-400 text-sm transition-colors duration-200"
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
                    className="w-full px-4 py-3 pr-11 border border-neutral-200 hover:border-neutral-400 focus:border-neutral-800 focus:outline-none bg-white text-neutral-800 placeholder-neutral-400 text-sm transition-colors duration-200"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
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
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-neutral-900 font-semibold hover:text-amber-600 transition-colors duration-200"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

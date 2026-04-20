import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const KEYFRAMES = `
@keyframes hh-slide {
  0%   { transform: translateX(-110%); }
  100% { transform: translateX(110%); }
}
@keyframes hh-dot {
  0%, 80%, 100% { transform: scale(0.5); opacity: 0.35; }
  40%           { transform: scale(1);   opacity: 1;    }
}
`;

const ProgressBar = ({ width = 120 }) => (
  <div
    className="relative h-px overflow-hidden bg-neutral-200"
    style={{ width }}
  >
    <span
      className="absolute inset-y-0 w-1/3 bg-amber-500"
      style={{ animation: "hh-slide 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite" }}
    />
  </div>
);

ProgressBar.propTypes = { width: PropTypes.number };

const Dots = () => (
  <div className="flex items-center gap-1.5">
    {[0, 160, 320].map((d) => (
      <span
        key={d}
        className="w-1.5 h-1.5 rounded-full bg-neutral-900"
        style={{
          animation: "hh-dot 1.2s ease-in-out infinite",
          animationDelay: `${d}ms`,
        }}
      />
    ))}
  </div>
);

const Wordmark = ({ size = "text-3xl" }) => (
  <h1
    className={`font-Cormorant ${size} font-light text-neutral-900 tracking-wide leading-none`}
  >
    Home<span className="text-amber-500">Hive</span>
  </h1>
);

Wordmark.propTypes = { size: PropTypes.string };

const PageLoader = ({ children, duration = 3000 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [variant, setVariant] = useState("spinner");
  const location = useLocation();

  useEffect(() => {
    const excludedPaths = [
      "/login",
      "/signin",
      "/signup",
      "/create-account",
      "/host-login",
      "/host-create-account",
    ];

    if (excludedPaths.includes(location.pathname)) {
      setIsLoading(false);
      return;
    }

    const isHomePage =
      location.pathname === "/" || location.pathname === "/home";
    const isFirstVisit = !sessionStorage.getItem("hasVisited");

    if (isHomePage && (isFirstVisit || performance.navigation?.type === 1)) {
      setVariant("full");
      sessionStorage.setItem("hasVisited", "true");
    } else {
      setVariant("spinner");
    }

    const timer = setTimeout(() => setIsLoading(false), duration);
    return () => clearTimeout(timer);
  }, [duration, location.pathname]);

  const FullContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      className="flex flex-col items-center gap-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-amber-500" />
        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
          HomeHive
        </span>
        <div className="w-8 h-px bg-amber-500" />
      </div>

      <h1 className="font-Cormorant text-5xl sm:text-6xl font-light text-neutral-900 leading-none text-center">
        Your perfect{" "}
        <span className="italic">stay</span>
        <br />
        <span className="italic text-amber-500">awaits</span>
      </h1>

      <div className="flex flex-col items-center gap-4 mt-2">
        <ProgressBar width={160} />
        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400">
          Preparing your experience
        </span>
      </div>
    </motion.div>
  );

  const SpinnerContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="flex flex-col items-center gap-5"
    >
      <Wordmark size="text-2xl" />
      <div className="flex items-center gap-4">
        <Dots />
      </div>
    </motion.div>
  );

  return (
    <>
      <style>{KEYFRAMES}</style>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
            className={`fixed inset-0 z-[9999] flex items-center justify-center ${
              variant === "full"
                ? "bg-white"
                : "bg-white/85 backdrop-blur-md"
            }`}
          >
            {/* Subtle dot pattern (full variant only) */}
            {variant === "full" && (
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #171717 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
            )}

            {/* Amber accent line — left edge */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />

            <div className="relative">
              {variant === "full" ? <FullContent /> : <SpinnerContent />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`transition-all duration-500 ${
          isLoading
            ? "blur-sm opacity-50 pointer-events-none"
            : "blur-none opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
};

PageLoader.propTypes = {
  children: PropTypes.node.isRequired,
  duration: PropTypes.number,
};

export default PageLoader;

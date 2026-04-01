import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Location from "./components/location/Location";
import Footer from "./components/Footer/Footer";

const Header = lazy(() => import("./components/Header/Header"));
const Featured = lazy(() => import("./components/Featured/Featured"));
const PopularDestinations = lazy(
  () => import("./components/PopularDestinations/PopularDestinations"),
);
const About = lazy(() => import("./components/why choose us/About"));
const HostCTA = lazy(() => import("./components/HostCTA/HostCTA"));
const Testimonial = lazy(() => import("./components/Testimonial/Testimonial"));
const CustomerCare = lazy(
  () => import("./components/Customer Care/CustomerCare"),
);

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-0.5 w-16 bg-amber-400/60 animate-pulse" />
      <div className="h-3 bg-neutral-100 rounded-full w-48 animate-pulse" />
      <div className="h-3 bg-neutral-100 rounded-full w-32 animate-pulse" />
    </div>
  </div>
);

// Review platform trust strip
const RatingsStrip = () => (
  <div className="bg-white border-t border-b border-neutral-100 py-5">
    <div className="container mx-auto px-4 sm:px-6 max-w-screen-xl">
      <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
        {[
          { initial: "B", label: "Booking.com", score: "4.9/5", verdict: "Excellent", color: "bg-blue-600" },
          { initial: "G", label: "Google Reviews", score: "5/5", verdict: "Excellent", color: "bg-green-600" },
          { initial: "T", label: "Trustpilot", score: "4.8/5", verdict: "Great", color: "bg-emerald-500" },
        ].map((platform) => (
          <div key={platform.label} className="flex items-center gap-3">
            <div className={`w-9 h-9 ${platform.color} rounded text-white text-base font-bold flex items-center justify-center flex-shrink-0`}>
              {platform.initial}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-neutral-800">{platform.score}</span>
                <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-medium text-amber-600">{platform.verdict}</span>
              </div>
              <div className="text-xs text-neutral-400">{platform.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

function Home() {
  return (
    <div className="overflow-x-hidden bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* ① Hero — full-screen cinematic */}
        <Hero />

        {/* ② Review platform trust strip */}
        <RatingsStrip />

        {/* ③ Search widget */}
        <Location />

        {/* ④ Welcome / Header highlights */}
        <Suspense fallback={<SectionFallback />}>
          <Header />
        </Suspense>

        {/* ⑤ Top-rated featured properties */}
        <Suspense fallback={<SectionFallback />}>
          <Featured />
        </Suspense>

        {/* ⑥ Popular destinations by city */}
        <Suspense fallback={<SectionFallback />}>
          <PopularDestinations />
        </Suspense>

        {/* ⑦ Why Choose HomeHive */}
        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>

        {/* ⑧ Become a Host CTA */}
        <Suspense fallback={<SectionFallback />}>
          <HostCTA />
        </Suspense>

        {/* ⑨ Guest reviews */}
        <Suspense fallback={<SectionFallback />}>
          <Testimonial />
        </Suspense>

        {/* ⑩ Support / Contact */}
        <Suspense fallback={<SectionFallback />}>
          <CustomerCare />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default Home;

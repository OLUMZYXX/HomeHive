"use client";
import { useState, useEffect, useCallback } from "react";
import heroimg from "../../assets/heroimg.png";
import { useNavigate } from "react-router-dom";
import { HiArrowRight, HiRefresh } from "react-icons/hi";
import { useAPI } from "../../contexts/APIContext";

const Hero = () => {
  const navigate = useNavigate();
  const { getPremiumImages, isAuthenticated } = useAPI();

  const [currentImage, setCurrentImage] = useState(heroimg);
  const [premiumImages, setPremiumImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [prevImage, setPrevImage] = useState(null);
  const [fade, setFade] = useState(true);

  const fetchPremiumImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setImageError(false);
      const response = await getPremiumImages();
      if (response?.images && Array.isArray(response.images) && response.images.length > 0) {
        const validImages = response.images.filter((img) => {
          const url = img.imageUrl || img.url || img;
          return url && typeof url === "string" && url.trim() !== "";
        });
        if (validImages.length > 0) {
          setPremiumImages(validImages);
          setCurrentImage(validImages[0].imageUrl || validImages[0].url || validImages[0]);
          setImageIndex(0);
          return;
        }
      }
      setCurrentImage(heroimg);
      setPremiumImages([]);
    } catch {
      setCurrentImage(heroimg);
      setPremiumImages([]);
      setImageError(true);
    } finally {
      setIsLoading(false);
    }
  }, [getPremiumImages]);

  useEffect(() => {
    fetchPremiumImages();
  }, [fetchPremiumImages]);

  // Cross-fade rotation
  useEffect(() => {
    if (premiumImages.length > 1) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setImageIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % premiumImages.length;
            const next = premiumImages[nextIndex];
            setPrevImage(currentImage);
            setCurrentImage(next.imageUrl || next.url || next);
            return nextIndex;
          });
          setFade(true);
        }, 600);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [premiumImages, currentImage]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setCurrentImage(heroimg);
  }, []);

  const handleExploreClick = () => {
    if (isAuthenticated) {
      navigate("/listings");
    } else {
      navigate("/signin");
    }
  };

  const handleScrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background Image — prev layer for crossfade */}
      {prevImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${prevImage})` }}
        />
      )}

      {/* Background Image — current */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
        style={{
          backgroundImage: `url(${currentImage})`,
          opacity: fade ? 1 : 0,
        }}
        onError={handleImageError}
      />

      {/* Dark gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

      {/* Loading shimmer */}
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white/80 rounded-full animate-spin" />
        </div>
      )}

      {/* Refresh button (top-right, subtle) */}
      {!imageError && premiumImages.length > 0 && (
        <button
          onClick={() => !isLoading && fetchPremiumImages()}
          disabled={isLoading}
          className="absolute top-24 right-6 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white/70 hover:text-white p-2 rounded-full transition-all duration-200 disabled:opacity-40"
          title="Refresh images"
        >
          <HiRefresh className={`text-sm ${isLoading ? "animate-spin" : ""}`} />
        </button>
      )}

      {/* Left edge — thin gold accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-amber-400/60 to-transparent z-10" />

      {/* SCROLL label — vertical right side */}
      <button
        onClick={handleScrollDown}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3 group hidden lg:flex"
      >
        <span
          className="text-white/60 group-hover:text-white/90 text-xs font-medium tracking-[0.3em] uppercase transition-colors duration-300"
          style={{ writingMode: "vertical-rl", letterSpacing: "0.3em" }}
        >
          Scroll
        </span>
        <div className="w-px h-16 bg-white/40 group-hover:bg-white/70 transition-colors duration-300 relative overflow-hidden">
          <div className="absolute top-0 w-full bg-white/90 animate-[slideDown_2s_ease-in-out_infinite]" style={{ height: "30%" }} />
        </div>
      </button>

      {/* Navigation arrows */}
      {premiumImages.length > 1 && (
        <>
          <button
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setImageIndex((prev) => {
                  const next = (prev - 1 + premiumImages.length) % premiumImages.length;
                  const img = premiumImages[next];
                  setCurrentImage(img.imageUrl || img.url || img);
                  return next;
                });
                setFade(true);
              }, 300);
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white/70 hover:text-white hover:border-white/80 hover:bg-white/10 transition-all duration-200"
            aria-label="Previous image"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setImageIndex((prev) => {
                  const next = (prev + 1) % premiumImages.length;
                  const img = premiumImages[next];
                  setCurrentImage(img.imageUrl || img.url || img);
                  return next;
                });
                setFade(true);
              }, 300);
            }}
            className="absolute right-20 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white/70 hover:text-white hover:border-white/80 hover:bg-white/10 transition-all duration-200 hidden lg:flex"
            aria-label="Next image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Hero Content — centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-6">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Main heading — Cormorant Garant serif */}
        <h1
          className="font-Cormorant text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-none tracking-wide mb-4"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.3)" }}
        >
          Gateway to your
          <br />
          <span className="italic font-normal">Perfect Stay</span>
        </h1>

        {/* Subtitle */}
        <p className="font-NotoSans text-white/75 text-base sm:text-lg max-w-xl mt-4 mb-10 font-light leading-relaxed">
          Located across Nigeria's finest cities, HomeHive offers curated luxury
          accommodations for the perfect stay.
        </p>

        {/* CTA */}
        <button
          onClick={handleExploreClick}
          className="group inline-flex items-center gap-3 text-white/90 hover:text-white border border-white/50 hover:border-white px-10 py-4 text-sm font-medium tracking-[0.25em] uppercase transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
        >
          Explore
          <HiArrowRight className="text-base group-hover:translate-x-1.5 transition-transform duration-300" />
        </button>

        {/* Image counter dots */}
        {premiumImages.length > 1 && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {premiumImages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setFade(false);
                  setTimeout(() => {
                    const img = premiumImages[i];
                    setCurrentImage(img.imageUrl || img.url || img);
                    setImageIndex(i);
                    setFade(true);
                  }, 300);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === imageIndex
                    ? "w-6 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-stretch">
        {/* Since tag */}
        <div className="flex items-center gap-4 bg-white px-8 py-4">
          <div>
            <div className="text-xs font-semibold text-neutral-400 tracking-widest uppercase">Since</div>
            <div className="text-2xl font-bold text-neutral-800 leading-none font-Cormorant">2020</div>
          </div>
          <div className="w-px h-10 bg-neutral-200" />
          <div className="text-xs text-neutral-500 tracking-wider uppercase font-medium leading-tight">
            Nigeria's Trusted<br />Property Platform
          </div>
        </div>

        {/* Our Story button */}
        <button
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white px-7 py-4 text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
        >
          Our Story
          <HiArrowRight className="text-sm" />
        </button>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-8 ml-auto bg-black/50 backdrop-blur-sm px-10 py-4">
          <div className="text-center">
            <div className="text-white font-semibold text-lg font-Cormorant">500+</div>
            <div className="text-white/60 text-xs tracking-wider uppercase font-medium">Properties</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-semibold text-lg font-Cormorant">4.9/5</span>
            </div>
            <div className="text-white/60 text-xs tracking-wider uppercase font-medium">Guest Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

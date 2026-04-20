import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiArrowRight,
  HiShieldCheck,
  HiStar,
  HiSparkles,
  HiCash,
  HiLockClosed,
  HiUserGroup,
  HiSupport,
  HiCog,
  HiCheck,
} from "react-icons/hi";
import { FaChevronDown } from "react-icons/fa";

import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

import { hostAuth } from "../../config/firebaseConfig";
import { useAPI } from "../../contexts/APIContext";

import img from "../../assets/livning room.jpg";
import img2 from "../../assets/home.jpg";

const Host = () => {
  const navigate = useNavigate();
  const { user: apiUser, isAuthenticated } = useAPI();
  const [user, setUser] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (apiUser && isAuthenticated && apiUser.userType === "host") {
      setUser(apiUser);
    } else {
      const unsubscribe = hostAuth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser && !apiUser) setUser(firebaseUser);
        else if (!firebaseUser && !apiUser) setUser(null);
      });
      return () => unsubscribe();
    }
  }, [apiUser, isAuthenticated]);

  const isHostAuthed = Boolean(user);
  const hostSignIn = () => navigate("/hostlogin");
  const hostSignUp = () => navigate("/host-signup");
  const goDashboard = () => navigate("/host-dashboard");

  const benefits = [
    {
      icon: HiShieldCheck,
      title: "Damage Protection",
      description:
        "Your property is covered in case of unexpected damages, ensuring peace of mind while hosting.",
    },
    {
      icon: HiCog,
      title: "Set Your House Rules",
      description:
        "Define your house rules clearly — guests must agree before booking, giving you full control.",
    },
    {
      icon: HiSparkles,
      title: "Flexible Booking",
      description:
        "Choose between instant bookings for quick reservations or manual approvals for full control.",
    },
    {
      icon: HiLockClosed,
      title: "Liability Coverage",
      description:
        "Protection against liability claims from guests and neighbours, covering up to ₦1,000,000 per stay.",
    },
    {
      icon: HiCash,
      title: "Secure Payouts",
      description:
        "Fast, fraud-protected payouts through our secure payment system — your earnings stay safe.",
    },
    {
      icon: HiUserGroup,
      title: "Verified Guests",
      description:
        "We verify guest emails and payment details to ensure reliable, trustworthy bookings every time.",
    },
  ];

  const features = [
    {
      number: "01",
      title: "Showcase Your Reviews",
      description:
        "Bring existing reviews with you. We import ratings from other platforms so your listing starts with credibility.",
    },
    {
      number: "02",
      title: "Effortless Property Sync",
      description:
        "Import property details and keep availability automatically synced across platforms to prevent double bookings.",
    },
    {
      number: "03",
      title: "Boost Your Visibility",
      description:
        'New hosts get a "Fresh Listing" badge — helping you stand out and attract more bookings from day one.',
    },
  ];

  const testimonials = [
    {
      name: "Emily Roberts",
      location: "France-based host",
      text: "The exposure my property got was amazing. I had bookings lined up faster than I expected, and the experience has been fantastic.",
      image: img,
    },
    {
      name: "Nathan Kim",
      location: "South Korea-based host",
      text: "I was worried about double bookings, but Homehive's sync feature worked flawlessly. My first guest booked within hours.",
      image: img2,
    },
    {
      name: "Sophia Martinez",
      location: "Spain-based host",
      text: "I never imagined getting bookings so fast. Homehive made the process seamless, and I was hosting in no time.",
      image: img2,
    },
    {
      name: "Liam Chen",
      location: "Australia-based host",
      text: "The platform is user-friendly, and syncing my calendar was a breeze. I had my first guest within the same day.",
      image: img,
    },
    {
      name: "Olivia Dube",
      location: "Canada-based host",
      text: "Homehive made everything simple. From listing to payments, the entire process was smooth, and I felt supported throughout.",
      image: img,
    },
    {
      name: "Alex Carter",
      location: "U.S.-based host",
      text: "Setting up my listing was incredibly easy. Within an hour, I had multiple inquiries and my first confirmed guest.",
      image: img2,
    },
  ];

  const faqs = [
    {
      question: "How does Homehive work?",
      answer: (
        <div className="space-y-4">
          <p className="text-neutral-500 text-sm leading-relaxed">
            Homehive makes it easy for homeowners to list their properties and
            connect with guests. Here&apos;s how:
          </p>
          <div className="grid gap-3">
            {[
              {
                step: "1.",
                title: "Create Your Listing",
                body: "Register, add photos, descriptions, and set your pricing.",
              },
              {
                step: "2.",
                title: "Set Preferences",
                body: "Choose availability, house rules, and booking preferences.",
              },
              {
                step: "3.",
                title: "Start Hosting",
                body: "Go live and start receiving bookings with secure payments.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="border border-neutral-100 p-4 flex gap-4"
              >
                <span className="font-Cormorant text-2xl font-light text-amber-500 leading-none">
                  {s.step}
                </span>
                <div>
                  <h4 className="font-semibold text-neutral-900 text-sm mb-1">
                    {s.title}
                  </h4>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      question: "What happens if my property is damaged by a guest?",
      answer: (
        <p className="text-neutral-500 text-sm leading-relaxed">
          If a guest causes damage to your property, you have the option to
          request a damage deposit. This deposit acts as a safeguard, ensuring
          guests take responsibility for their stay. You can report issues using
          our misconduct reporting feature for assistance in resolving matters.
        </p>
      ),
    },
    {
      question: "When will my home or property go online?",
      answer: (
        <p className="text-neutral-500 text-sm leading-relaxed">
          After completing your listing, you can make your property available
          for bookings immediately. In some cases, verification may be required
          before accepting reservations. During this process, you can explore
          our platform and get everything ready for your first guests.
        </p>
      ),
    },
  ];

  const SectionLabel = ({ children }) => (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-px bg-amber-500" />
      <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600">
        {children}
      </span>
    </div>
  );

  return (
    <div className="overflow-x-hidden bg-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* ════════════════════════════════════════════════════
            ① Hero — dark, editorial
        ════════════════════════════════════════════════════ */}
        <section className="relative bg-neutral-900 text-white overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Amber accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-amber-500/60 to-transparent" />

          <div className="relative container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left — copy */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-amber-500" />
                  <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400">
                    For Property Owners
                  </span>
                </div>

                <h1 className="font-Cormorant text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.05] tracking-wide">
                  List your
                  <br />
                  <span className="italic font-normal text-amber-300">
                    Property
                  </span>{" "}
                  on
                  <br />
                  HomeHive
                </h1>

                <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-md font-light">
                  Whether hosting is your side hustle or your main business,
                  list your home on Homehive and start earning effortlessly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={isHostAuthed ? goDashboard : hostSignUp}
                    className="group inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium tracking-widest uppercase px-8 py-4 transition-colors duration-300"
                  >
                    {isHostAuthed ? "Go to Dashboard" : "Get Started Today"}
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                  {!isHostAuthed && (
                    <button
                      onClick={hostSignIn}
                      className="inline-flex items-center justify-center border border-white/20 hover:border-white/50 text-white/70 hover:text-white text-sm font-medium tracking-widest uppercase px-8 py-4 transition-all duration-300"
                    >
                      Host Sign In
                    </button>
                  )}
                </div>
              </div>

              {/* Right — registration card */}
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  {/* Decorative cards behind */}
                  <div className="absolute inset-0 border border-white/5 transform rotate-3 scale-[0.97] translate-y-2" />
                  <div className="absolute inset-0 border border-white/10 transform rotate-1.5 scale-[0.985]" />

                  {/* Main card */}
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 space-y-7">
                    <div className="flex items-center justify-between">
                      <span className="font-Cormorant text-xl font-light text-white">
                        Registration is Free
                      </span>
                      <div className="px-2.5 py-1 border border-amber-500/40 text-amber-400 text-[10px] font-semibold tracking-widest uppercase">
                        Free
                      </div>
                    </div>

                    <ul className="space-y-3.5">
                      {[
                        "45% of hosts get their first booking within a week",
                        "Choose between instant bookings or booking requests",
                        "We facilitate secure payments for you",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <div className="w-5 h-5 border border-amber-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <HiCheck className="text-amber-400 text-xs" />
                          </div>
                          <span className="text-neutral-300 text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-5 border-t border-white/10">
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-3">
                        What you&apos;ll need
                      </p>
                      <div className="space-y-2 text-neutral-300 text-sm">
                        <div className="flex items-center gap-2.5">
                          <span className="w-1 h-1 bg-amber-500 rounded-full" />
                          A clear photo of your property
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-1 h-1 bg-amber-500 rounded-full" />
                          A clear photo of yourself
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={isHostAuthed ? goDashboard : hostSignUp}
                      className="group w-full inline-flex items-center justify-center gap-3 border border-white/30 hover:border-amber-500 hover:bg-amber-500 text-white text-xs font-semibold tracking-[0.2em] uppercase px-6 py-4 transition-all duration-300"
                    >
                      {isHostAuthed ? "Open Dashboard" : "Get Started"}
                      <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            ② Benefits — divide layout
        ════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6">
              <div>
                <SectionLabel>Host Protection</SectionLabel>
                <h2 className="font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1]">
                  List with <span className="italic">Peace of Mind</span>
                </h2>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-sm lg:text-right">
                Every listing on HomeHive comes with built-in protection,
                flexible controls, and trusted guest verification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-neutral-100 border border-neutral-100">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`group p-8 flex flex-col gap-6 hover:bg-neutral-50 transition-colors duration-300 ${
                    index >= 3 ? "sm:border-t sm:border-neutral-100" : ""
                  }`}
                >
                  <div className="w-10 h-10 border border-neutral-200 group-hover:border-amber-400 flex items-center justify-center transition-colors duration-300">
                    <benefit.icon className="text-neutral-500 group-hover:text-amber-500 text-base transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="font-Cormorant text-xl font-semibold text-neutral-800 mb-2 leading-snug">
                      {benefit.title}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={isHostAuthed ? goDashboard : hostSignUp}
                className="group inline-flex items-center gap-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 transition-colors duration-300"
              >
                List Your Property
                <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            ③ Features — Get Noticed
        ════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-24 bg-neutral-50 border-y border-neutral-100">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="w-8 h-px bg-amber-500" />
                <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600">
                  Stand Out From Day One
                </span>
                <div className="w-8 h-px bg-amber-500" />
              </div>
              <h2 className="font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1]">
                Get Noticed <span className="italic">Instantly</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-100">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white p-10 flex flex-col gap-6 hover:bg-neutral-50 transition-colors duration-300"
                >
                  <span className="font-Cormorant text-6xl font-light text-neutral-100 group-hover:text-amber-100 transition-colors duration-300 leading-none">
                    {feature.number}
                  </span>
                  <div>
                    <h3 className="font-Cormorant text-2xl font-semibold text-neutral-900 mb-3 leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={isHostAuthed ? goDashboard : hostSignUp}
                className="group inline-flex items-center gap-3 border border-neutral-900 hover:bg-neutral-900 text-neutral-900 hover:text-white text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 transition-all duration-300"
              >
                Import Your Listings
                <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            ④ Testimonials — host stories
        ════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-px bg-amber-500" />
                  <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600 flex items-center gap-2">
                    <HiStar className="text-amber-500 text-sm" />
                    Host Stories
                  </span>
                </div>
                <h2 className="font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1]">
                  Real Stories from{" "}
                  <span className="italic">HomeHive Hosts</span>
                </h2>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-sm lg:text-right">
                A growing community of hosts earning, growing, and building
                their businesses on HomeHive every day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-100 border border-neutral-100">
              {testimonials.map((testimonial, index) => (
                <article
                  key={index}
                  className="group bg-white p-8 flex flex-col justify-between gap-6 hover:bg-neutral-50 transition-colors duration-300"
                >
                  <div>
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <HiStar key={i} className="text-amber-400 text-sm" />
                      ))}
                    </div>
                    <p className="font-Cormorant text-lg font-light text-neutral-700 leading-relaxed italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-5 border-t border-neutral-100">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-11 h-11 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <p className="font-semibold text-neutral-900 text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-neutral-400 tracking-wide">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={isHostAuthed ? goDashboard : hostSignUp}
                className="group inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 transition-colors duration-300"
              >
                Join HomeHive Hosts
                <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            ⑤ FAQ
        ════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-24 bg-neutral-50 border-y border-neutral-100">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="w-8 h-px bg-amber-500" />
                <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600 flex items-center gap-2">
                  <HiSupport className="text-amber-500 text-sm" />
                  Frequently Asked
                </span>
                <div className="w-8 h-px bg-amber-500" />
              </div>
              <h2 className="font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1]">
                Your Questions <span className="italic">Answered</span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto bg-white border border-neutral-100 divide-y divide-neutral-100">
              {faqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <div key={index}>
                    <button
                      onClick={() => setOpenFaq(open ? null : index)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200 group"
                    >
                      <h3 className="font-Cormorant text-xl font-semibold text-neutral-900 pr-6 leading-snug">
                        {faq.question}
                      </h3>
                      <span
                        className={`w-8 h-8 border border-neutral-200 group-hover:border-amber-400 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          open ? "bg-amber-500 border-amber-500" : ""
                        }`}
                      >
                        <FaChevronDown
                          className={`text-[10px] transition-all duration-300 ${
                            open ? "text-white rotate-180" : "text-neutral-500"
                          }`}
                        />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                              duration: 0.3,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: { duration: 0.2 },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2">{faq.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center space-y-5">
              <p className="text-neutral-500 text-sm">
                Still have questions? Find more answers on our{" "}
                <Link
                  to="/faq"
                  className="text-neutral-900 font-semibold underline underline-offset-4 decoration-amber-500 hover:decoration-2 transition-all"
                >
                  FAQ page
                </Link>
                .
              </p>
              <button
                onClick={isHostAuthed ? goDashboard : hostSignUp}
                className="group inline-flex items-center gap-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 transition-colors duration-300"
              >
                Start Welcoming Guests
                <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            ⑥ Final CTA — dark
        ════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-neutral-900 py-20 lg:py-28">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-amber-500/60 to-transparent" />

          <div className="relative container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-px bg-amber-500" />
                  <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400">
                    Ready to Begin
                  </span>
                </div>
                <h2 className="font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.05] mb-6">
                  List your property and start
                  <br />
                  <span className="italic">hosting with ease</span>
                </h2>
                <p className="text-neutral-400 text-base leading-relaxed max-w-md">
                  Join hundreds of hosts already earning across Nigeria. Sign up
                  in minutes — your first booking could be days away.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 space-y-7">
                <div className="flex items-center justify-between">
                  <h3 className="font-Cormorant text-2xl font-light text-white">
                    Get started in minutes
                  </h3>
                  <span className="text-3xl">🏠</span>
                </div>

                <ul className="space-y-4">
                  {[
                    "Registration is completely free",
                    "45% of hosts get bookings within a week",
                    "Secure payment processing included",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                      <span className="text-neutral-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={isHostAuthed ? goDashboard : hostSignUp}
                  className="group w-full inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold tracking-[0.2em] uppercase px-6 py-4 transition-colors duration-300"
                >
                  {isHostAuthed ? "Open Dashboard" : "Get Started Now"}
                  <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                {!isHostAuthed && (
                  <p className="text-center text-neutral-500 text-xs">
                    Already a host?{" "}
                    <button
                      onClick={hostSignIn}
                      className="text-amber-400 hover:text-amber-300 font-semibold tracking-wide uppercase text-[11px]"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Host;

import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { HiArrowUp, HiArrowRight } from "react-icons/hi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const cols = [
    {
      heading: "Company",
      links: [
        { name: "About Us", to: "/about" },
        { name: "Our Story", to: "/story" },
        { name: "Careers", to: "/careers" },
        { name: "Press", to: "/press" },
      ],
    },
    {
      heading: "Services",
      links: [
        { name: "Browse Listings", to: "/listings" },
        { name: "Become a Host", to: "/host" },
        { name: "Testimonials", hash: "#testimonial" },
        { name: "Contact Support", hash: "#support" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { name: "Privacy Policy", to: "/privacy" },
        { name: "Terms of Service", to: "/terms" },
        { name: "Cookie Policy", to: "/cookies" },
        { name: "GDPR", to: "/gdpr" },
      ],
    },
  ];

  const socials = [
    { icon: FaFacebook, href: "https://facebook.com/homehive", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com/homehive", label: "Twitter" },
    { icon: FaInstagram, href: "https://instagram.com/homehive", label: "Instagram" },
    { icon: FaLinkedin, href: "https://linkedin.com/company/homehive", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-neutral-900 text-white [content-visibility:auto] [contain-intrinsic-size:1px_500px]">
      {/* Amber top border */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16 border-b border-white/10">

          {/* Brand col */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-Cormorant text-3xl font-light text-white mb-3">
                Home<span className="text-amber-400">Hive</span>
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
                Discover exceptional accommodations across Nigeria's finest cities.
                Your perfect stay, effortlessly booked.
              </p>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-3">
                Stay Updated
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex border border-white/10 hover:border-white/20 transition-colors"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 bg-amber-500 hover:bg-amber-600 text-white transition-colors duration-200 flex items-center"
                  aria-label="Subscribe"
                >
                  <HiArrowRight className="text-sm" />
                </button>
              </form>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              {[
                { icon: FaMapMarkerAlt, text: "Lagos, Nigeria" },
                { icon: FaPhone, text: "+234 800 123 4567" },
                { icon: FaEnvelope, text: "hello@homehive.com" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon className="text-amber-400/70 text-sm flex-shrink-0" />
                  <span className="text-neutral-400 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link cols */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {cols.map((col) => (
              <div key={col.heading}>
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-5">
                  {col.heading}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      {link.hash ? (
                        <button
                          onClick={() =>
                            document
                              .querySelector(link.hash)
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                          className="text-neutral-500 hover:text-white text-sm transition-colors duration-200"
                        >
                          {link.name}
                        </button>
                      ) : (
                        <Link
                          to={link.to}
                          className="text-neutral-500 hover:text-white text-sm transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-neutral-500 text-xs">
            © {currentYear} HomeHive. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 border border-white/10 hover:border-white/30 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="text-neutral-500 hover:text-white text-xs transition-colors duration-200" />
                </a>
              ))}
            </div>

            {/* Back to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-8 h-8 border border-white/10 hover:border-amber-500/50 flex items-center justify-center transition-colors duration-200 group"
              aria-label="Back to top"
            >
              <HiArrowUp className="text-neutral-500 group-hover:text-amber-400 text-xs transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

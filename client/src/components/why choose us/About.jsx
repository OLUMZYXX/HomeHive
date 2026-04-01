import { HiSparkles, HiShieldCheck, HiClock, HiHeart } from "react-icons/hi";

const features = [
  {
    icon: HiShieldCheck,
    title: "Verified Quality",
    description: "Every property is personally inspected and verified against our quality standards before listing.",
    number: "01",
  },
  {
    icon: HiClock,
    title: "24/7 Support",
    description: "Round-the-clock customer service to assist you at any stage of your stay.",
    number: "02",
  },
  {
    icon: HiSparkles,
    title: "Best Price Guarantee",
    description: "We guarantee the lowest prices — find it cheaper elsewhere and we'll match it.",
    number: "03",
  },
  {
    icon: HiHeart,
    title: "Curated Collection",
    description: "Handpicked accommodations designed to deliver unforgettable experiences.",
    number: "04",
  },
];

const About = () => (
  <section
    id="about"
    className="py-16 lg:py-24 bg-white [content-visibility:auto] [contain-intrinsic-size:1px_700px]"
  >
    <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-amber-500" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600">
              Why HomeHive
            </span>
          </div>
          <h2 className="font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1]">
            What Makes Us <span className="italic">Different</span>
          </h2>
        </div>
        <p className="text-neutral-500 text-sm leading-relaxed max-w-sm lg:text-right">
          Premium accommodations across Nigeria's finest cities — curated for
          comfort, quality, and a seamless guest experience.
        </p>
      </div>

      {/* Features — horizontal rule layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-neutral-100 border border-neutral-100">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group p-8 flex flex-col gap-6 hover:bg-neutral-50 transition-colors duration-300"
          >
            {/* Number */}
            <span className="font-Cormorant text-5xl font-light text-neutral-100 group-hover:text-amber-100 transition-colors duration-300 leading-none">
              {feature.number}
            </span>

            {/* Icon */}
            <div className="w-10 h-10 border border-neutral-200 group-hover:border-amber-400 flex items-center justify-center transition-colors duration-300">
              <feature.icon className="text-neutral-500 group-hover:text-amber-500 text-base transition-colors duration-300" />
            </div>

            {/* Text */}
            <div>
              <h3 className="font-NotoSans text-base font-semibold text-neutral-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default About;

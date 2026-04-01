import { HiPhone, HiChat, HiMail, HiClock, HiShieldCheck } from "react-icons/hi";

const contactMethods = [
  {
    icon: HiPhone,
    title: "Phone Support",
    description: "Speak directly with our team, any time of day or night.",
    action: "+234 800 123 4567",
    actionType: "tel",
  },
  {
    icon: HiChat,
    title: "Live Chat",
    description: "Get quick answers from our support team in real time.",
    action: "Start a Chat",
    actionType: "button",
  },
  {
    icon: HiMail,
    title: "Email Support",
    description: "Send us a message and we'll respond within a few hours.",
    action: "support@homehive.com",
    actionType: "email",
  },
];

const guarantees = [
  { icon: HiClock, title: "Fast Response", description: "Average response time under 2 hours" },
  { icon: HiShieldCheck, title: "Safe & Secure", description: "Bookings and payments always protected" },
];

const CustomerCare = () => (
  <section className="py-16 lg:py-24 bg-neutral-50 border-t border-neutral-100" id="support">
    <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-14 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-amber-500" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600">
              Support
            </span>
          </div>
          <h2 className="font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1]">
            World-Class <span className="italic">Support</span>
          </h2>
        </div>

        {/* Guarantees */}
        <div className="flex flex-col sm:flex-row gap-4">
          {guarantees.map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-neutral-100 px-5 py-3">
              <div className="w-8 h-8 bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <item.icon className="text-white text-sm" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
                <p className="text-xs text-neutral-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-neutral-200">
        {contactMethods.map((method, index) => (
          <div
            key={index}
            className={`group p-10 flex flex-col items-start hover:bg-neutral-900 transition-colors duration-300 ${
              index < contactMethods.length - 1 ? "border-b md:border-b-0 md:border-r border-neutral-200" : ""
            }`}
          >
            <div className="w-12 h-12 border border-neutral-200 group-hover:border-white/20 flex items-center justify-center mb-7 transition-colors duration-300">
              <method.icon className="text-neutral-600 group-hover:text-white text-lg transition-colors duration-300" />
            </div>

            <h3 className="font-Cormorant text-2xl font-light text-neutral-900 group-hover:text-white mb-3 transition-colors duration-300">
              {method.title}
            </h3>
            <p className="text-neutral-500 group-hover:text-white/60 text-sm leading-relaxed mb-8 flex-grow transition-colors duration-300">
              {method.description}
            </p>

            {method.actionType === "button" ? (
              <button className="text-sm font-medium text-neutral-800 group-hover:text-amber-400 border-b border-neutral-300 group-hover:border-amber-400 pb-0.5 transition-all duration-300">
                {method.action}
              </button>
            ) : method.actionType === "tel" ? (
              <a
                href={`tel:${method.action.replace(/\s/g, "")}`}
                className="text-sm font-medium text-neutral-800 group-hover:text-amber-400 border-b border-neutral-300 group-hover:border-amber-400 pb-0.5 transition-all duration-300"
              >
                {method.action}
              </a>
            ) : (
              <a
                href={`mailto:${method.action}`}
                className="text-sm font-medium text-neutral-800 group-hover:text-amber-400 border-b border-neutral-300 group-hover:border-amber-400 pb-0.5 transition-all duration-300"
              >
                {method.action}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CustomerCare;

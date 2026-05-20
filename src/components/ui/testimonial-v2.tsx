'use client';

import React from 'react';
import { motion } from "framer-motion";

// --- Types ---
interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

// --- Data ---
const testimonials: Testimonial[] = [
  {
    text: "Audiment helped us standardize brand compliance across our properties without flying area managers out every week. The GPS-verified photos give us real confidence in what we're seeing.",
    image: "",
    name: "Rahul S.",
    role: "Regional Director, Best Western Plus",
  },
  {
    text: "Maintaining a luxury experience means every detail counts. With Audiment, we transitioned from paper reports to verifiable daily digital checklists for our sprawling resort grounds.",
    image: "",
    name: "Rajeev S.",
    role: "General Manager, Ayatana Resorts",
  },
  {
    text: "Managing compliance across hundreds of fleet hubs was a nightmare. Now, safety and equipment checks are completed on time, and every corrective action is tracked to closure.",
    image: "",
    name: "Anil P.",
    role: "Fleet Operations Head, VRL Logistics",
  },
  {
    text: "We rolled out Audiment to all our franchise locations in under a month. It's given us verified visibility into food safety and cleanliness, ensuring a consistent customer experience across the network.",
    image: "",
    name: "Sneha K.",
    role: "VP of Operations, Tom & Chee",
  },
  {
    text: "Housekeeping and maintenance audits are no longer just a checkbox exercise. We can see real-time conditions of our rooms and facilities right from the dashboard.",
    image: "",
    name: "Pooja V.",
    role: "Operations Manager, Best Western Plus",
  },
  {
    text: "The offline capability is a lifesaver. Our auditors can inspect remote villas where Wi-Fi is spotty, and everything syncs up perfectly once they're back in range.",
    image: "",
    name: "Priya N.",
    role: "Quality Assurance Lead, Ayatana Resorts",
  },
  {
    text: "The 48-hour SLA for critical issues changed everything. If a warehouse fails a safety inspection, the facility manager has to fix it and upload photo proof.",
    image: "",
    name: "Vivek D.",
    role: "Supply Chain Director, VRL Logistics",
  },
  {
    text: "No more guesswork. The mandatory photo evidence ensures our teams are actually verifying temperatures and prep stations, not just signing off from memory.",
    image: "",
    name: "Aditya M.",
    role: "Food Safety Manager, Tom & Chee",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

// --- Sub-Components ---
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, name, role }, i) => (
                <motion.li
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileFocus={{
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-lg shadow-black/5 max-w-xs w-full bg-white dark:bg-neutral-900 transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <blockquote className="m-0 p-0">
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal m-0 transition-colors duration-300">
                      {text}
                    </p>
                    <footer className="flex items-center gap-3 mt-6">
                      <div className="flex flex-col">
                        <cite className="font-semibold not-italic tracking-tight leading-5 text-neutral-900 dark:text-white transition-colors duration-300">
                          {name}
                        </cite>
                        <span className="text-sm leading-5 tracking-tight text-neutral-500 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
                          {role}
                        </span>
                      </div>
                    </footer>
                  </blockquote>
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-transparent py-24 relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.8 }
        }}
        className="container px-4 z-10 mx-auto"
      >
        <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16">
          <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-semibold tracking-tight mt-6 text-center text-neutral-900 transition-colors">
            Operations leaders
            <span className="text-neutral-400"> trust Audiment</span>
          </h2>
          <p className="text-center mt-5 text-neutral-500 text-lg leading-relaxed transition-colors">
            Real feedback from QSR chains, retail groups, hotels, and franchise operators who run audits daily on the platform.
          </p>
        </div>

        <div
          className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden"
          role="region"
          aria-label="Scrolling Testimonials"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </motion.div>
    </section>
  );
};

export { TestimonialsSection };

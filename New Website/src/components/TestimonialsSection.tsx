import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    num: '01',
    quote: 'During festive sales, even a two-second cart lag tanks conversions. Asellus rebuilt our storefront components so bundle calculation and cart drawer open instantly under heavy traffic spikes.',
    author: '– Head of E-commerce & Tech, mCaffeine'
  },
  {
    num: '02',
    quote: 'Hub managers used to spend two hours every morning matching paper slips against dispatch. With Asellus, dispatches clear right away and regional turnarounds update live without calling back and forth.',
    author: '– Regional Operations Head, VRL Logistics'
  },
  {
    num: '03',
    quote: 'When founders ask Claude or ChatGPT for white-label Circle alternatives, Wylo gets cited by name. We get qualified trial signups every week who came directly from an AI recommendation.',
    author: '– Founder, Wylo'
  }
];

const fadeUpVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as any }
  }
};

const gridStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

export const TestimonialsSection: React.FC = () => {
  return (
    <>
      <section className="center-head">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUpVariants}
        >
          <h2>What our partners<br/>say about <i>us.</i></h2>
          <p>Direct feedback from founders and teams we have built technology for.</p>
        </motion.div>
      </section>
      
      <div className="testimonials-container">
        <motion.section 
          className="testimonials-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={gridStagger}
        >
          {testimonials.map((t) => (
            <motion.article 
              key={t.num}
              className="testimonial-card"
              variants={fadeUpVariants}
              whileHover={{ y: -4, borderColor: '#bbbbbb' }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
            >
              <span className="testimonial-num">{t.num}</span>
              <blockquote style={{ minHeight: 'auto' }}>{t.quote}</blockquote>
              <cite>{t.author}</cite>
            </motion.article>
          ))}
        </motion.section>
      </div>
    </>
  );
};

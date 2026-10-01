import React from 'react';
import { motion } from 'framer-motion';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as any }
  }
};

export const BuiltByUsSection: React.FC = () => {
  return (
    <section className="built-by-us">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeUpVariants}
      >
        <h2>We run our own<br/>software <i>too.</i></h2>
        <p>We build, maintain, and run Asellus ERP for our own operations every day. Managing our own product keeps our engineering sharp and our code grounded in daily business use.</p>
        <div className="product-cta">
          <a className="button" href="/erp">Explore ERP</a>
          <span className="more-products">Designed &amp; maintained by Asellus</span>
        </div>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as any }}
        whileHover={{ scale: 1.02 }}
      >
        <b>A</b>
        <p>One flexible platform to run your entire business–without the tool sprawl.</p>
      </motion.aside>
    </section>
  );
};

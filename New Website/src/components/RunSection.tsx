import React from 'react';
import { motion } from 'framer-motion';
import AnimatedTextCycle from '../../components/ui/animated-text-cycle';
const erpUrl = '/erp.svg';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as any }
  }
};

const listStaggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const RunSection: React.FC = () => {
  return (
    <section className="erp-spotlight" id="erp">
      <motion.div
        className="erp-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={fadeUpVariants}
      >
        <div className="tag">
          Business Management System
        </div>
        <h2>
          One system to run<br />
          your entire{' '}
          <AnimatedTextCycle
            words={['business.', 'factory.', 'manufacturing.', 'school.', 'operations.']}
            interval={3000}
            className="hero-animated-text"
          />
        </h2>
        <p>Most companies run their daily operations across separate spreadsheets, Tally files, personal WhatsApp groups, and isolated software.</p>
        <p>Asellus ERP brings your inventory, customer orders, and billing into one central database configured for your team.</p>

        <motion.ul variants={listStaggerVariants}>
          <motion.li variants={fadeUpVariants}>Live counts across warehouse inventory, orders, and dispatch</motion.li>
          <motion.li variants={fadeUpVariants}>Workflows configured for your floor and desk staff</motion.li>
          <motion.li variants={fadeUpVariants}>Instant GST billing and automated ledger entries</motion.li>
          <motion.li variants={fadeUpVariants}>Zero duplicate entry across disconnected tools</motion.li>
        </motion.ul>

        <a className="button button--orange" href="/erp">Explore ERP</a>
      </motion.div>

      <motion.div
        className="erp-right"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] as any }}
        whileHover={{ y: -4 }}
      >
        <img
          src={erpUrl}
          alt="Asellus ERP Overview"
          className="erp-window-img"
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: 'auto', borderRadius: '6px', border: '1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'box-shadow 0.3s' }}
        />
      </motion.div>
    </section>
  );
};

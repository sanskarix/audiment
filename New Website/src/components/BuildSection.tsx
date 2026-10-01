import React from 'react';
import { motion } from 'framer-motion';

import digitalProductsUrl from '../assets/digital-products.webp';
import customSoftwareUrl from '../assets/custom-software.webp';
import pmsUrl from '../assets/pms.webp';
import mobileUrl from '../assets/mobile.webp';
import ecomUrl from '../assets/ecom.webp';

const capabilities = [
  'Websites',
  'Web apps',
  'Mobile apps',
  'Internal tools',
  'PMSs',
  'Custom software'
];

const workCards = [
  {
    id: 'digital-products',
    category: 'Digital Products',
    title: 'Complex operational work, made clear and accessible.',
    imgUrl: digitalProductsUrl,
    isWide: true,
    artClass: 'work-art--portal'
  },
  {
    id: 'custom-software',
    category: 'Custom Software',
    title: 'Software built around how your team operates.',
    imgUrl: customSoftwareUrl,
    isWide: false,
    artClass: 'work-art--image'
  },
  {
    id: 'internal-tools',
    category: 'Internal Tools & PMSs',
    title: 'Replaces manual spreadsheets and workarounds.',
    imgUrl: pmsUrl,
    isWide: false,
    artClass: 'work-art--image'
  },
  {
    id: 'mobile-apps',
    category: 'Mobile Applications',
    title: 'Fast, responsive tools built for real day-to-day use.',
    imgUrl: mobileUrl,
    isWide: false,
    artClass: 'work-art--image'
  },
  {
    id: 'websites',
    category: 'Websites',
    title: 'High-performance websites designed for conversion',
    imgUrl: ecomUrl,
    isWide: false,
    artClass: 'work-art--image'
  }
];

// Animation configurations
const fadeUpVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as any }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardStaggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

export const BuildSection: React.FC = () => {
  return (
    <>
      <section className="intro development-intro" id="custom-development">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={fadeUpVariants}
        >
          <h2>Software built around<br />your real <i>workflows.</i></h2>
          <p>We map your team's operational bottlenecks first, then build the custom tools, web portals, or mobile apps that solve them completely.</p>
        </motion.div>

        <motion.div
          className="capabilities-bar"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={staggerContainer}
        >
          {capabilities.map((cap, i) => (
            <motion.span
              key={i}
              variants={fadeUpVariants}
              whileHover={{
                scale: 1.05,
                color: 'var(--orange)',
                borderColor: 'var(--orange)',
                backgroundColor: 'rgba(255, 85, 0, 0.03)'
              }}
              transition={{ type: "spring", stiffness: 450, damping: 18 }}
              style={{ display: 'inline-block', cursor: 'pointer', transition: 'background-color 0.2s' }}
            >
              {cap}
            </motion.span>
          ))}
        </motion.div>
      </section>

      <motion.section
        className="work-grid patterned"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={cardStaggerContainer}
      >
        {workCards.map((card) => (
          <motion.article
            key={card.id}
            className={`work-card ${card.isWide ? 'work-card--wide' : ''}`}
            variants={fadeUpVariants}
          >
            <div className={`work-art ${card.artClass}`}>
              <img src={card.imgUrl} alt={card.category} className="work-art-img" loading="lazy" decoding="async" />
            </div>
            <section>
              <span>{card.category}</span>
              <h3>{card.title}</h3>
            </section>
          </motion.article>
        ))}
      </motion.section>
    </>
  );
};

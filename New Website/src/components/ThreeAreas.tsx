import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconHover3D } from './ui/icon-3d-hover';

const cardsData = [
  {
    id: 'build',
    heading: 'BUILD',
    text: 'Websites, mobile apps, and internal portals built for your specific daily workflow.',
    link: '#custom-development',
    linkLabel: 'Explore Build',
  },
  {
    id: 'run',
    heading: 'RUN',
    text: 'One database for inventory, customer orders, and billing so your team stops re-keying data across disconnected tools.',
    link: '#erp',
    linkLabel: 'Explore Run',
  },
  {
    id: 'grow',
    heading: 'GROW',
    text: 'Search optimization, schema markup, and positioning that get your business cited first on Google and ChatGPT.',
    link: '#growth',
    linkLabel: 'Explore Grow',
  },
];

// Stagger child elements when they come into view
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Define individual card entry animation details
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] as any, // easeOutCubic
    },
  },
};

const AreaCard: React.FC<{ card: typeof cardsData[0] }> = ({ card }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      className="three-areas-card-wrapper"
      href={card.link}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={cardVariants}
    >
      <IconHover3D
        heading={card.heading}
        text={card.text}
        variant={isHovered ? 'Hover' : 'Default'}
        width="100%"
        height="100%"
      />
      <span className="service-link three-areas-link">
        {card.linkLabel}
      </span>
    </motion.a>
  );
};

export const ThreeAreasSection: React.FC = () => {
  return (
    <motion.div
      className="three-areas-grid"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
    >
      {cardsData.map((card) => (
        <AreaCard key={card.id} card={card} />
      ))}
    </motion.div>
  );
};

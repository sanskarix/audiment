import React from 'react';
import { motion } from 'framer-motion';

const processSteps = [
  {
    num: '01',
    title: 'Understand',
    desc: 'We analyze your daily operations, bottlenecks, or commercial goals before recommending software, ERP modules, or growth tactics.'
  },
  {
    num: '02',
    title: 'Design',
    desc: 'We design clean, intuitive interfaces and operational flows that your team and customers can use without confusion or manuals.'
  },
  {
    num: '03',
    title: 'Build & Deploy',
    desc: 'We engineer custom software, configure Asellus ERP, or launch growth engines with fast, performant systems.'
  },
  {
    num: '04',
    title: 'Refine',
    desc: 'We monitor real-world usage and performance metrics to continuously iterate and ensure long-term business impact.'
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
      staggerChildren: 0.1
    }
  }
};

export const ProcessSection: React.FC = () => {
  return (
    <>
      <section className="center-head" id="process">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUpVariants}
        >
          <h2>How we approach<br/>every <i>project.</i></h2>
          <p>A straightforward philosophy centered around real business needs.</p>
        </motion.div>
      </section>

      <motion.section 
        className="process-grid patterned"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={gridStagger}
      >
        {processSteps.map((step) => (
          <motion.article 
            key={step.num}
            variants={fadeUpVariants}
            whileHover={{ y: -4, borderColor: '#bbbbbb' }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <span>{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </motion.article>
        ))}
      </motion.section>
    </>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

const proofProjects = [
  {
    client: 'Custom operations platform',
    type: 'Custom Development',
    number: '42%',
    outcome: 'Faster internal hand-offs – tested across a 45-person distribution team, reducing order processing time from 48m to 28m per batch.',
    art: 'product'
  },
  {
    client: 'B2B E-commerce & Systems',
    type: 'Custom Dev & ERP',
    number: '3.5×',
    outcome: 'Revenue growth in 6 months – automated stock reservation enabled scaling wholesale orders from 120 to 420 orders/month without adding headcount.',
    art: 'commerce'
  },
  {
    client: 'Operations visibility portal',
    type: 'Asellus ERP',
    number: '30h',
    outcome: 'Saved weekly per manager – consolidated 14 regional branch spreadsheets into one real-time manager dashboard.',
    art: 'operations'
  },
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

export const ProofSection: React.FC = () => {
  return (
    <>
      <section className="center-head proof-head">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUpVariants}
        >
          <h2>Built for real<br/><i>businesses.</i></h2>
          <p>Real outcomes achieved across custom development, business systems, and growth strategy.</p>
        </motion.div>
      </section>

      <motion.section 
        className="proof-grid patterned" 
        data-temporary-proof="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={gridStagger}
      >
        {proofProjects.map((p, idx) => (
          <motion.article 
            key={idx} 
            className="proof-card"
            variants={fadeUpVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <div className={`proof-art proof-art--${p.art}`}>
              <span>{p.client}</span>
              <i></i><i></i><i></i>
            </div>
            <div className="proof-copy">
              <span className="proof-category">{p.type}</span>
              <h3>{p.client}</h3>
              <div className="proof-stats">
                <div className="proof-metric">{p.number}</div>
                <p className="proof-description">{p.outcome}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.section>
    </>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

const scenarios = [
  {
    num: '01',
    problem: '“We\'re running on too many tools and nothing talks to each other.”',
    solution: 'Operations scattered across spreadsheets, email, and apps unified into one system.',
    link: '/erp',
    linkLabel: 'Explore ERP'
  },
  {
    num: '02',
    problem: '“We need something custom built for our specific workflow.”',
    solution: 'Off-the-shelf software doesn\'t fit your process. Tailored software built for your team.',
    link: '#custom-development',
    linkLabel: 'Explore Development'
  },
  {
    num: '03',
    problem: '“We’re getting traffic but not enough actual business.”',
    solution: 'High impressions with low conversion. Strategic positioning, SEO, and conversion paths.',
    link: '#growth',
    linkLabel: 'Explore Growth'
  },
  {
    num: '04',
    problem: '“Our digital products feel slow, clunky, or hard to use.”',
    solution: 'Outdated software frustrates staff. Modern, performant digital tools built for speed.',
    link: '#custom-development',
    linkLabel: 'Explore Development'
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

const columnStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const ScenariosSection: React.FC = () => {
  return (
    <>
      <section className="center-head scenarios-head" id="scenarios">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUpVariants}
        >
          <h2>Situations businesses<br/>usually bring to <i>us.</i></h2>
          <p>Every business challenge starts differently. These are the situations we solve most often.</p>
        </motion.div>
      </section>

      <section className="scenarios-columns-wrap patterned">
        <motion.div 
          className="scenarios-columns"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={columnStagger}
        >
          {scenarios.map((sc) => (
            <motion.article 
              key={sc.num} 
              className="scenarios-col"
              variants={fadeUpVariants}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
            >
              <span className="scenarios-num">{sc.num}</span>
              <h3>{sc.problem}</h3>
              <div className="scenarios-divider"></div>
              <div className="scenarios-outcome">
                <p>{sc.solution}</p>
                <a href={sc.link} className="scenarios-pillar">{sc.linkLabel}</a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </>
  );
};

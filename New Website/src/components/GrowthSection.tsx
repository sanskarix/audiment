import React from 'react';
import { motion } from 'framer-motion';

const growthServices = [
  { title: 'SEO', desc: 'Show up where high-intent buyers are actively looking for your service.', href: '/growth#gr-seo' },
  { title: 'Branding', desc: 'A clear, credible visual and verbal identity for what you actually do.', href: '/growth#gr-branding' },
  { title: 'Go-to-Market', desc: 'Reach your target audience with structured launch campaigns and messaging.', href: '/growth#gr-gtm' },
  { title: 'Conversion Optimization', desc: 'Turn existing site traffic into qualified leads and direct business inquiries.', href: '/growth#gr-conversion' },
  { title: 'Social & Content', desc: 'An online presence built to support real commercial authority, not vanity likes.', href: '/growth#gr-social' },
  { title: 'Paid Ads', desc: 'Acquire customers profitably with highly targeted campaigns across search and social.', href: '/growth#gr-paid' }
];

const fadeUpVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as any }
  }
};

const cardsStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const GrowthSection: React.FC = () => {
  return (
    <section className="growth-section" id="growth">
      <motion.div 
        className="growth-intro"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeUpVariants}
      >
        <h2>Turn search traffic into<br/>qualified <i>inquiries.</i></h2>
        <p>We build search visibility, structured schema markup, paid acquisition campaigns, and clear positioning that turn online searches into direct quote requests and sales calls.</p>
        <a className="button" href="/growth">Grow your business</a>
      </motion.div>

      <motion.div 
        className="growth-services"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={cardsStagger}
      >
        {growthServices.map((service, i) => (
          <motion.a 
            key={i}
            href={service.href}
            className="growth-service-card"
            variants={fadeUpVariants}
          >
            <h3>
              {service.title}
            </h3>
            <p>{service.desc}</p>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
};

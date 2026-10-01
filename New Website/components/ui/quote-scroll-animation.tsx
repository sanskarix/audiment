import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function QuoteScrollAnimation() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = container.querySelectorAll(".reveal-word");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(words, {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
      });
    }, container);

    // Refresh ScrollTrigger after dynamic layout settles
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
      ctx.revert();
    };
  }, []);

  const line1 = [
    { text: "“We", italic: false },
    { text: "don't", italic: false },
    { text: "start", italic: false },
    { text: "with", italic: false },
    { text: "tech.", italic: false }
  ];

  const line2 = [
    { text: "We", italic: false },
    { text: "start", italic: false },
    { text: "with", italic: false },
    { text: "the", italic: false },
    { text: "problem.”", italic: true }
  ];

  return (
    <div ref={containerRef} className="quote" id="about">
      <div className="quote-sticky">
        <blockquote className="quote-blockquote">
          <div className="line-wrap">
            {line1.map((word, index) => (
              <span
                key={`l1-${index}`}
                className="reveal-word font-medium"
                style={{
                  opacity: 0.08,
                  color: "#181818",
                  marginRight: "0.26em",
                }}
              >
                {word.text}
              </span>
            ))}
          </div>
          <div className="line-wrap mt-1">
            {line2.map((word, index) => (
              <span
                key={`l2-${index}`}
                className={`reveal-word ${word.italic ? "italic font-normal" : "font-medium"}`}
                style={{
                  opacity: word.italic ? 0.12 : 0.08,
                  color: word.italic ? "#56706A" : "#181818",
                  marginRight: index < line2.length - 1 ? "0.26em" : "0",
                }}
              >
                {word.text}
              </span>
            ))}
          </div>
        </blockquote>
      </div>
    </div>
  );
}

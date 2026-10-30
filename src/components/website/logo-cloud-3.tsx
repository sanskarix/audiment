"use client";

import React from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

export type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
};

export type LogoCloudProps = React.ComponentProps<"div"> & {
  logos?: Logo[];
};

export const clientLogos: Logo[] = [
  {
    src: "/logos/aster.svg",
    alt: "Aster DM Healthcare",
    width: 84,
    height: 84,
    style: { height: "84px", width: "auto" },
  },
  {
    src: "/logos/ayatana.svg",
    alt: "Ayatana Resorts",
    width: 94,
    height: 94,
    style: { height: "94px", width: "auto" },
  },
  {
    src: "/logos/bw.svg",
    alt: "Best Western",
    width: 92,
    height: 92,
    style: { height: "92px", width: "auto" },
  },
  {
    src: "/logos/motherhood.svg",
    alt: "Motherhood Hospitals",
    width: 100,
    height: 100,
    style: { height: "100px", width: "auto" },
  },
  {
    src: "/logos/tom-and-chee.svg",
    alt: "Tom & Chee",
    width: 110,
    height: 110,
    style: { height: "110px", width: "auto" },
  },
  {
    src: "/logos/vrl.svg",
    alt: "VRL Logistics",
    width: 94,
    height: 94,
    style: { height: "94px", width: "auto" },
  },
];

export const techDemoLogos: Logo[] = [
  {
    src: "https://cdn.21st.dev/assets/mirror/bd/bdf5f3ae72bcfda892a686c03b7932985c694e9a9828643c980601bbc9e53cb4.svg",
    alt: "Nvidia Logo",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/31/319eeae853dd1af99d442b6c16b6c38dc52a66a719f8e502c65f85d26255cbd3.svg",
    alt: "Supabase Logo",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/2b/2bcdd4124223e3bf8e66bc08ce0ac32a6cc42ffe3584bbecfd377847176a188d.svg",
    alt: "OpenAI Logo",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/fc/fc7b090ebcfc468d24a1dc482b2db1fcbfd99ca14568552a30ce553d6dda7fcb.svg",
    alt: "Turso Logo",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/56/5624b7c243ac8d60e848fb5ea222ec932c1600df54a2762238b37498372fb0c8.svg",
    alt: "Vercel Logo",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/90/90f01a9537335666282ae5acc80bd4305f86d085a92d60904c3aa3ccc4414570.svg",
    alt: "GitHub Logo",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/e8/e8514b1206f79e1abdafcc1d2632393cc7cfbcbbe25426ac5143b17b184b56b8.svg",
    alt: "Claude AI Logo",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/96/96517bce3574d648280ff639d01d9889f354b488b3f826db5df746d730232a0c.svg",
    alt: "Clerk Logo",
  },
];

export function LogoCloud({ className, logos = clientLogos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-2",
        className
      )}
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <InfiniteSlider gap={64} reverse duration={30} durationOnHover={50}>
        {[...logos, ...logos].map((logo, idx) => (
          <div key={`logo-${logo.alt}-${idx}`} className="logo-cloud-item">
            <img
              alt={logo.alt}
              className={cn(
                "pointer-events-none select-none object-contain",
                logo.className
              )}
              height={logo.height ?? 32}
              style={{ ...logo.style, width: "auto" }}
              loading="lazy"
              src={logo.src}
              width={logo.width ?? (typeof logo.height === "number" ? logo.height : 100)}
            />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}

export default function DemoOne({ logos = clientLogos }: { logos?: Logo[] }) {
  return (
    <section className="logo-cloud-section">
      <div className="logo-cloud-inner">
        <h3 className="logo-cloud-heading">
          Trusted by growing businesses{" "}
          <span>and category leaders</span>
        </h3>

        <LogoCloud logos={logos} />
      </div>
    </section>
  );
}

"use client";

import React from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

export interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

export const clientLogos: Logo[] = [
  {
    id: "logo-artisaire",
    description: "Artisaire",
    image: "/logos/client%20logos/artisaire.svg",
    className: "h-6 md:h-7 w-auto invert object-contain",
  },
  {
    id: "logo-aster",
    description: "Aster",
    image: "/logos/client%20logos/aster.svg",
    className: "h-8 md:h-9 w-auto mix-blend-multiply object-contain",
  },
  {
    id: "logo-frido",
    description: "Frido",
    image: "/logos/client%20logos/frido.svg",
    className: "h-7 md:h-8 w-auto invert object-contain",
  },
  {
    id: "logo-goodfair",
    description: "Goodfair",
    image: "/logos/client%20logos/goodfair.svg",
    className: "h-6 md:h-7 w-auto object-contain",
  },
  {
    id: "logo-mcaffeine",
    description: "mCaffeine",
    image: "/logos/client%20logos/mcaffeine.svg",
    className: "h-7 md:h-8 w-auto object-contain",
  },
  {
    id: "logo-qure",
    description: "Qure",
    image: "/logos/client%20logos/qure.svg",
    className: "h-6 md:h-7 w-auto invert object-contain",
  },
  {
    id: "logo-smalls",
    description: "Smalls",
    image: "/logos/client%20logos/smalls.svg",
    className: "h-7 md:h-8 w-auto object-contain",
  },
  {
    id: "logo-tokyo-laundry",
    description: "Tokyo Laundry",
    image: "/logos/client%20logos/tokyo-laundry.svg",
    className: "h-6 md:h-7 w-auto invert object-contain",
  },
  {
    id: "logo-tom-chee",
    description: "Tom & Chee",
    image: "/logos/client%20logos/tom&chee.svg",
    className: "h-8 md:h-9 w-auto object-contain",
  },
  {
    id: "logo-vrl",
    description: "VRL",
    image: "/logos/client%20logos/vrl.svg",
    className: "h-8 md:h-9 w-auto object-contain",
  },
  {
    id: "logo-wylo",
    description: "Wylo",
    image: "/logos/client%20logos/wylo.svg",
    className: "h-6 md:h-7 w-auto invert object-contain",
  },
];

// Duplicate list for smooth, seamless loop on all viewports
export const defaultLogos: Logo[] = [
  ...clientLogos,
  ...clientLogos.map((logo) => ({
    ...logo,
    id: `${logo.id}-repeat`,
  })),
];

const Logos3 = ({
  heading = "Trusted by these companies",
  logos = defaultLogos,
  className,
}: Logos3Props) => {
  return (
    <section
      className={cn(
        "logos-marquee-section py-16 md:py-24 border-t border-[var(--line)]",
        className
      )}
    >
      <div className="container mx-auto flex flex-col items-center text-center px-4">
        <h2 className="my-4 text-xl sm:text-2xl font-semibold tracking-tight text-pretty lg:text-3xl text-[var(--ink)]">
          {heading}
        </h2>
      </div>
      <div className="pt-6 md:pt-10">
        <div className="logos-carousel-wrapper relative mx-auto flex items-center justify-center max-w-6xl overflow-hidden px-4">
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[
              AutoScroll({
                playOnInit: true,
                stopOnInteraction: false,
                speed: 1,
              }),
            ]}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            <CarouselContent className="ml-0 items-center">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="logos-carousel-slide flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="logo-item-box mx-6 sm:mx-8 md:mx-10 flex shrink-0 items-center justify-center h-16 select-none opacity-85 transition-opacity duration-200 hover:opacity-100">
                    <div>
                      <img
                        src={logo.image}
                        alt={logo.description}
                        className={logo.className}
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 z-10"
            style={{
              background:
                "linear-gradient(to right, var(--paper, #FAFAFA), transparent)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 z-10"
            style={{
              background:
                "linear-gradient(to left, var(--paper, #FAFAFA), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export { Logos3 };

// --- Demo ---
const demoData = {
  heading: "Trusted by these companies",
  logos: defaultLogos,
};

function Logos3Demo(props?: Partial<Logos3Props>) {
  return <Logos3 {...demoData} {...props} />;
}

export { Logos3Demo };

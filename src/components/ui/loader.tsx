"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoaderOneProps {
  className?: string;
  size?: number | string;
  color?: string;
}

export function LoaderOne({
  className,
  size = 40,
  color = "currentColor",
}: LoaderOneProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <style>
          {`
            @keyframes loader-one-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes loader-one-dash {
              0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
              50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
              100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
            }
            .loader-one-circle {
              animation: loader-one-dash 1.5s ease-in-out infinite;
              stroke-linecap: round;
            }
            .loader-one-svg {
              animation: loader-one-spin 2s linear infinite;
            }
          `}
        </style>
        <circle
          className="loader-one-svg loader-one-circle"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="3"
          transform-origin="center"
        />
      </svg>
    </div>
  );
}

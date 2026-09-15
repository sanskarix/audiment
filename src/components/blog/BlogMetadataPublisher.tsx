"use client";

import { useEffect } from "react";
import { setActiveBlogMetadata } from "@/lib/dataLayer";

interface BlogMetadataPublisherProps {
  category: string;
  slug: string;
}

/**
 * Client component that publishes structured blog metadata from Server Components
 * to the analytics layer without DOM scraping or bundling server filesystem logic.
 */
export function BlogMetadataPublisher({ category, slug }: BlogMetadataPublisherProps) {
  useEffect(() => {
    setActiveBlogMetadata({ category, slug });
    return () => {
      setActiveBlogMetadata(null);
    };
  }, [category, slug]);

  return null;
}

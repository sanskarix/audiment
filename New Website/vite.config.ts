import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mpaCleanUrlsPlugin = (): Plugin => ({
  name: "mpa-clean-urls-plugin",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url) {
        const [pathname, search] = req.url.split("?");
        const queryStr = search ? `?${search}` : "";

        if (pathname === "/platform/proof-based-audits" || pathname === "/platform/proof-based-audits/") {
          req.url = `/platform/proof-based-audits/index.html${queryStr}`;
        } else if (pathname === "/audiment/platform/proof-based-audits" || pathname === "/audiment/platform/proof-based-audits/") {
          req.url = `/audiment/platform/proof-based-audits/index.html${queryStr}`;
        } else if (pathname === "/solutions/restaurant-audit-software" || pathname === "/solutions/restaurant-audit-software/") {
          req.url = `/solutions/restaurant-audit-software/index.html${queryStr}`;
        } else if (pathname === "/audiment/solutions/restaurant-audit-software" || pathname === "/audiment/solutions/restaurant-audit-software/") {
          req.url = `/audiment/solutions/restaurant-audit-software/index.html${queryStr}`;
        } else if (pathname === "/audiment/use-cases" || pathname === "/audiment/use-cases/" || pathname === "/use-cases" || pathname === "/use-cases/") {
          req.url = `/audiment/use-cases/index.html${queryStr}`;
        } else if (pathname === "/audiment/multi-location-audit-software" || pathname === "/audiment/multi-location-audit-software/" || pathname === "/multi-location-audit-software" || pathname === "/multi-location-audit-software/") {
          req.url = `/audiment/multi-location-audit-software/index.html${queryStr}`;
        } else if (pathname === "/audiment/operational-drift" || pathname === "/audiment/operational-drift/" || pathname === "/operational-drift" || pathname === "/operational-drift/") {
          req.url = `/audiment/operational-drift/index.html${queryStr}`;
        } else if (pathname === "/audiment/compare/audiment-vs-safetyculture" || pathname === "/audiment/compare/audiment-vs-safetyculture/" || pathname === "/compare/audiment-vs-safetyculture" || pathname === "/compare/audiment-vs-safetyculture/") {
          req.url = `/audiment/compare/audiment-vs-safetyculture/index.html${queryStr}`;
        } else if (pathname === "/audiment/compare" || pathname === "/audiment/compare/" || pathname === "/compare" || pathname === "/compare/") {
          req.url = `/audiment/compare/index.html${queryStr}`;
        } else if (pathname === "/audiment/cookie-policy" || pathname === "/audiment/cookie-policy/" || pathname === "/cookie-policy" || pathname === "/cookie-policy/") {
          req.url = `/audiment/cookie-policy/index.html${queryStr}`;
        } else if (pathname === "/audiment/privacy-policy" || pathname === "/audiment/privacy-policy/" || pathname === "/privacy-policy" || pathname === "/privacy-policy/") {
          req.url = `/audiment/privacy-policy/index.html${queryStr}`;
        } else if (pathname === "/audiment/terms-of-service" || pathname === "/audiment/terms-of-service/" || pathname === "/terms-of-service" || pathname === "/terms-of-service/") {
          req.url = `/audiment/terms-of-service/index.html${queryStr}`;
        } else if (pathname === "/audiment/solutions" || pathname === "/audiment/solutions/") {
          req.url = `/audiment/solutions/index.html${queryStr}`;
        } else if (pathname === "/audiment/about" || pathname === "/audiment/about/") {
          req.url = `/audiment/about/index.html${queryStr}`;
        } else if (pathname === "/audiment/blog" || pathname === "/audiment/blog/") {
          req.url = `/audiment/blog/index.html${queryStr}`;
        } else if (pathname.startsWith("/audiment/blog/")) {
          req.url = `/audiment/blog/post/index.html${queryStr}`;
        } else if (pathname === "/audiment" || pathname === "/audiment/") {
          req.url = `/index.html${queryStr}`;
        }
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), mpaCleanUrlsPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"]
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        audiment: path.resolve(__dirname, "audiment.html"),
        audimentAbout: path.resolve(__dirname, "audiment/about/index.html"),
        audimentSolutions: path.resolve(__dirname, "audiment/solutions/index.html"),
        audimentUseCases: path.resolve(__dirname, "audiment/use-cases/index.html"),
        audimentBlog: path.resolve(__dirname, "audiment/blog/index.html"),
        audimentBlogPost: path.resolve(__dirname, "audiment/blog/post/index.html"),
        audimentCompare: path.resolve(__dirname, "audiment/compare/index.html"),
        audimentCompareSafetyCulture: path.resolve(__dirname, "audiment/compare/audiment-vs-safetyculture/index.html"),
        audimentMultiLocation: path.resolve(__dirname, "audiment/multi-location-audit-software/index.html"),
        audimentOperationalDrift: path.resolve(__dirname, "audiment/operational-drift/index.html"),
        audimentCookiePolicy: path.resolve(__dirname, "audiment/cookie-policy/index.html"),
        audimentPrivacyPolicy: path.resolve(__dirname, "audiment/privacy-policy/index.html"),
        audimentTermsOfService: path.resolve(__dirname, "audiment/terms-of-service/index.html"),
        restaurantAuditSoftware: path.resolve(__dirname, "solutions/restaurant-audit-software/index.html"),
        audimentRestaurantAuditSoftware: path.resolve(__dirname, "audiment/solutions/restaurant-audit-software/index.html"),
        proofBasedAudits: path.resolve(__dirname, "platform/proof-based-audits/index.html"),
        audimentProofBasedAudits: path.resolve(__dirname, "audiment/platform/proof-based-audits/index.html"),
      }
    }
  }
});

import SeedAnalyzer from "kuroshiro-analyzer-seed";

const analyzer: SeedAnalyzer = new SeedAnalyzer();
if (typeof analyzer.parse !== "function") throw new Error("Invalid CommonJS default import");

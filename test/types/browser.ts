const analyzer = new SeedAnalyzer();
const initialized: Promise<void> = analyzer.init();
const tokens: Promise<SeedAnalyzer.Token[]> = analyzer.parse("黒白");

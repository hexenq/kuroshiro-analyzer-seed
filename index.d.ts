export = SeedAnalyzer;
export as namespace SeedAnalyzer;

/** Starter template: the sample engine only recognizes 黒白 and whitespace. */
declare class SeedAnalyzer {
    static readonly default: typeof SeedAnalyzer;

    constructor();
    init(): Promise<void>;
    parse(str?: string): Promise<SeedAnalyzer.Token[]>;
}

declare namespace SeedAnalyzer {
    /** Adapt these fields to your engine; whitespace tokens have no reading. */
    interface Token {
        surface_form: string;
        pos?: string;
        pos_detail_1?: string;
        pos_detail_2?: string;
        pos_detail_3?: string;
        conjugated_type?: string;
        conjugated_form?: string;
        basic_form?: string;
        reading?: string;
        pronunciation?: string;
        verbose?: Record<string, unknown>;
    }
}

export declare const unchangedCLICommands: string[];
export declare const yarnCLICommands: string[];
export declare const npmCLICommands: string[];
export declare const executorCommands: {
    npm: string;
    yarn: string;
    pnpm: string;
    bun: string;
    deno: string;
    nub: string;
};
/**
 * Whether `npm install` args name packages (so it maps to `add`). Flags alone,
 * like `npm install --production`, stay `install`. Global installs keep their
 * existing `add` / global mapping.
 */
export declare function installsPackages(args: string[]): boolean;

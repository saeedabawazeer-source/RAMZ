// bwip-js ships types behind Node-specific conditional exports that
// TypeScript's resolver doesn't always pick up cleanly under Next.js's
// bundler moduleResolution. Minimal ambient declaration for the one function
// this app actually uses (toBuffer), rather than fighting the resolver.
declare module "bwip-js" {
  interface ToBufferOptions {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    includetext?: boolean;
    textxalign?: string;
  }
  function toBuffer(options: ToBufferOptions): Promise<Buffer>;
  const _default: { toBuffer: typeof toBuffer };
  export default _default;
}

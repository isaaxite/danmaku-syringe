const { build, context } = require("esbuild");
const { solidPlugin } = require("esbuild-plugin-solid");
const isProduction = process.env.NODE_ENV !== 'development';

const opt = {
  entryPoints: ['./index.jsx'],
  bundle: true,
  // target: ['chrome58', 'firefox57', 'edge16'],
  outfile: 'dist/index.js',
  plugins: [solidPlugin()],
  minify: isProduction,
  sourcemap: !isProduction,
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  conditions: [process.env.NODE_ENV],
};
// build(opt);

(async function main() {
  const ctx = await context(opt);
  const { hosts, port } = await ctx.serve({
    servedir: './'
  });
  console.info(`> http://localhost:${port}/`)
  await ctx.watch();
})();

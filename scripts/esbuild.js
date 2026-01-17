const { context } = require("esbuild");
const { solidPlugin } = require("esbuild-plugin-solid");
const { tailwindPlugin } = require("esbuild-plugin-tailwindcss");
const stylePlugin = require("esbuild-style-plugin");

const fs = require('fs');
const postcss = require('postcss');
const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

const isProduction = process.env.NODE_ENV !== 'development';

const cssInlinePlugin = {
  name: 'css-inline',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = await fs.promises.readFile(args.path, 'utf8');
      
      // 使用 PostCSS 处理 Tailwind CSS
      const result = await postcss([
        tailwindcss,
        autoprefixer,
      ]).process(css, { from: args.path });

      // 将 CSS 转换为 JS,在运行时注入到 head
      return {
        contents: `
          const style = document.createElement('style');
          style.textContent = ${JSON.stringify(result.css)};
          if (document.head) {
            document.head.appendChild(style);
          } else {
            document.addEventListener('DOMContentLoaded', () => {
              document.head.appendChild(style);
            });
          }
        `,
        loader: 'js',
      };
    });
  },
};


const opt = {
  entryPoints: ['./index.jsx'],
  bundle: true,
  // target: ['chrome58', 'firefox57', 'edge16'],
  outfile: 'dist/index.js',
  plugins: [
    solidPlugin(),
    cssInlinePlugin,
  ],
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
  },
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

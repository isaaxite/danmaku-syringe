const { context } = require("esbuild");
const { solidPlugin } = require("esbuild-plugin-solid");

const fs = require('fs');
const postcss = require('postcss');
const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

const { parseStringPromise } = require('xml2js');

function getPackageJsonObject() {
  const text = fs.readFileSync("./package.json", "utf-8");
  return JSON.parse(text);
}

function getTempermonkeyUserScriptHeader() {
  const pkgData = getPackageJsonObject();
  const lines = [
    '// ==UserScript==',
    `// @name ${pkgData.name}`,
    '// @namespace http://tampermonkey.net/',
    `// @version ${pkgData.version}`,
    `// @description ${pkgData.description}`,
    `// @author ${pkgData.author}`,
    '// @match https://ntdm8.com/play/*.html',
    '// @match https://danmu.yhdmjx.com/m3u8.php?*',
    '// @icon https://www.google.com/s2/favicons?sz=64&domain=github.io',
    '// @grant none',
    '// ==/UserScript=='
  ];

  return lines.join('\n');
}

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

const xml2jsonPlugin = {
  name: 'xml-to-json',
  setup(build) {
    build.onLoad({ filter: /\.xml$/ }, async (args) => {
      const xmlText = await fs.promises.readFile(args.path, 'utf8');
    

      const jsonData = parseStringPromise(xmlText);

      // 将 CSS 转换为 JS,在运行时注入到 head
      return {
        contents: jsonData,
        loader: 'js',
      };
    });
  },
};

const opt = {
  entryPoints: ['./index.jsx'],
  bundle: true,
  outfile: 'dist/index.js',
  plugins: [
    solidPlugin(),
    cssInlinePlugin,
    // xml2jsonPlugin,
  ],
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
    '.xml': 'text',
  },
  banner: {
    js: getTempermonkeyUserScriptHeader()
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

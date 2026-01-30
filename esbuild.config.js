const fs = require('fs');
const { context, build } = require("esbuild");
const { solidPlugin } = require("esbuild-plugin-solid");
const postcss = require('postcss');
const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

function getPackageJsonObject() {
  const text = fs.readFileSync("./package.json", "utf-8");
  return JSON.parse(text);
}

const DEF_MATCH_LIST = [
  'https://danmu.yhdmjx.com/m3u8.php?*',
  'https://player.cycanime.com/?*',
  'https://art.v2player.top:8989/player/?*'
];

function getTempermonkeyUserScriptHeader() {
  const pkgData = getPackageJsonObject();
  const lines = [
    '// ==UserScript==',
    `// @name ${pkgData.name}`,
    '// @namespace http://tampermonkey.net/',
    `// @version ${pkgData.version}`,
    `// @description ${pkgData.description}`,
    `// @author ${pkgData.author}`,
    ...DEF_MATCH_LIST.map(it => `// @match ${it}`),
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

const opt = {
  entryPoints: ['./index.jsx'],
  bundle: true,
  outfile: 'dist/index.js',
  plugins: [
    solidPlugin(),
    cssInlinePlugin,
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

(async function main() {
  if (isProduction) {
    return build(opt);
  }

  const ctx = await context(opt);
  const { hosts, port } = await ctx.serve({
    servedir: './'
  });
  console.info(`> http://localhost:${port}/`)
  await ctx.watch();
})();

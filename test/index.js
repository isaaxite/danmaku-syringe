const { parseStringPromise } = require("xml2js");
const fs = require("fs/promises");
const { xmlDanmakuToJson } = require("../src/utils");


(async () => {
  console.info(process.cwd())
  const text = await fs.readFile('test/asset/xrjpvimf_s1e11.dm.xml', { encoding: "utf-8" });

  const data = xmlDanmakuToJson(text);

  console.info(data);
})();

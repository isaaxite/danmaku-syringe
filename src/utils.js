import { createMemo } from "solid-js";

function decimalToHexColor(decimalColor) {
  // 确保是整数
  const hex = decimalColor.toString(16).toUpperCase();
  // 补零到6位
  return '#' + '0'.repeat(6 - hex.length) + hex;
}

/**
 * 将 XML 弹幕数据转换为 JSON 格式
 * @param {string} xmlString - XML 格式的弹幕数据字符串
 * @returns {Object} 包含元数据和弹幕列表的 JSON 对象
 */
export function xmlDanmakuToJson(xmlString) {
  // 创建一个临时的 DOM 解析器
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
  // 获取根元素
  const root = xmlDoc.documentElement;
  
  // 提取元数据
  const metadata = {};
  const metaNodes = root.children;
  
  // 遍历所有子节点，提取非弹幕的元数据
  for (let node of metaNodes) {
    if (node.nodeName !== 'd') {
      metadata[node.nodeName] = node.textContent;
    }
  }
  
  // 提取弹幕数据
  const danmakuList = [];
  const danmakuNodes = root.getElementsByTagName('d');
  
  for (let i = 0; i < danmakuNodes.length; i++) {
    const node = danmakuNodes[i];
    const content = node.textContent.trim();
    const attributes = node.getAttribute('p');
    
    if (!attributes) continue;
    
    // 解析 p 属性的值（逗号分隔的字符串）
    const attrParts = attributes.split(',');
    
    if (attrParts.length >= 9) {
      const danmaku = {
        // 弹幕属性
        time: parseFloat(attrParts[0]),      // 时间（秒）时间（秒）
        mode: parseInt(attrParts[1]),        // 模式：1普通，4底部，5顶部
        fontSize: parseInt(attrParts[2]),    // 字体大小
        color: decimalToHexColor(parseInt(attrParts[3])),       // 颜色（十进制）
        timestamp: parseInt(attrParts[4]),   // 发送时间戳
        pool: parseInt(attrParts[5]),        // 弹幕池
        senderHash: attrParts[6],            // 发送者哈希
        danmakuId: attrParts[7],             // 弹幕ID
        rowId: attrParts[8],                 // 行ID
        
        // 弹幕内容
        content: content,
        
        // 附加信息（原始字符串）
        rawAttributes: attributes,
        rawContent: node.textContent
      };
      
      // 添加可选的附加属性
      if (attrParts.length > 9) {
        danmaku.additional = attrParts.slice(9).join(',');
      }
      
      danmakuList.push(danmaku);
    }
  }
  
  return {
    metadata: metadata,
    danmaku: danmakuList,
    count: danmakuList.length,
    source: 'xml'
  };
}

export function isFunction(prop) {
  return Object.prototype.toString.call(prop) === '[object Function]';
}

/**
 * 生成指定长度的随机字符串
 * @param {number} length - 字符串长度
 * @param {string} charset - 可选，字符集
 * @returns {string} 随机字符串
 */
export function generateRandomString(length = 8, charset = '') {
  // 默认字符集：大小写字母 + 数字
  const defaultCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  // 使用传入的字符集或默认字符集
  const chars = charset || defaultCharset;
  let result = '';
  
  // 验证参数
  if (typeof length !== 'number' || length <= 0) {
    throw new Error('长度必须为正整数');
  }
  
  if (typeof chars !== 'string' || chars.length === 0) {
    throw new Error('字符集不能为空');
  }
  
  // 生成随机字符串
  const charsLength = chars.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    result += chars[randomIndex];
  }
  
  return result;
}

export class ZenCursor {
  constructor(props) {
    // 隐藏鼠标指针在指定元素区域內生效
    this.containerRef = props.containerRef;
    // this.
  }

  init() {

  }

  start() {

  }

  stop() {

  }

  destroy() {

  }
}

export function findHighestMatchingAncestor(video) {
  const videoRect = video.getBoundingClientRect();
  let highestMatch = null;
  
  let current = video.parentElement;

  while (current && current !== document.body) {
    const rect = current.getBoundingClientRect();
    
    // 判断条件
    const sizeMatch = 
      Math.abs(rect.width - videoRect.width) < 1 &&
      Math.abs(rect.height - videoRect.height) < 1;
    
    // const onlyChild = current.children.length === 1;
    
    // if (sizeMatch && onlyChild) {
    if (sizeMatch) {
      highestMatch = current; // 不断更新为更高层级的
    }
    
    current = current.parentElement;
  }
  
  return highestMatch; // 返回最高层级的匹配
}

export function createRefValue(defValue) {
  const getter = createMemo(() => [defValue]);

  return [
    () => getter()[0],
    (value) => {
      getter()[0] = value;
    },
  ];
}

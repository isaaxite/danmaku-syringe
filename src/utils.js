import Danmaku from "danmaku/dist/danmaku.dom.js";
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

export class DanmakuInjector {
  constructor(props) {
    this.rootRef = props.rootRef;
    this.videoRef = props.videoRef;

    this.fontSize = 20;
    this.opacity = 1;
    this.danmakuPoolLimit = 2;
    this.danmakuPool = [];
  }

  getStyle() {
    const lineHeight = Math.ceil(this.fontSize / 2 * 3);
    return [
      'pointer-events: none;',
      `font-size: ${this.fontSize}px;`,
      `line-height: ${lineHeight}px;`,
      `opacity: ${this.opacity};`,
    ].join('');
  }

  appendDanmakuWraperTo(parentRef) {
    const danmakuContainerID = `danmaku-wraper-${generateRandomString()}`;
    const danmakuWraperRef = document.createElement('DIV');
    danmakuWraperRef.setAttribute('id', danmakuContainerID);
    danmakuWraperRef.classList = 'absolute top-10 bottom-10 left-0 w-full z-1001';
    danmakuWraperRef.style = this.getStyle();
    parentRef.appendChild(danmakuWraperRef);
    return danmakuWraperRef;
  }

  updateStyle() {
    const style = this.getStyle();
    this.danmakuPool.forEach(it => {
      const containerRef = it[1];
      containerRef.style = style;
    });
  }

  setFontSize(fontSize) {
    this.fontSize = fontSize;
    this.updateStyle();
  }

  setOpacity(opacity) {
    this.opacity = opacity;
    this.updateStyle();
  }

  resize() {
    this.danmakuPool.forEach(([danmaku]) => danmaku.resize());
  }

  hide() {
    this.danmakuPool.forEach(([danmaku]) => danmaku.hide());
  }

  show() {
    this.danmakuPool.forEach(([danmaku]) => danmaku.show());
  }

  comments(comments) {
    if (this.danmakuPool.length < this.danmakuPoolLimit) {
      const containerRef = this.appendDanmakuWraperTo(this.rootRef);
      const danmaku = new Danmaku({
        container: containerRef,
        media: this.videoRef,
        comments,
      });
      this.danmakuPool.push([danmaku, containerRef]);
      return;
    }

    let oldDanmakuPoolItem = this.danmakuPool[0];
    this.danmakuPool[0] = this.danmakuPool[1];
    oldDanmakuPoolItem[0].destroy();
    oldDanmakuPoolItem[1].innerHTML = '';
    this.danmakuPool[1] = [
      new Danmaku({
        container: oldDanmakuPoolItem[1],
        media: this.videoRef,
        comments,
      }),
      oldDanmakuPoolItem[1],
    ];
    oldDanmakuPoolItem = null;
  }
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('文本已成功复制到剪贴板');
    return true;
  } catch (err) {
    console.error('复制失败:', err);
    return false;
  }
}

// 优酷弹幕 XML 解析器
export class YoukuDanmakuParser {
  constructor() {
    // 弹幕类型映射
    this.danmakuTypes = {
      1: 'scroll',    // 滚动弹幕
      2: 'top',       // 顶部固定
      3: 'bottom',    // 底部固定
      5: 'advanced'   // 高级弹幕
    };
    
    // 颜色映射（可选）
    this.colorMap = {
      16777215: 'white',
      16711680: 'red',
      65280: 'green',
      255: 'blue',
      16776960: 'yellow',
      16711935: 'magenta',
      65535: 'cyan',
      0: 'black'
    };
  }

  /**
   * 解析 XML 字符串
   * @param {string} xmlStr - XML 字符串
   * @returns {Object} 解析后的 JSON 对象
   */
  parseXML(xmlStr) {
    try {
      // 使用 DOMParser 解析 XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStr, 'text/xml');
      
      // 获取所有 d 元素
      const dElements = xmlDoc.getElementsByTagName('d');
      const danmakuList = [];
      
      // 解析每条弹幕
      for (let i = 0; i < dElements.length; i++) {
        const d = dElements[i];
        const p = d.getAttribute('p');
        const text = d.textContent.trim();
        
        if (p && text) {
          const danmaku = this.parseDanmaku(p, text, i);
          if (danmaku) {
            danmakuList.push(danmaku);
          }
        }
      }
      
      // 按时间排序
      danmakuList.sort((a, b) => a.time - b.time);
      
      return {
        success: true,
        count: danmakuList.length,
        danmakuList: danmakuList,
        metadata: {
          source: 'youku',
          version: '1.0',
          generateTime: new Date().toISOString()
        }
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        danmakuList: []
      };
    }
  }

  /**
   * 解析单条弹幕
   * @param {string} p - p 属性字符串
   * @param {string} text - 弹幕文本
   * @param {number} index - 索引
   * @returns {Object|null} 弹幕对象
   */
  parseDanmaku(p, text, index) {
    try {
      const params = p.split(',');
      
      // 验证参数长度
      if (params.length < 9) {
        console.warn(`弹幕 ${index}: 参数数量不足`, params);
        return null;
      }
      
      const time = parseFloat(params[0]);       // 时间（秒）
      const type = parseInt(params[1]);         // 类型
      const size = parseInt(params[2]);         // 字体大小
      const color = parseInt(params[3]);        // 颜色值
      const timestamp = parseInt(params[4]);    // 发送时间戳
      const unknown1 = parseInt(params[5]) || 0;
      const unknown2 = parseInt(params[6]) || 0;
      const userId = params[7];                 // 用户ID
      const danmakuId = params[8];              // 弹幕ID
      
      // 清理文本
      const cleanText = this.cleanText(text);
      
      // 构建弹幕对象
      const danmaku = {
        id: `${timestamp}_${index}_${danmakuId}`,  // 唯一ID
        index: index,
        time: time,                                // 出现时间（秒）
        type: type,                                // 类型代码
        typeName: this.danmakuTypes[type] || 'unknown',
        size: size,                                // 字体大小
        color: {
          decimal: color,                          // 十进制颜色值
          hex: this.decimalToHex(color),           // 十六进制颜色
          name: this.colorMap[color] || 'custom'   // 颜色名称
        },
        timestamp: timestamp,                      // 发送时间戳
        sendTime: new Date(timestamp * 1000).toISOString(),  // 发送时间
        userId: userId,                            // 用户ID
        danmakuId: danmakuId,                      // 弹幕ID
        text: cleanText,                           // 弹幕内容
        rawText: text,                             // 原始文本
        params: params,                            // 原始参数
        unknown1: unknown1,
        unknown2: unknown2
      };
      
      return danmaku;
      
    } catch (error) {
      console.error(`解析弹幕失败 (索引: ${index}):`, error);
      return null;
    }
  }

  /**
   * 清理文本
   * @param {string} text - 原始文本
   * @returns {string} 清理后的文本
   */
  cleanText(text) {
    if (!text) return '';
    
    // 移除控制字符
    let clean = text.replace(/[\x00-\x1F\x7F]/g, '');
    
    // 移除多余空白
    clean = clean.replace(/\s+/g, ' ').trim();
    
    return clean;
  }

  /**
   * 十进制颜色转十六进制
   * @param {number} decimal - 十进制颜色
   * @returns {string} 十六进制颜色
   */
  decimalToHex(decimal) {
    return '#' + decimal.toString(16).padStart(6, '0').toUpperCase();
  }
}

export function deduplicateDanmaku(arr, getKey) {
  // 使用 Map 来存储唯一的键值对
  const map = new Map();
  
  arr.forEach(item => {
    // 创建基于 time 和 text 的唯一键
    const key = getKey(item);
    
    // 如果这个键不存在，或者需要保留最新的记录（假设后面的更新）
    if (!map.has(key)) {
      map.set(key, item);
    } else {
      const mapItem = map.get(key);
      mapItem.count = mapItem.count ? mapItem.count + 1 : 1;
    }
  });
  
  // 返回 Map 中的所有值
  return Array.from(map.values());
}

export function plusRandomMS(originTimeSec, msRange) {
  let time = Number.parseInt(originTimeSec);
  const randomMS = Number.parseInt(Math.random() * msRange);
  time = (time * msRange + randomMS) / msRange;
  return time;
}

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
        time: parseFloat(attrParts[0]),      // 时间（秒）
        mode: parseInt(attrParts[1]),        // 模式：1普通，4底部，5顶部
        fontSize: parseInt(attrParts[2]),    // 字体大小
        color: parseInt(attrParts[3]),       // 颜色（十进制）
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

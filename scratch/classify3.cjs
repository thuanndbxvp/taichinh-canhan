const fs = require('fs');

const content = fs.readFileSync('constants.ts', 'utf-8');
const match = content.match(/(export const FINANCE_IDEAS: TopicSuggestionItem\[\] = )(\[\s*\{.*\}\s*\]);/s);

if (!match) {
  console.log("Could not find FINANCE_IDEAS array");
  process.exit(1);
}

const prefix = match[1];
const arrayStr = match[2];
const ideas = eval(arrayStr);

function classify(idea) {
  const t = idea.title.toLowerCase();
  const o = idea.outline.toLowerCase();
  const text = t + " " + o;

  // 1. Myth-busting
  if (/(vì sao|tại sao).*?(không|chưa|phá sản|đóng cửa)/i.test(t) || 
      /(sự thật về|cái bẫy|ảo tưởng|lừa đảo|bóc phốt|lùa gà|trắng tay|nguy hiểm nhất|đừng để|sai lầm|nghịch lý)/i.test(text) ||
      /(bán khóa học|hào quang|góc khuất)/i.test(text)) {
    return 'mythbusting';
  }

  // 2. Psychology
  if (/(tâm lý|áp lực đồng trang lứa|làm gì khi|cảm xúc|fomo|ảo giác|đồng cảm|chán nản|định luật|hiệu ứng|lối sống|minimalism|yolo|độc thân|vợ chồng|sức khỏe|bạn bè|nghỉ việc|hạnh phúc|kỳ vọng|bốc đồng|nỗi sợ|sợ hãi|chữa lành|vội vã)/i.test(text) ||
      /(tại sao bạn luôn)/i.test(t)) {
    return 'psychology';
  }

  // 3. Listicle
  if (/(?:^|\b)(\d+\s+(?:nghề|cách|nguyên tắc|thói quen|thứ|điều|khoản|việc|mô hình|sai lầm|tài sản|kỹ năng|bước)|top\s+\d+|các cách|những cách|bí quyết|danh sách|quy tắc \d+|quy tắc)/i.test(t) ||
      /(\d+ chiếc lọ|\d+ bước|\d+ giai đoạn)/i.test(t) || 
      /(hướng dẫn từ a đến z|cách làm|lộ trình)/i.test(text)) {
    return 'listicle';
  }

  // 4. Analytical
  if (/(tính toán|roi|so sánh|chi phí|lợi ích|bảng tính|kinh doanh|vốn|lãi suất|tài sản|phân bổ|dòng tiền|cắt lỗ|đu đỉnh|etf|cổ phiếu|trái phiếu|đầu tư|lạm phát|kinh tế|thị trường|ngân hàng|trả góp|mua đứt|thuê nhà|mua nhà|bất động sản|chứng khoán|quỹ)/i.test(text) ||
      /(vs|hay)/i.test(t)) {
    return 'analytical';
  }

  return 'uncategorized';
}

const uncategorized = [];
const stats = { listicle: 0, analytical: 0, psychology: 0, mythbusting: 0, uncategorized: 0 };

const updatedIdeas = ideas.map(idea => {
  const branch = classify(idea);
  stats[branch]++;
  if (branch === 'uncategorized') {
    uncategorized.push(idea);
  }
  return { ...idea, branch };
});

console.log("Stats:", stats);
console.log("\nUncategorized:", uncategorized.length);
uncategorized.forEach(u => console.log(`- ${u.title}`));

// Format the object back to string
function formatObj(obj) {
  let str = '  {\n';
  if (obj.category) str += `    category: ${JSON.stringify(obj.category)},\n`;
  str += `    title: ${JSON.stringify(obj.title)},\n`;
  if (obj.branch && obj.branch !== 'uncategorized') str += `    branch: ${JSON.stringify(obj.branch)},\n`;
  str += `    outline: ${JSON.stringify(obj.outline)}\n`;
  str += '  }';
  return str;
}

const newArrayStr = '[\n' + updatedIdeas.map(formatObj).join(',\n') + '\n]';
const newContent = content.replace(match[0], prefix + newArrayStr + ';');

fs.writeFileSync('constants.ts', newContent, 'utf-8');

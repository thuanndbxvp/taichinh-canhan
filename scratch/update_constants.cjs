const fs = require('fs');

const content = fs.readFileSync('constants.ts', 'utf-8');
const match = content.match(/(export const FINANCE_IDEAS: TopicSuggestionItem\[\] = )(\[\s*\{.*\}\s*\]);/s);

if (!match) {
  console.log("Could not find FINANCE_IDEAS array");
  process.exit(1);
}

const prefix = match[1];
const arrayStr = match[2];

let ideas;
try {
  // Using new Function to safely eval the object literal string
  ideas = new Function(`return ${arrayStr}`)();
} catch (e) {
  console.error("Error evaluating array:", e);
  process.exit(1);
}

function classifyIdea(idea) {
  const t = idea.title.toLowerCase();
  const o = idea.outline.toLowerCase();
  const text = t + " " + o;

  // Rule 1: Myth-busting
  if (/(vì sao không|sự thật về|cái bẫy|ảo tưởng|lừa đảo|bóc phốt|lùa gà)/.test(text)) {
    return 'mythbusting';
  }
  
  // Rule 2: Tâm lý
  if (/(tâm lý|áp lực đồng trang lứa|làm gì khi|cảm xúc|fomo|ảo giác|đồng cảm|chán nản|định luật|hiệu ứng)/.test(text)) {
    return 'psychology';
  }

  // Rule 3: Listicle
  // Match things like "10 Nghề", "5 Cách", "Top", "Những", "Bí quyết", "Nguyên tắc", "Thói quen"
  if (/(?:^|\b)(\d+\s+(?:nghề|cách|nguyên tắc|thói quen|thứ|điều|khoản|việc|mô hình|sai lầm|tài sản)|top\s+\d+|các cách|những cách|bí quyết|danh sách)\b/i.test(t)) {
    return 'listicle';
  }

  // Rule 4: Analytical
  if (/(tính toán|roi|so sánh|chi phí|lợi ích|bảng tính|kinh doanh|vốn|lãi suất|tài sản|phân bổ|dòng tiền|cắt lỗ|đu đỉnh)/.test(text)) {
    return 'analytical';
  }

  // Fallback pattern matching for listicle
  if (/\b(cách|bước|lý do)\b/.test(t) && /\d+/.test(t)) {
     return 'listicle';
  }

  return 'uncategorized';
}

const uncategorized = [];
const stats = {
  listicle: 0,
  analytical: 0,
  psychology: 0,
  mythbusting: 0,
  uncategorized: 0
};

const updatedIdeas = ideas.map(idea => {
  const branch = classifyIdea(idea);
  stats[branch]++;
  if (branch === 'uncategorized') {
    uncategorized.push(idea.title);
  }
  return { ...idea, branch: branch === 'uncategorized' ? 'analytical' : branch };
});

console.log("Stats:", stats);
console.log("Uncategorized count:", uncategorized.length);
if (uncategorized.length > 0) {
  console.log("Uncategorized titles:");
  uncategorized.forEach(t => console.log("- " + t));
}

// Format the object back to string
function formatObj(obj) {
  let str = '  {\n';
  if (obj.category) str += `    category: ${JSON.stringify(obj.category)},\n`;
  str += `    title: ${JSON.stringify(obj.title)},\n`;
  if (obj.branch) str += `    branch: ${JSON.stringify(obj.branch)},\n`;
  str += `    outline: ${JSON.stringify(obj.outline)}\n`;
  str += '  }';
  return str;
}

const newArrayStr = '[\n' + updatedIdeas.map(formatObj).join(',\n') + '\n]';
const newContent = content.replace(match[0], prefix + newArrayStr + ';');

fs.writeFileSync('constants.ts', newContent, 'utf-8');
console.log("constants.ts updated!");

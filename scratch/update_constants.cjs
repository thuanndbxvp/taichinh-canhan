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

let updated = 0;
const updatedIdeas = ideas.map(idea => {
  if (!idea.branch) {
    idea.branch = 'fundamental';
    updated++;
  }
  return idea;
});

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
console.log(`constants.ts updated! Set 'fundamental' to ${updated} items.`);

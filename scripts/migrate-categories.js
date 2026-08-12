const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = 'c:/Users/kspcl/Desktop/ksp-local-info/src/content/posts';

const categoryMap = {
  '복지·지원금': '💸 숨은 지원금 찾기',
  '문화·행사': '🎉 이번주 뭐하지?',
  '교육·육아': '👶 우리 아이 혜택',
  '건강·의료': '🩺 아플 때 든든하게',
  '일자리·창업': '💼 취업과 창업',
  '주거·부동산': '🏡 슬기로운 주거생활',
  '교통·환경': '🚌 출퇴근과 교통',
  '생활·민원': '💡 알아두면 쓸데있는 팁'
};

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(content);
  
  let changed = false;
  if (parsed.data.category) {
    if (typeof parsed.data.category === 'string') {
      const newCat = categoryMap[parsed.data.category];
      if (newCat) {
        parsed.data.category = newCat;
        changed = true;
      }
    } else if (Array.isArray(parsed.data.category)) {
      parsed.data.category = parsed.data.category.map(cat => categoryMap[cat] || cat);
      changed = true;
    }
  }

  if (changed) {
    const newContent = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
console.log('Migration complete!');

const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let filesUpdated = 0;

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. 모든 둥근 모서리를 완벽한 사각형(rounded-none)으로 변경
    // (단, 원형태를 유지해야 하는 rounded-full 은 제외)
    content = content.replace(/\brounded-(sm|md|lg|xl|2xl|3xl)\b/g, 'rounded-none');
    
    // 단순 rounded 클래스도 rounded-none으로 (rounded-full 등과 겹치지 않게 조심)
    content = content.replace(/(?<!-)\brounded\b/g, 'rounded-none');

    // 2. 박스(카드 등)의 그림자 효과를 가장 강하게(shadow-2xl) 변경
    // 벤토 박스나 카드류에서 많이 쓰이는 shadow-sm, shadow-md, shadow-lg 대체
    content = content.replace(/\bshadow-(sm|md|lg)\b/g, 'shadow-2xl');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
      filesUpdated++;
    }
  }
});

console.log(`\n완료! 총 ${filesUpdated}개의 파일이 완전히 각진 디자인과 강한 그림자로 업데이트 되었습니다.`);

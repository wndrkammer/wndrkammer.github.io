// 예약 발행 스크립트.
// draft: true 이고 publishAt 날짜가 오늘(KST) 이하인 글을 공개(draft: false)로 바꾼다.
// publishAt 이 없는 draft 는 "아직 작성 중"으로 보고 건드리지 않는다.
// GitHub Actions(publish.yml)가 매일 밤 11시(KST)에 이 스크립트를 실행한다.
const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "..", "src", "posts");

// 오늘 날짜(KST = UTC+9) 를 YYYY-MM-DD 로
const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
const today = kstNow.toISOString().slice(0, 10);

function getFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : "";
}

function getField(fm, key) {
  const m = fm.match(new RegExp("^" + key + ":\\s*(.+?)\\s*$", "m"));
  return m ? m[1].replace(/^["']|["']$/g, "") : null;
}

const published = [];

for (const file of fs.readdirSync(POSTS_DIR)) {
  if (!file.endsWith(".md")) continue;

  const full = path.join(POSTS_DIR, file);
  const text = fs.readFileSync(full, "utf8");
  const fm = getFrontmatter(text);

  if (getField(fm, "draft") !== "true") continue; // 초안 아님 → 통과
  const publishAt = getField(fm, "publishAt");
  if (!publishAt) continue;                        // 예약 안 함 → 건드리지 않음
  if (publishAt.slice(0, 10) > today) continue;    // 아직 예약일 전 → 통과

  // 첫 frontmatter 블록의 draft: true → false
  const newText = text.replace(/^(draft:[ \t]*)true([ \t\r]*)$/m, "$1false$2");
  if (newText !== text) {
    fs.writeFileSync(full, newText);
    published.push(file);
  }
}

if (published.length) {
  console.log("발행: " + published.join(", "));
} else {
  console.log("발행할 예약 글 없음");
}

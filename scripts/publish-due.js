// 예약 발행 스크립트 (매일 밤 11시 KST, publish.yml 이 실행).
//
// 규칙:
//   - draft 표시가 없는 일반 글  → date 가 오늘(KST) 이하가 되는 날 밤 11시에 자동 공개.
//   - draft: false 가 이미 박힌 글 → 이미 공개됨. 통과.
//   - draft: true 를 일부러 박은 글 → 작성 중으로 보고 절대 건드리지 않음(붙잡아 두기).
//
// 즉, 글을 쓰고 date 만 적어 올리면 그 날짜 밤 11시에 공개되고, 즉시 공개는 일어나지 않는다.
// (기본값은 src/posts/posts.json 에서 draft: true 로 숨김 처리되어 있음.)
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

  const draft = getField(fm, "draft");
  if (draft === "false") continue; // 이미 공개됨
  if (draft === "true") continue;  // 일부러 붙잡아 둠(작성 중)

  // draft 표시가 없는 일반 글 → date 가 오늘 이하면 공개
  const date = getField(fm, "date");
  if (!date) continue;                       // 날짜 없으면 보류
  if (date.slice(0, 10) > today) continue;   // 미래 날짜 → 그날까지 대기

  // frontmatter 맨 앞에 draft: false 를 박아 공개로 전환
  const newText = text.replace(/^---\r?\n/, (m) => m + "draft: false\n");
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

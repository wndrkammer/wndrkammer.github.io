# 표면아래

산업 분석 저널. 기사는 손으로 빚는 HTML이 아니라 **라벨 붙은 마크다운**이고, 정적 사이트 생성기(11ty)가 목록·섹터 페이지·관련 글·RSS·사이트맵을 자동으로 빌드한다.

## 폴더 구조

```
src/
  index.njk            첫 화면 (인트로·오늘의 분석·섹터·분석 목록·원칙)
  about.njk            소개
  sectors.njk          섹터별 페이지 자동 생성 (/sector/<slug>/)
  feed.njk             RSS(Atom) /feed.xml
  sitemap.njk          /sitemap.xml
  robots.njk           /robots.txt
  _data/
    site.js            사이트 메타데이터 (도메인·이메일·애드센스 ID)
    sectors.js         산업 축 목록 (여기 한 줄 추가 = 새 섹터)
  _includes/
    base.njk           공통 뼈대(헤더·푸터·head)
    article.njk        기사 레이아웃(+끝 광고·관련 글·구조화 데이터)
  css/style.css        디자인 (회색·바탕체·광고 예약)
  posts/
    posts.json         글 공통 설정(레이아웃·URL 규칙)
    YYYY-MM-DD-slug.md 분석 글 1편 = 파일 1개
```

## 매일 발행하는 법 (1편 = 1파일)

1. `src/posts/` 에 새 파일을 만든다: `2026-06-27-제목슬러그.md`
2. 맨 위 프런트매터 5줄을 채운다 (10초):

   ```
   ---
   title: "통념이 아니라 균열을 가리키는 제목"
   date: 2026-06-27
   sector: robot-ai          # semicon-tech / battery-energy / robot-ai / bio-health / platform-consumer
   slug: english-url-slug
   excerpt: "한 줄 요약."
   ---
   ```

3. 그 아래에 본문(마크다운)을 붙인다. 본문 중간 단락 경계에 `{% ad %}` 한 줄을 넣으면 그 자리에 광고가 들어간다. (글 끝 광고는 자동)
4. 저장하고 커밋·푸시한다. 끝. 목록·섹터·관련 글·사이트맵이 자동 갱신된다.

> 글을 숨기려면 프런트매터에 `draft: true` 를 넣는다.

## 로컬 미리보기

```
npm install        # 최초 1회
npm run dev        # http://localhost:8080 에서 실시간 미리보기
npm run build      # _site 로 정적 빌드
```

## 배포 (푸시하면 자동 빌드)

GitHub 저장소를 **Cloudflare Pages** 또는 **Netlify** 에 연결한다. 빌드 설정:

- 빌드 명령: `npm run build`
- 출력 폴더: `_site`

이후에는 마크다운을 커밋·푸시만 하면 사이트가 자동으로 다시 빌드·배포된다.

## 켜기 전 할 일 (TODO)

- [ ] `src/_data/site.js` 의 `url` 을 실제 도메인으로 교체 (canonical·사이트맵·RSS에 쓰임)
- [ ] 애드센스 승인 후 `site.js` 의 `adsenseClient` 에 `ca-pub-…` 입력, 각 `{% ad %}` 박스 주석에 광고 단위 코드 삽입
- [ ] 애드센스 **자동 광고(Auto Ads)는 끄기.** 전면 광고(비네트) 금지. 지정한 자리에만 수동 광고.

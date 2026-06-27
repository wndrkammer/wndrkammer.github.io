const sectors = require("./src/_data/sectors.js");

module.exports = function (eleventyConfig) {
  // 정적 자산
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });

  // 날짜 필터 (UTC 기준으로 고정해 하루 밀림 방지)
  const pad = (n) => String(n).padStart(2, "0");
  eleventyConfig.addFilter("ymd", (d) => {
    const x = new Date(d);
    return `${x.getUTCFullYear()}.${pad(x.getUTCMonth() + 1)}.${pad(x.getUTCDate())}`;
  });
  eleventyConfig.addFilter("iso", (d) => new Date(d).toISOString());

  // 섹터 슬러그 → 이름
  const sectorMap = Object.fromEntries(sectors.map((s) => [s.slug, s]));
  eleventyConfig.addFilter("sectorName", (slug) => (sectorMap[slug] || {}).name || slug);

  // 목록 보조 필터
  eleventyConfig.addFilter("bySector", (posts, slug) => (posts || []).filter((p) => p.data.sector === slug));
  eleventyConfig.addFilter("not", (posts, url) => (posts || []).filter((p) => p.url !== url));
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  // 분석 글 컬렉션 (날짜 내림차순, draft 제외)
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").filter((p) => !p.data.draft).reverse()
  );

  // 광고 슬롯 — 공간 예약, 본문 밀림 0. 본문 단락 경계에 {% ad %} 로 삽입.
  eleventyConfig.addShortcode("ad", (variant = "") => {
    const cls = variant === "inline" ? "ad ad--inline" : "ad";
    return `<aside class="${cls}" aria-label="광고">
<p class="ad-label">광고</p>
<div class="ad-box">
<!-- 애드센스 승인 후 광고 단위 코드를 여기에 붙이세요 (자동 광고는 켜지 말 것) -->
광고 자리 (승인 후 표시)
</div>
</aside>`;
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

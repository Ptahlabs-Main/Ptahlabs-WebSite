const fs = require('fs');
const path = require('path');

const PORTFOLIO_DIR = path.join(__dirname, '../public/portfolio');

// 현재 날짜를 YYYY-MM-DD 형식으로
const today = new Date().toISOString().split('T')[0];

// portfolio 폴더에서 프로젝트 데이터 읽기
const loadProjects = () => {
  const indexFile = path.join(PORTFOLIO_DIR, 'index.json');

  if (!fs.existsSync(indexFile)) {
    console.error('index.json이 없습니다. generate-index.js를 먼저 실행하세요.');
    process.exit(1);
  }

  const projectIds = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
  const projects = [];

  projectIds.forEach((id) => {
    const dataFile = path.join(PORTFOLIO_DIR, id, 'data.json');
    if (fs.existsSync(dataFile)) {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      // 숨김 프로젝트는 검색 엔진에 노출하지 않음
      if (data.hidden === true) return;
      projects.push(data);
    }
  });

  return projects;
};

// Sitemap XML 생성
const generateSitemap = () => {
  const baseUrl = 'https://ptahlabs.co.kr';
  const projects = loadProjects();

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/solution/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

  // 프로젝트 페이지들 추가
  projects.forEach(project => {
    sitemap += `  <url>
    <loc>${baseUrl}/project/${project.id}/</loc>
    <lastmod>${project.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  sitemap += `</urlset>`;

  // public/sitemap.xml에 저장
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');

  console.log(`Sitemap 생성 완료: ${projects.length}개 프로젝트 포함`);
};

generateSitemap();
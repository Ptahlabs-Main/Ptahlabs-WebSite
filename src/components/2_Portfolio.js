import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [projectsData, setProjectsData] = useState([]);
  const [tagsData, setTagsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 런타임에 프로젝트 데이터와 태그 정의 로드
  useEffect(() => {
    const loadProjects = async () => {
      try {
        // 1. 태그 정의 로드
        const tagsRes = await fetch('/portfolio/tags.json');
        const tags = await tagsRes.json();
        setTagsData(tags);

        // 2. 프로젝트 목록 가져오기
        const indexRes = await fetch('/portfolio/index.json');
        const projectIds = await indexRes.json();

        // 3. 각 프로젝트의 data.json 로드
        const projectPromises = projectIds.map(async (id) => {
          const res = await fetch(`/portfolio/${id}/data.json`);
          const data = await res.json();

          // 이미지 경로를 절대 경로로 변환
          return {
            ...data,
            images: data.images?.map(img => `/portfolio/${id}/${img}`) || [],
            thumbnail: data.thumbnail ? `/portfolio/${id}/${data.thumbnail}` : '',
            exhibits: data.exhibits?.map(exhibit => ({
              ...exhibit,
              images: exhibit.images?.map(img => `/portfolio/${id}/${img}`) || []
            })) || [],
            link: `/project/${id}`
          };
        });

        const projects = await Promise.all(projectPromises);

        // hidden: true인 프로젝트 제외
        const visibleProjects = projects.filter(project => !project.hidden);

        // 연도 내림차순 정렬
        visibleProjects.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          if (yearB !== yearA) return yearB - yearA;
          return b.id.localeCompare(a.id);
        });

        setProjectsData(visibleProjects);
      } catch (error) {
        console.error('프로젝트 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // JSON 데이터에서 모든 고유 태그 추출 (solution 제외)
  const allTags = [...new Set(projectsData.flatMap(project =>
    (project.tags || []).filter(tag => tag !== 'solution')
  ))];

  // 카테고리별로 태그 그룹화
  const getTagsByCategory = () => {
    if (!tagsData) return {};

    const grouped = {};
    allTags.forEach(tag => {
      const tagInfo = tagsData.tags[tag];
      if (tagInfo) {
        const category = tagInfo.category;
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(tag);
      }
    });
    return grouped;
  };

  const tagsByCategory = getTagsByCategory();

  // 태그를 한글명으로 변환
  const getTagLabel = (tag) => {
    if (tagsData && tagsData.tags[tag]) {
      return tagsData.tags[tag].name;
    }
    return tag;
  };

  // 카테고리명 가져오기
  const getCategoryName = (category) => {
    if (tagsData && tagsData.categories[category]) {
      return tagsData.categories[category].name;
    }
    return category;
  };

  const handleCategorySelect = (category) => {
    if (category === 'all') {
      setSelectedCategory(null);
      setActiveFilter('all');
    } else {
      setSelectedCategory(category);
      setActiveFilter('all'); // 카테고리 변경 시 필터 초기화
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleProjectClick = (link) => {
    router.push(link);
  };

  // 파일이 비디오인지 확인
  const isVideo = (filename) => {
    if (!filename) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const filteredItems = activeFilter === 'all'
    ? projectsData
    : projectsData.filter(project => project.tags?.includes(activeFilter));

  if (loading) {
    return (
      <section id="portfolio" className="portfolio">
        <div className="container">
          <h2 className="section-title">포트폴리오</h2>
          <p>로딩 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        {/* 타이틀(좌) + 카테고리 필터(우) */}
        <div className="portfolio-header">
          <h2 className="section-title">포트폴리오</h2>
          <div className="filter-categories">
            <button
              className={`category-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => handleCategorySelect('all')}
            >
              전체
            </button>
            {Object.keys(tagsByCategory).map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategorySelect(category)}
              >
                {getCategoryName(category)}
              </button>
            ))}
          </div>
        </div>

        {/* 선택된 카테고리의 세부 태그 */}
        {selectedCategory && tagsByCategory[selectedCategory] && (
          <div className="filter-tags">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              전체
            </button>
            {tagsByCategory[selectedCategory].map((tag) => (
              <button
                key={tag}
                className={`filter-btn ${activeFilter === tag ? 'active' : ''}`}
                onClick={() => handleFilterChange(tag)}
              >
                {getTagLabel(tag)}
              </button>
            ))}
          </div>
        )}

        <div className="portfolio-grid">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="portfolio-card"
              onClick={() => handleProjectClick(item.link)}
            >
              <div className="portfolio-card-image">
                {item.thumbnail ? (
                  isVideo(item.thumbnail) ? (
                    <video
                      src={item.thumbnail}
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <img src={item.thumbnail} alt={item.title} />
                  )
                ) : (
                  <div className="portfolio-card-placeholder">
                    <span dangerouslySetInnerHTML={{ __html: item.title.replace(' / ', '<br/>') }} />
                  </div>
                )}
              </div>
              <div className="portfolio-card-content">
                <p className="portfolio-card-label">
                  {[
                    ...item.tags.filter(tag => tag !== 'solution').slice(0, 2).map(getTagLabel),
                    item.year
                  ].filter(Boolean).join(' · ')}
                </p>
                <h3 className="portfolio-card-title" dangerouslySetInnerHTML={{ __html: item.title.replace(' / ', '<br/>') }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
import React from 'react';

/**
 * 프로젝트 섹션 렌더링 컴포넌트
 *
 * 5가지 섹션 타입 지원:
 * 1. text - 텍스트만
 * 2. image-gallery - 이미지 슬라이더
 * 3. text-image - 텍스트+이미지 조합
 * 4. text-image-sequence - 여러 개 반복
 * 5. exhibits - 전시물 카드
 */

const SectionRenderer = ({
  section,
  index,
  galleryIndexes,
  setGalleryIndexes,
  exhibitImageIndexes,
  setExhibitImageIndexes,
  getTagLabel,
  router
}) => {

  switch (section.type) {
    case 'text':
      return (
        <div key={index} className="section section-text">
          {section.title && <h3>{section.title}</h3>}
          <p>{section.content}</p>
        </div>
      );

    case 'image-gallery':
      const galleryIndex = galleryIndexes[index] || 0;
      return (
        <div key={index} className="section section-gallery">
          {section.title && <h3>{section.title}</h3>}
          <div className="gallery-wrapper">
            <div className="gallery-main-image">
              <img src={section.images[galleryIndex]} alt={`${section.title} - ${galleryIndex + 1}`} />
            </div>
            {section.images.length > 1 && (
              <div className="gallery-controls">
                <button
                  className="gallery-btn prev"
                  onClick={() => setGalleryIndexes(prev => ({
                    ...prev,
                    [index]: galleryIndex === 0 ? section.images.length - 1 : galleryIndex - 1
                  }))}
                >
                  ‹
                </button>
                <span className="gallery-counter">
                  {galleryIndex + 1} / {section.images.length}
                </span>
                <button
                  className="gallery-btn next"
                  onClick={() => setGalleryIndexes(prev => ({
                    ...prev,
                    [index]: galleryIndex === section.images.length - 1 ? 0 : galleryIndex + 1
                  }))}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      );

    case 'text-image':
      return (
        <div key={index} className={`section section-text-image layout-${section.layout || 'image-right'}`}>
          {section.title && <h3>{section.title}</h3>}
          <div className="text-image-content">
            <div className="text-part">
              <p>{section.text}</p>
            </div>
            <div className="image-part">
              <img src={section.image} alt={section.title || 'Section image'} />
            </div>
          </div>
        </div>
      );

    case 'text-image-sequence':
      return (
        <div key={index} className="section section-sequence">
          {section.title && <h3>{section.title}</h3>}
          {section.items.map((item, itemIndex) => (
            <div key={itemIndex} className={`sequence-item layout-${item.layout || 'image-right'}`}>
              <div className="text-part">
                <p>{item.text}</p>
              </div>
              <div className="image-part">
                <img src={item.image} alt={`${section.title} - ${itemIndex + 1}`} />
              </div>
            </div>
          ))}
        </div>
      );

    case 'exhibits':
      return (
        <div key={index} className="section section-exhibits">
          {section.title && <h3>{section.title}</h3>}
          <div className="exhibits-grid">
            {section.items.map((exhibit, exhibitIndex) => {
              const currentImageIndex = exhibitImageIndexes[`${index}-${exhibitIndex}`] || 0;
              return (
                <div key={exhibitIndex} className="exhibit-card">
                  {exhibit.images && exhibit.images.length > 0 && (
                    <div className="exhibit-image-wrapper">
                      <div className="exhibit-image-container">
                        <img
                          src={exhibit.images[currentImageIndex]}
                          alt={`${exhibit.title} - ${currentImageIndex + 1}`}
                        />
                      </div>
                      {exhibit.images.length > 1 && (
                        <div className="exhibit-image-controls">
                          <button
                            className="exhibit-image-btn prev"
                            onClick={() => setExhibitImageIndexes(prev => ({
                              ...prev,
                              [`${index}-${exhibitIndex}`]: currentImageIndex === 0 ? exhibit.images.length - 1 : currentImageIndex - 1
                            }))}
                          >
                            ‹
                          </button>
                          <span className="exhibit-image-counter">
                            {currentImageIndex + 1} / {exhibit.images.length}
                          </span>
                          <button
                            className="exhibit-image-btn next"
                            onClick={() => setExhibitImageIndexes(prev => ({
                              ...prev,
                              [`${index}-${exhibitIndex}`]: currentImageIndex === exhibit.images.length - 1 ? 0 : currentImageIndex + 1
                            }))}
                          >
                            ›
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="exhibit-content">
                    <h4>{exhibit.title}</h4>
                    <p>{exhibit.description}</p>
                    {exhibit.tags && (
                      <div className="exhibit-tags">
                        {exhibit.tags.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            className="exhibit-tag"
                            title={`'${getTagLabel(tag)}' 태그의 프로젝트 보기`}
                            onClick={router ? () => router.push(`/portfolio?tag=${encodeURIComponent(tag)}`) : undefined}
                          >
                            #{getTagLabel(tag)}
                          </button>
                        ))}
                      </div>
                    )}
                    {exhibit.relatedSolution && router && (
                      <button
                        className="btn exhibit-solution-btn"
                        onClick={() => router.push(`/project/${exhibit.relatedSolution.id}`)}
                      >
                        {exhibit.relatedSolution.title} 자세히 보기
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default SectionRenderer;

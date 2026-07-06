import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { KOREA_REGIONS, MAP_VIEWBOX } from './koreaMapData';

// 경위도 → 지도 좌표 변환 (koreaMapData.js와 동일한 투영)
const project = (lat, lng) => ({
  x: Math.round((lng - 125.7) * 100),
  y: Math.round((38.65 - lat) * 124),
});

// 도시명 → 기본 좌표 (도시 중심 경위도 기준)
// 프로젝트 data.json에 "latlng": [위도, 경도]가 있으면 그 값이 우선 적용됨
// labelLeft: 동해안 도시는 라벨을 점 왼쪽에 표시
const CITY_COORDS = {
  '서울': { x: 128, y: 134 },
  '인천': { x: 93, y: 148 },
  '용인': { x: 148, y: 175 },
  '원주': { x: 225, y: 162 },
  '제천': { x: 249, y: 188 },
  '대전': { x: 168, y: 285 },
  '전주': { x: 145, y: 351 },
  '대구': { x: 290, y: 345 },
  '경주': { x: 352, y: 346, labelLeft: true },
  '울산': { x: 361, y: 386, labelLeft: true },
  '부산': { x: 338, y: 430, labelLeft: true },
  '광주': { x: 115, y: 433 },
};

// 도시 → 시·도 매핑 (지역 폴리곤 호버 연동용)
const REGION_OF_CITY = {
  '서울': '서울', '인천': '인천', '용인': '경기', '원주': '강원',
  '제천': '충북', '대전': '대전', '전주': '전북', '대구': '대구',
  '경주': '경북', '울산': '울산', '부산': '부산', '광주': '광주',
};

const LocationMap = () => {
  const [cities, setCities] = useState([]);
  const [hovered, setHovered] = useState(null);
  const router = useRouter();

  // 런타임에 프로젝트 위치 데이터 로드
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const indexRes = await fetch('/portfolio/index.json');
        const projectIds = await indexRes.json();

        const projects = await Promise.all(
          projectIds.map(async (id) => {
            const res = await fetch(`/portfolio/${id}/data.json`);
            const data = await res.json();
            return {
              id,
              title: data.title,
              year: data.year,
              location: data.location,
              latlng: data.latlng, // 선택: [위도, 경도] 정확한 좌표
              hidden: data.hidden,
            };
          })
        );

        // 공개 프로젝트 중 location이 도시 좌표와 매칭되는 것만 그룹화
        const grouped = {};
        projects
          .filter((p) => !p.hidden && p.location)
          .forEach((p) => {
            const cityName = Object.keys(CITY_COORDS).find((c) =>
              p.location.includes(c)
            );
            if (!cityName) return;
            if (!grouped[cityName]) grouped[cityName] = [];
            grouped[cityName].push(p);
          });

        // 프로젝트별 점 좌표 계산 (latlng 있으면 정확 좌표, 없으면 도시 중심)
        // 라벨은 도시당 하나, 점들의 중심에 배치. 북 → 남 순 정렬.
        const list = Object.entries(grouped)
          .map(([name, projs]) => {
            const base = CITY_COORDS[name];
            const points = projs.map((p) => {
              const pos =
                Array.isArray(p.latlng) && p.latlng.length === 2
                  ? project(p.latlng[0], p.latlng[1])
                  : { x: base.x, y: base.y };
              return { id: p.id, ...pos };
            });
            const x = Math.round(points.reduce((s, p) => s + p.x, 0) / points.length);
            const y = Math.round(points.reduce((s, p) => s + p.y, 0) / points.length);
            return { name, labelLeft: base.labelLeft, x, y, points, projects: projs };
          })
          .sort((a, b) => a.y - b.y);

        setCities(list);
      } catch (error) {
        console.error('지역 데이터 로드 실패:', error);
      }
    };

    loadLocations();
  }, []);

  if (cities.length === 0) return null;

  const totalProjects = cities.reduce((sum, c) => sum + c.projects.length, 0);

  const handleMarkerClick = (city) => {
    if (city.projects.length === 1) {
      router.push(`/project/${city.projects[0].id}`);
    } else {
      setHovered(city.name);
    }
  };

  return (
    <section id="locations" className="location-map">
      <div className="container">
        <h2 className="section-title">설치 실적</h2>
        <p className="location-map-sub">
          전국 {cities.length}개 지역 · {totalProjects}개 프로젝트
        </p>

        <div className="location-layout">
          {/* 라인아트 한국 지도 (시·도 경계 포함) */}
          <svg
            className="location-map-svg"
            viewBox={MAP_VIEWBOX}
            role="img"
            aria-label="프로젝트 설치 지역 지도"
          >
            {KOREA_REGIONS.map((region) => {
              const hoveredRegion = hovered ? REGION_OF_CITY[hovered] : null;
              const cityInRegion = cities.find(
                (c) => REGION_OF_CITY[c.name] === region.name
              );
              return (
                <path
                  key={region.name}
                  className={`map-region ${hoveredRegion === region.name ? 'active' : ''} ${cityInRegion ? 'has-projects' : ''}`}
                  d={region.d}
                  onMouseEnter={cityInRegion ? () => setHovered(cityInRegion.name) : undefined}
                  onMouseLeave={cityInRegion ? () => setHovered(null) : undefined}
                />
              );
            })}

            {cities.map((city) => (
              <g
                key={city.name}
                className={`map-marker ${hovered === city.name ? 'active' : ''}`}
                onMouseEnter={() => setHovered(city.name)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleMarkerClick(city)}
              >
                {city.points.map((pt) => (
                  <g key={pt.id}>
                    <circle className="marker-halo" cx={pt.x} cy={pt.y} r="10" />
                    <circle className="marker-dot" cx={pt.x} cy={pt.y} r="4" />
                  </g>
                ))}
                <text
                  className="marker-label"
                  x={city.labelLeft ? city.x - 13 : city.x + 13}
                  y={city.y + 4}
                  textAnchor={city.labelLeft ? 'end' : 'start'}
                >
                  {city.name}
                </text>
              </g>
            ))}
          </svg>

          {/* 지역별 프로젝트 리스트 */}
          <ul className="location-list">
            {cities.map((city) => (
              <li
                key={city.name}
                className={
                  hovered === city.name ? 'active' : hovered ? 'dimmed' : ''
                }
                onMouseEnter={() => setHovered(city.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="location-city">
                  <span className="location-city-name">{city.name}</span>
                  <span className="location-city-count">
                    {city.projects.length}개 프로젝트
                  </span>
                </div>
                <ul className="location-projects">
                  {city.projects.map((p) => (
                    <li key={p.id} onClick={() => router.push(`/project/${p.id}`)}>
                      <span className="location-project-title">
                        {p.title.replace(' / ', ' ')}
                      </span>
                      <span className="location-project-year">{p.year}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;

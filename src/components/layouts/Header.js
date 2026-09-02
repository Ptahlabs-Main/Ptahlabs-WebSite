import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const router = useRouter();
  const location = { pathname: router.pathname };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      // const navLinks = document.querySelectorAll('.nav-link');

      let current = '';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });

      setActiveSection(current);

      const header = document.querySelector('header');

      // 메인(히어로 전용) 페이지는 아래의 전용 이펙트가 표시/숨김을 관리
      if (location.pathname !== '/') {
        header.style.padding = '5px 0';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
      }

      // Hero-Portfolio 블렌딩 효과
      const heroSection = document.querySelector('.hero');
      const portfolioSection = document.querySelector('.portfolio');

      if (heroSection && portfolioSection) {
        const blendStart = 150;
        const blendEnd = 350;

        if (scrollY < blendStart) {
          // 블렌딩 없음
          heroSection.style.setProperty('--blend-opacity', '0');
          portfolioSection.style.setProperty('--blend-opacity', '0');
        } else if (scrollY >= blendStart && scrollY <= blendEnd) {
          // 점진적 블렌딩
          const blendProgress = (scrollY - blendStart) / (blendEnd - blendStart);
          heroSection.style.setProperty('--blend-opacity', blendProgress.toString());
          portfolioSection.style.setProperty('--blend-opacity', blendProgress.toString());
        } else {
          // 완전 블렌딩
          heroSection.style.setProperty('--blend-opacity', '1');
          portfolioSection.style.setProperty('--blend-opacity', '1');
        }
      }
    };

    // 페이지 로드 시 초기 상태 설정
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // 메인 페이지: 헤더는 평소 숨김, 휠·터치·상단 마우스 이동 시에만 잠시 표시
  useEffect(() => {
    if (location.pathname !== '/') return;
    const header = document.querySelector('header');
    if (!header) return;

    let hideTimer = null;
    const hide = () => {
      header.style.opacity = '0';
      header.style.transform = 'translateY(-16px)';
      header.style.pointerEvents = 'none';
    };
    const show = () => {
      header.style.opacity = '1';
      header.style.transform = 'translateY(0)';
      header.style.pointerEvents = '';
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(hide, 3000);
    };
    const onMouseMove = (e) => {
      if (e.clientY < 90) show();
    };

    hide();
    window.addEventListener('wheel', show, { passive: true });
    window.addEventListener('touchstart', show, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      window.removeEventListener('wheel', show);
      window.removeEventListener('touchstart', show);
      window.removeEventListener('mousemove', onMouseMove);
      header.style.opacity = '';
      header.style.transform = '';
      header.style.pointerEvents = '';
    };
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      router.push('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeMenu();
  };

  const handlePageClick = (e, path) => {
    e.preventDefault();
    router.push(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
  };

  return (
    <header className={location.pathname === '/' ? 'header-overlay' : ''}>
      <div className="container header-container">
        <a href="/" className="logo" onClick={handleHomeClick}>
          <img src="/images/logo/2x/SignColor@2x.png" alt="PTAH LABS" className="logo-image" />
          PTAHLABS
        </a>

        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <a href="/" className="nav-link" onClick={handleHomeClick}>Home</a>
          </li>
          <li className="nav-item">
            <a href="/portfolio" className={`nav-link ${location.pathname === '/portfolio' ? 'active' : ''}`} onClick={(e) => handlePageClick(e, '/portfolio')}>Portfolio</a>
          </li>
          {/* 솔루션 메뉴 임시 숨김 (페이지 /solution 은 유지) */}
          {/* <li className="nav-item">
            <a href="/solution" className={`nav-link ${location.pathname === '/solution' ? 'active' : ''}`} onClick={(e) => handlePageClick(e, '/solution')}>Solution</a>
          </li> */}
          <li className="nav-item">
            <a href="/achievements" className={`nav-link ${location.pathname === '/achievements' ? 'active' : ''}`} onClick={(e) => handlePageClick(e, '/achievements')}>Achievements</a>
          </li>
          <li className="nav-item">
            <a href="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={(e) => handlePageClick(e, '/contact')}>Contact</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
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
      const scrollY = window.scrollY;
      const fadeStart = 100;
      const fadeEnd = 300;

      // 헤더 페이드 인/아웃 (메인 페이지에서만)
      if (location.pathname === '/') {
        if (scrollY < fadeStart) {
          // Hero 영역: 헤더 숨김
          header.style.padding = '';
          header.style.boxShadow = '';
          header.style.opacity = '0';
          header.style.transform = 'translateY(-20px)';
        } else if (scrollY >= fadeStart && scrollY <= fadeEnd) {
          // 전환 구간: 점진적으로 나타남
          const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
          header.style.padding = '5px 0';
          header.style.boxShadow = `0 2px 16px rgba(40, 57, 26, ${0.06 * progress})`;
          header.style.opacity = progress.toString();
          header.style.transform = `translateY(${-20 * (1 - progress)}px)`;
        } else {
          // 완전히 표시
          header.style.padding = '5px 0';
          header.style.boxShadow = '0 2px 16px rgba(40, 57, 26, 0.06)';
          header.style.opacity = '1';
          header.style.transform = 'translateY(0)';
        }
      } else {
        // 다른 페이지에서는 항상 헤더 표시
        header.style.padding = '5px 0';
        header.style.boxShadow = '0 2px 16px rgba(40, 57, 26, 0.06)';
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

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      // 다른 페이지에서 메인으로 이동 시
      window.scrollTo({ top: 0 });
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    closeMenu();
  };

  const handleSolutionClick = (e) => {
    e.preventDefault();
    router.push('/solution');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
  };

  return (
    <header>
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
            <a href="/" className={`nav-link ${location.pathname === '/' && activeSection === '' ? 'active' : ''}`} onClick={handleHomeClick}>Home</a>
          </li>
          <li className="nav-item">
            <a href="#portfolio" className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`} onClick={(e) => handleSectionClick(e, 'portfolio')}>Portfolio</a>
          </li>
          <li className="nav-item">
            <a href="/solution" className={`nav-link ${location.pathname === '/solution' ? 'active' : ''}`} onClick={handleSolutionClick}>Solution</a>
          </li>
          <li className="nav-item">
            <a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={(e) => handleSectionClick(e, 'contact')}>Contact</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
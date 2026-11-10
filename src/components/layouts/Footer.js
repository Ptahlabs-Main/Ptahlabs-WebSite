import Link from 'next/link';

// 하단 페이지 목록 (헤더 메뉴에 없는 페이지도 여기에는 모두 노출)
// 새 페이지를 추가하면 이 배열에만 넣으면 된다
const FOOTER_PAGES = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/contact', label: 'Contact' },
  { href: '/lab', label: 'Lab' },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <nav className="footer-nav" aria-label="페이지 목록">
            <ul className="footer-nav-list">
              {FOOTER_PAGES.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="footer-nav-link">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="social-icons">
            {/*
            <a href="#" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            */}

          </div>
          <p className="copyright">© 2025 PTAHLABS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

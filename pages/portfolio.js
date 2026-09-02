import Head from 'next/head'
import Header from '../src/components/layouts/Header'
import Portfolio from '../src/components/2_Portfolio'
import Footer from '../src/components/layouts/Footer'

export default function PortfolioPage() {
  return (
    <>
      <Head>
        <title>포트폴리오 - PTAHLABS</title>
        <meta name="description" content="프타랩스의 미디어아트·인터랙티브 디지털 전시 프로젝트 포트폴리오와 전국 설치 실적" />
        <link rel="canonical" href="https://ptahlabs.co.kr/portfolio/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ptahlabs.co.kr/portfolio/" />
        <meta property="og:title" content="포트폴리오 - PTAHLABS" />
        <meta property="og:description" content="프타랩스의 미디어아트·인터랙티브 디지털 전시 프로젝트 포트폴리오" />
        <meta property="og:image" content="https://ptahlabs.co.kr/images/logo/2x/SignColor@2x.png" />
      </Head>

      <div className="App">
        <Header />
        <Portfolio />
        <Footer />
      </div>
    </>
  )
}

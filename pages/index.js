import Head from 'next/head'
import Header from '../src/components/layouts/Header'
import Hero from '../src/components/1_Hero'
import Portfolio from '../src/components/2_Portfolio'
import LocationMap from '../src/components/4_LocationMap'
import Contact from '../src/components/5_Contact'
import Footer from '../src/components/layouts/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>프타랩스 PTAHLABS - 미디어아트 & 디지털 전시 솔루션</title>
        <meta name="description" content="프타랩스 PTAHLABS - 미디어아트 & 디지털 전시 솔루션 | 인터랙티브 전시 기업" />
        <meta name="keywords" content="미디어아트, 인터랙티브 전시, 디지털 전시, XR, AR, VR, 전시 솔루션, 미디어 아트, 데이터 시각화, PTAHLABS, 프타랩스" />
        <link rel="canonical" href="https://ptahlabs.co.kr/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ptahlabs.co.kr/" />
        <meta property="og:title" content="프타랩스 PTAHLABS - 미디어아트 & 디지털 전시 솔루션" />
        <meta property="og:description" content="기술과 예술의 융합, 인터랙티브 미디어 아트와 디지털 전시 시스템 전문 기업" />
        <meta property="og:image" content="https://ptahlabs.co.kr/images/logo/2x/SignColor@2x.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ptahlabs.co.kr/" />
        <meta property="twitter:title" content="프타랩스 PTAHLABS - 미디어아트 & 디지털 전시 솔루션" />
        <meta property="twitter:description" content="기술과 예술의 융합, 인터랙티브 미디어 아트와 디지털 전시 시스템 전문 기업" />
        <meta property="twitter:image" content="https://ptahlabs.co.kr/images/logo/2x/SignColor@2x.png" />
      </Head>

      <div className="App">
        <Header />
        <Hero />
        <Portfolio />
        <LocationMap />
        <Contact />
        <Footer />
      </div>
    </>
  )
}

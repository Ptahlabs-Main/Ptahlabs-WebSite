import Head from 'next/head'
import Header from '../src/components/layouts/Header'
import LocationMap from '../src/components/4_LocationMap'
import Footer from '../src/components/layouts/Footer'

export default function LocationsPage() {
  return (
    <>
      <Head>
        <title>설치 실적 - PTAHLABS</title>
        <meta name="description" content="프타랩스의 전국 미디어아트·디지털 전시 설치 실적 지도" />
        <link rel="canonical" href="https://ptahlabs.co.kr/locations/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ptahlabs.co.kr/locations/" />
        <meta property="og:title" content="설치 실적 - PTAHLABS" />
        <meta property="og:description" content="프타랩스의 전국 미디어아트·디지털 전시 설치 실적 지도" />
        <meta property="og:image" content="https://ptahlabs.co.kr/images/logo/2x/SignColor@2x.png" />
      </Head>

      <div className="App">
        <Header />
        <LocationMap />
        <Footer />
      </div>
    </>
  )
}

import Head from 'next/head'
import Header from '../src/components/layouts/Header'
import LocationMap from '../src/components/4_LocationMap'
// import Awards from '../src/components/7_Awards' // 수상 실적: 내용 채워지면 주석 해제
import Footer from '../src/components/layouts/Footer'

export default function AchievementsPage() {
  return (
    <>
      <Head>
        <title>실적 - PTAHLABS</title>
        <meta name="description" content="프타랩스의 전국 미디어아트·디지털 전시 설치 실적과 수상 실적" />
        <link rel="canonical" href="https://ptahlabs.co.kr/achievements/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ptahlabs.co.kr/achievements/" />
        <meta property="og:title" content="실적 - PTAHLABS" />
        <meta property="og:description" content="프타랩스의 전국 미디어아트·디지털 전시 설치 실적과 수상 실적" />
        <meta property="og:image" content="https://ptahlabs.co.kr/images/logo/2x/SignColor@2x.png" />
      </Head>

      <div className="App">
        <Header />
        <LocationMap />
        {/* <Awards /> 수상 실적: 내용 채워지면 주석 해제 */}
        <Footer />
      </div>
    </>
  )
}

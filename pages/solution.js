import Head from 'next/head'
import Header from '../src/components/layouts/Header'
import Solution from '../src/components/3_Solution'
import Footer from '../src/components/layouts/Footer'

export default function SolutionPage() {
  return (
    <>
      <Head>
        <title>솔루션 - PTAHLABS</title>
        <meta name="description" content="PTAHLABS의 미디어아트 및 전시 솔루션" />
        {/* 메뉴 숨김 기간 동안 검색 노출 제외 — 메뉴 복구 시 이 줄 제거하고 sitemap도 복원 */}
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://ptahlabs.co.kr/solution/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ptahlabs.co.kr/solution/" />
        <meta property="og:title" content="솔루션 - PTAHLABS" />
        <meta property="og:description" content="PTAHLABS의 미디어아트 및 전시 솔루션" />
      </Head>

      <div className="App">
        <Header />
        <Solution />
        <Footer />
      </div>
    </>
  )
}

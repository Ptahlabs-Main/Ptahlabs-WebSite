import Head from 'next/head'
import Header from '../src/components/layouts/Header'
import Lab from '../src/components/8_Lab'
import Footer from '../src/components/layouts/Footer'

export default function LabPage() {
  return (
    <>
      <Head>
        <title>Lab - PTAHLABS</title>
        <meta name="description" content="프타랩스가 실험 중인 인터랙티브 작업을 모아 둔 곳입니다" />
        <link rel="canonical" href="https://ptahlabs.co.kr/lab/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ptahlabs.co.kr/lab/" />
        <meta property="og:title" content="Lab - PTAHLABS" />
        <meta property="og:description" content="프타랩스가 실험 중인 인터랙티브 작업을 모아 둔 곳입니다" />
        <meta property="og:image" content="https://ptahlabs.co.kr/images/logo/2x/SignColor@2x.png" />
      </Head>

      <div className="App">
        <Header />
        <Lab />
        <Footer />
      </div>
    </>
  )
}

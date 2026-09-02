import Head from 'next/head'
import Header from '../src/components/layouts/Header'
import Contact from '../src/components/5_Contact'
import Footer from '../src/components/layouts/Footer'

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact - PTAHLABS</title>
        <meta name="description" content="프타랩스에 미디어아트·디지털 전시 프로젝트를 문의하세요" />
        <link rel="canonical" href="https://ptahlabs.co.kr/contact/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ptahlabs.co.kr/contact/" />
        <meta property="og:title" content="Contact - PTAHLABS" />
        <meta property="og:description" content="프타랩스에 미디어아트·디지털 전시 프로젝트를 문의하세요" />
        <meta property="og:image" content="https://ptahlabs.co.kr/images/logo/2x/SignColor@2x.png" />
      </Head>

      <div className="App">
        <Header />
        <Contact />
        <Footer />
      </div>
    </>
  )
}

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta name="theme-color" content="#28391A" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#15180F" media="(prefers-color-scheme: dark)" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/images/logo/2x/SignColor@2x.png" />
        <link rel="apple-touch-icon" href="/images/logo/2x/SignColor@2x.png" />
        <link rel="shortcut icon" type="image/png" href="/images/logo/2x/SignColor@2x.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossOrigin="anonymous" />

        {/* Site Verification */}
        <meta name="naver-site-verification" content="70914db47fa2ed902347a9261a5b0d5e7a3a4f75" />
        <meta name="google-site-verification" content="JtG31iTI3tkaaEkHjG_Zy1M8lX9brf7EEqU41nYkvpw" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "프타랩스 PTAHLABS",
              "url": "https://ptahlabs.co.kr/",
              "logo": "https://ptahlabs.co.kr/images/logo/2x/SignColor@2x.png",
              "description": "미디어아트 & 디지털 전시 솔루션 전문 기업",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "KR"
              }
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

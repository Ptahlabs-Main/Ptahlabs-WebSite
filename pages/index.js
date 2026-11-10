import Head from 'next/head'
import { useEffect } from 'react'
import Header from '../src/components/layouts/Header'
import Hero from '../src/components/1_Hero'
import LocationMap from '../src/components/4_LocationMap'
import Contact from '../src/components/5_Contact'
import Footer from '../src/components/layouts/Footer'

export default function Home() {
  // 홈 전용 lerp 스무스 스크롤: 휠 입력을 목표값에 쌓고 매 프레임 보간(lerp)으로 따라감
  // (OS 모션 줄이기 설정과 무관하게 항상 동작 — 브랜드 모션이므로 의도적으로 가드 없음)
  useEffect(() => {
    const LERP = 0.11
    const html = document.documentElement
    const prevSnap = document.body.style.scrollSnapType
    document.body.style.scrollSnapType = 'none' // 관성 스크롤과 충돌하는 스냅은 홈에서만 해제

    let target = window.scrollY
    let current = window.scrollY
    let raf = null
    let animating = false

    const maxScroll = () => html.scrollHeight - window.innerHeight

    const loop = () => {
      current += (target - current) * LERP
      if (Math.abs(target - current) < 0.5) {
        current = target
        window.scrollTo(0, current)
        animating = false
        raf = null
        return
      }
      window.scrollTo(0, current)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!animating) {
        current = window.scrollY
        if (!raf) raf = requestAnimationFrame(loop)
      } else if (!raf) {
        raf = requestAnimationFrame(loop)
      }
      animating = true
    }

    const onWheel = (e) => {
      if (e.defaultPrevented) return // 히어로 슬라이드 전환이 소비한 입력
      if (e.ctrlKey) return // 브라우저 줌 제스처
      e.preventDefault()
      if (!animating) target = window.scrollY
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY))
      start()
    }

    // 히어로 마지막 슬라이드 → 섹션 이동 요청도 같은 lerp로 처리
    const onLerpScrollTo = (e) => {
      e.preventDefault()
      target = Math.max(0, Math.min(maxScroll(), e.detail.y))
      start()
    }

    // 스크롤바 드래그·키보드 등 외부 스크롤은 목표값 동기화
    const onScrollSync = () => {
      if (!animating) {
        current = window.scrollY
        target = current
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('ptah:lerp-scroll', onLerpScrollTo)
    window.addEventListener('scroll', onScrollSync, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('ptah:lerp-scroll', onLerpScrollTo)
      window.removeEventListener('scroll', onScrollSync)
      document.body.style.scrollSnapType = prevSnap
    }
  }, [])

  // 스크롤 진입 시 섹션이 떠오르는 리빌 모션
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.home-reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

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
        <div className="home-reveal">
          <LocationMap />
        </div>
        <div className="home-reveal">
          <Contact />
        </div>
        <Footer />
      </div>
    </>
  )
}

import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../../src/components/layouts/Header'
import Footer from '../../src/components/layouts/Footer'
import ProjectDetail from '../../src/components/ProjectDetail'
import fs from 'fs'
import path from 'path'

export default function ProjectPage({ projectData }) {
  const router = useRouter()

  // fallback 페이지 처리
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const title = projectData?.title || 'Project'

  return (
    <>
      <Head>
        <title>{`${title} - PTAHLABS`}</title>
        <meta name="description" content={projectData?.description || `${title} 프로젝트 상세 정보`} />
        <meta property="og:title" content={`${title} - PTAHLABS`} />
        <meta property="og:description" content={projectData?.description || ''} />
        {projectData?.thumbnail && (
          <meta property="og:image" content={`https://ptahlabs.co.kr/portfolio/${projectData.id}/${projectData.thumbnail}`} />
        )}
        <link rel="canonical" href={`https://ptahlabs.co.kr/project/${projectData?.id}/`} />
      </Head>

      <div className="App">
        <Header />
        <ProjectDetail />
        <Footer />
      </div>
    </>
  )
}

// 빌드 시점에 모든 프로젝트 페이지 경로 생성
export async function getStaticPaths() {
  const indexPath = path.join(process.cwd(), 'public/portfolio/index.json')
  const projectIds = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))

  const paths = projectIds.map((id) => ({
    params: { projectId: id }
  }))

  return {
    paths,
    fallback: false // 정의되지 않은 경로는 404
  }
}

// 각 프로젝트의 데이터를 빌드 시점에 로드
export async function getStaticProps({ params }) {
  const { projectId } = params
  const dataPath = path.join(process.cwd(), `public/portfolio/${projectId}/data.json`)

  try {
    const projectData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    return {
      props: {
        projectData
      }
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}

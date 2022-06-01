import Link from '@mui/material/Link'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HtmlHead from '../components/common/HtmlHead'
import Header from '../components/common/Header'

export default function Home({ locale, intl }) {
  return (
    <>
      <HtmlHead title={ intl.home.title } />

      <div className="container">
        <Header title={ intl.home.welcome } />

        <main>
          <div className="list">
            <Link href={ `${ locale }/timer` } variant="h5">
              <img src="/static/icons/mvp-badge.png" width={48} height={36} />
              { intl.timer.title }
              <NavigateNextIcon />
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
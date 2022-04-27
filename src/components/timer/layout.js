import Header from '../common/header'
import Footer from '../common/footer'

export default function Layout({ title, children }) {
  return (
    <div className="container">
      <Header title={title}/>
      {children}
      <Footer />
    </div>
  )
}
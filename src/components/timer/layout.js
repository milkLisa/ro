import Header from '../common/Header'
import Footer from '../common/Footer'

export default function Layout({ title, children }) {
  return (
    <div className="container">
      <Header title={title}/>
      {children}
      <Footer />
    </div>
  )
}
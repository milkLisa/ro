import Navbar from './navbar'

export default function Layout({ children }) {
  return (
    <div className="container">
      <main>{children}</main>
      <Navbar />
    </div>
  )
}
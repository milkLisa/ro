export default function Header({ title, children }) {
  return (
    <header>
      <div className="title">{ title }</div>
      <div className="menu">{ children }</div>
    </header>
  )
}
export default function Header({ title, children }) {
  return (
    <header>
      <div className="title">{ title }</div>

      { children }
    </header>
  )
}
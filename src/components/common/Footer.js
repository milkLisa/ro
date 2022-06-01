export default function Footer({ copyright, children }) {
  return (
    <footer>
      {
        copyright &&
        <div className="copyright">
          <span>{ copyright }</span>
        </div>
      }

      { children }
    </footer>
  )
}
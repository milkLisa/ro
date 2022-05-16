export default function SortedList({ intl, open, number, onOpen, children }) {
  return (
    <div
      className  = { `swipeable-rawer${ open ? " show" : "" }` }
      anchor     = "bottom"
      onClick    = { () => onOpen(!open) }
    >
      <div 
        className = "puller" 
        onClick   = { () => onOpen(!open) }
      >
        <span className="open-btn">
          { `${ intl.timer.appearSort } (${ number })` }
        </span>
      </div>
      
      <div className="content">
        { children }
      </div>
    </div>
  )
}
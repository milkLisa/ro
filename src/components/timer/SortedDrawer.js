export default function SortedDrawer({ 
  intl, isOpen, number, onOpen, children 
}) {
  return (
    <div
      className  = { `swipeable-drawer${ isOpen ? " show" : "" }` }
      anchor     = "bottom"
      onClick    = { () => onOpen(!isOpen) }
    >
      <div 
        className = "puller" 
        onClick   = { () => onOpen(!isOpen) }
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
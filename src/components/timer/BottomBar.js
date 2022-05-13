import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import Footer from '../common/Footer'

export default function BottomBar({ intl, onClick }) {
  return (
    <Footer copyright={ intl.copyright }>
      <AppBar
        position  = "fixed" 
        sx        = { { top: "auto", bottom: 0 } }
      >
        <Toolbar className="bottom-bar">
          <Fab 
            className = "fab-btn big-btn"
            aria-label= "add timer"
            onClick   = { onClick }
          >
            <AddIcon />
          </Fab>

          <IconButton color="inherit">
            <a
              href  ="https://github.com/milkLisa/ro"
              target="_blank"
              rel   ="noopener noreferrer"
            >
              <img 
                src   = "/static/icons/GitHub-Mark-32px.png" 
                alt   = "RO Repository" 
                width = { 32 } 
                height= { 32 } 
              />
            </a>
          </IconButton>

          <div className="blank" />
        </Toolbar>
      </AppBar>
    </Footer>
  )
}
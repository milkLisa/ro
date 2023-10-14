import { useState } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import FilterListIcon from '@mui/icons-material/FilterList'
import CheckCard from '../timer/CheckCard'
import { toClassStr } from '../../utils/parser'

export default function CheckTabs({
  intl, className, items = {}, showFilter, onCheck
}) {
  const keys = Object.keys(items)
  const [selectedTab, setSelectedTab] = useState(keys[0])
  
  return (
    <div>
      <Tabs
        centered
        className = { toClassStr("check-tabs", className) }
        aria-label= { `${ keys.join(" ") } tabs` }
        value     = { selectedTab }
        onChange  = { (event, value) => setSelectedTab(value) } 
      >
        {
          keys.map(key => {
            const tabName = intl.timer[key] ? intl.timer[key] : key
            return(
              <Tab
                key   = { key }
                value = { key }
                icon  = { showFilter ? <FilterListIcon /> : null }
                label = { `${ tabName } (${ items[key].length })` }
              />
            )
          })
        }
      </Tabs>
      
      {
        keys.map(key =>
          <div 
            key       = { key }
            role      = "tabpanel"
            className = { toClassStr("list", selectedTab !== key && "hidden") }
          >
            {
              items[key].map(monster => 
                <CheckCard
                  intl      = { intl }
                  key       = { `${ key }-${ monster.id }` } 
                  monster   = { monster }
                  isChecked = { monster.isChecked }
                  onCheck   = { onCheck }
                />
              )
            }
          </div>
        )
      }
    </div>
  )
}
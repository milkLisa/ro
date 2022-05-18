import { useState } from 'react'
import Slider from '@mui/material/Slider'
import Input from '@mui/material/Input'
import { toNumber } from '../../utils/parser'

const marks = max => {
  return Array(max).fill(0).reduce((pre, curr, index) => {
    pre.push({ value: index + 1 })
    return pre
  }, [])
}

export default function DiscreteSlider({ 
  step = 1, min = 1, max = 10, value = 1, onChange
}) {
  const handleChange = e => {
    let x = toNumber(e.target.value, min) 

    if (x < min) {
      x = min
    } else if (x > max) {
      x = max
    }

    onChange(x)
  }

  return (
    <div className="discrete-slider">
      <Slider
        aria-label  = { `slider ${ min } to ${ max }` }
        value       = { toNumber(value, min) }
        defaultValue= { value }
        step        = { step }
        marks       = { marks(max) }
        min         = { min }
        max         = { max }
        onChange    = { handleChange }
        valueLabelDisplay = "auto"
      />
      
      <Input
        size      = "small"
        value     = { toNumber(value, min) }
        onChange  = { handleChange }
        inputProps= {{
          step: step,
          min : min,
          max : max,
          type: "number"
        }}
      />
    </div>
  )
}
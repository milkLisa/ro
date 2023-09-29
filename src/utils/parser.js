export function toClassStr(...args) {
  let classes = []
  args.forEach(name => {
    if (typeof name === "string") return classes.push(name.trim())
  }, [])
  return classes.join(" ")
}

export function toMB(bytes) {
  return `${Number.parseFloat(bytes / 1024 / 1024).toFixed(2)}MB`
}

export function toNumber(x, initail = 0) {
  return new RegExp(/^\d+$/).test(x) ? Number(x) : Number(initail)
}

export function isValid(x) {
  const arr = ["undefined", "null", "nan"]
  return !arr.find(y => `${x}`.trim().toLocaleLowerCase() == y)
}

export function isChanged(obj1, obj2) {
  return JSON.stringify(obj1) !== JSON.stringify(obj2)
}

export function trimStr(str) {
  return (str !== undefined && str !== null) ? `${str}`.trim() : ""
}

export function template(fmt, ...args) {
  if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
    throw new Error("invalid format string.")
  }

  return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
    if (str) {
      return str.replace(/(?:{{)|(?:}})/g, m => m[0])
    } else {
      if (index >= args.length) {
        throw new Error("argument index is out of range in format")
      }
      return args[index]
    }
  })
}

export function objReducer(prev, next) {
  return (next && typeof next === "object") ? { ...prev, ...next } : next
}

export function skipEvents(prevProps, nextProps) {
  const prev = Object.keys(prevProps).reduce((p, c) => {
    if (typeof prevProps[c] !== "function") p[c] = prevProps[c]
    return p
  }, {})

  const next = Object.keys(nextProps).reduce((p, c) => {
    if (typeof nextProps[c] !== "function") p[c] = nextProps[c]
    return p
  }, {})

  return JSON.stringify(prev) == JSON.stringify(next)
}
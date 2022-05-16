export function isValid(x) {
  const arr = ["undefined", "null", "nan"]
  return !arr.find(y => `${x}`.trim().toLocaleLowerCase() == y)
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
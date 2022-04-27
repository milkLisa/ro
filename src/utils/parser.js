export function trimStr(str) {
  return (str !== undefined && str !== null) ? `${str}`.trim() : ""
}
export const getWithExpiry = (key) => {
  const itemStr = window.localStorage.getItem(key)
  if (!itemStr) {
    return null
  }
  const item = JSON.parse(itemStr)
  const now = new Date()

  if (now.getTime() > item.expiry) {
    window.localStorage.removeItem(key)
    return null
  }
  return item.value
}

export const setWithExpiry = (key) => {
  const now = new Date()
  now.setHours(23,59,59)
  const item = {
    value: true,
    expiry: now.getTime()
  }
  window.localStorage.setItem(key, JSON.stringify(item))
}

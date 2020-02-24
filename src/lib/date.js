export default function() {
  const date = new Date()
  const time = date.toLocaleTimeString().slice(0, 5)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  return `${day} ${month} ${year} ${time}`
}

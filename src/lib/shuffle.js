export default function(arr) {
  let newPos, tempPos
  for (let i = arr.length - 1; i > 0; i--) {
    newPos = Math.floor(Math.random() * (i + 1))
    tempPos = arr[i]
    arr[i] = arr[newPos]
    arr[newPos] = tempPos
  }
  return arr
}

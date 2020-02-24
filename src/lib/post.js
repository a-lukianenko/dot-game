import setDate from './date'
import axios from 'axios'
export default function(url, name, array) {
  if (!name) {
    name = 'player'
  }
  return axios
    .post(url, {
      date: setDate(),
      winner: name
    })
    .then(res => {
      const data = res.data
      array.push(data[data.length - 1])
    })
    .catch(err => {
      console.log(err)
    })
}

const express = require('express')
const app = express()
const port = 3000

let groups = []

app.get('/', (req, res) => {
  res.send('Server untivitti.\nStatus: Ok')
})
app.get('/getCode', (req, res) => {
  const group = {
    code: 'ABCDE',
    players: [
      {
        name: 'fabiam93',
        isAdmin: true
      },
      {
        name: 'germano98',
        isAdmin: false
      }
    ]
  }
  groups.push(group)
  res.send(group.code)
})
app.get('/getState/:code', (req, res) => {
  const group = groups.find(x => x.code == req.params['code'])
  res.send(group)
})

app.listen(port, (err) => {
  if (err) console.log(err); 
  console.log(`Example app listening at http://localhost:${port}`)
})
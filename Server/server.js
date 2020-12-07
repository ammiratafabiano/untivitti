const express = require('express')
const crypto = require("crypto");

const app = express()
const port = 3000

let groups = []

app.get('/', (req, res) => {
  res.send('Server untivitti.\nStatus: Ok')
})
app.get('/createGroup/:nick/:type', (req, res) => {
  const group = {
    code: newCode(),
    type: req.params['type'],
    players: [
      {
        name: req.params['nick'],
        isAdmin: true
      }
    ]
  }
  groups.push(group)

  const response = {
    success: true,
    data: group.code
  }
  res.send(response)
})
app.get('/joinGroup/:nick/:code', (req, res) => {
  const nickname = req.params['nick']
  let group = groups.find(x => x.code == req.params['code'])
  if (group && !group.players.includes(nickname)) {
    const player = {
      name: nickname,
      isAdmin: false
    }
    group.players.push(player)

    const response = {
      success: true
    }
    res.send(response)
  } else {
    const response = {
      success: false
    }
    res.send(response)
  }
})
app.get('/getState/:code', (req, res) => {
  const group = groups.find(x => x.code == req.params['code'])
  res.send(group)
})

app.listen(port, (err) => {
  if (err) console.log(err); 
  console.log(`Example app listening at http://localhost:${port}`)
})

function newCode() {
  const id = crypto.randomBytes(3).toString("hex")
  return id
}
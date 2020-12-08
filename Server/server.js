const express = require('express')
const crypto = require("crypto");
const cors = require('cors');

const app = express()
const port = 3000

let groups = []

const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100'
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  }
}

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));

app.get('/', cors(corsOptions), (req, res) => {
  res.send('Server untivitti.\nStatus: Ok')
})

app.get('/createGroup/:nick/:type', cors(corsOptions), (req, res) => {
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

app.get('/joinGroup/:nick/:code', cors(corsOptions), (req, res) => {
  const nickname = req.params['nick']
  let group = groups.find(x => x.code == req.params['code'])
  let response
  if (group && !group.players.includes(nickname)) {
    const player = {
      name: nickname,
      isAdmin: false
    }
    group.players.push(player)

    response = {
      success: true
    }
  } else {
    response = {
      success: false
    }
  }
  res.send(response)
})

app.get('/getState/:code', cors(corsOptions), (req, res) => {
  const group = groups.find(x => x.code == req.params['code'])
  let response
  if (group) {
    response = {
      success: true,
      data: group
    }
  } else {
    response = {
      success: false
    }
  }
  res.send(response)
})

app.get('/getCardSets', cors(corsOptions), (req, res) => {
  const response = {
    success: false,
    data: [
      {
        id: 0,
        name: 'Siciliane',
        size: 40
      }
    ]
  }
  res.send(response)
})

app.listen(port, (err) => {
  if (err) console.log(err); 
  console.log(`Example app listening at http://localhost:${port}`)
})

function newCode() {
  const id = crypto.randomBytes(3).toString("hex")
  return id
}
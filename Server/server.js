const express = require('express')
const crypto = require("crypto");
const cors = require('cors');
const { groupCollapsed } = require('console');

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

// Check dead players and unusued groups
setInterval(function() {
  checkGroups();
}, 5000);

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));

app.get('/', cors(corsOptions), (req, res) => {
  res.send('Server untivitti.\nStatus: Ok')
})

app.get('/createGroup/:nick/:type', cors(corsOptions), (req, res) => {
  let code
  let group
  do {
    code = newCode()
    group = groups.find(x => x.code == code)
  } while (group)
  const newGroup = {
    code: code,
    type: req.params['type'],
    status: false,
    players: [
      {
        name: req.params['nick'],
        isAdmin: true,
        canMove: false,
        timestamp: getTime()
      }
    ]
  }
  groups.push(newGroup)

  const response = {
    success: true,
    data: newGroup
  }
  res.send(response)
})

app.get('/joinGroup/:nick/:code', cors(corsOptions), (req, res) => {
  const nickname = req.params['nick']
  let group = groups.find(x => x.code == req.params['code'])
  let response
  if (group) {
    if (!group.players.find(x => x.name == nickname)) {
      const player = {
        name: nickname,
        isAdmin: false,
        canMove: false,
        timestamp: getTime()
      }
      group.players.push(player)
    }

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

app.get('/exitGroup/:nick/:code', cors(corsOptions), (req, res) => {
  const nickname = req.params['nick']
  const code = req.params['code']
  let response
  if (deletePlayer(code, nickname)) {
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

app.get('/getState/:nick/:code', cors(corsOptions), (req, res) => {
  const nickname = req.params['nick']
  const code = req.params['code']
  const group = groups.find(x => x.code == code)
  let response
  if (group) {
    const player = group.players.find(x => x.name == nickname)
    if (player) {
      player.timestamp = getTime()
      response = {
        success: true,
        data: group
      }
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
    success: true,
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

function checkGroups() {
  groups.forEach(group => {
    group.players.forEach(player => {
      if (getTime() - player.timestamp > 30) {
        deletePlayer(group.code, player.name)
      }
    });
    if (group.players.length == 0) {
      deleteGroup(group.code)
    }
  });
}

function deletePlayer(code, nick) {
  let group = groups.find(x => x.code == code)
  if (group) {
    const playerToDelete = group.players.find(x => x.name == nick)
    const indexToDelete = group.players.indexOf(playerToDelete)
    if (indexToDelete > -1) {
      const wasAdmin = playerToDelete.isAdmin ? true : false;
      group.players.splice(indexToDelete,1)
      if (wasAdmin) {
        group.players[0].isAdmin = true;
      }
      return true
    } {
      return false
    }
  } else {
    return false
  }
}

function deleteGroup(code) {
  let group = groups.find(x => x.code == code)
  if (group) {
    const indexToDelete = groups.indexOf(group)
    if (indexToDelete > -1) {
      groups.splice(indexToDelete,1)
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

function getTime() {
  return Math.floor(Date.now() / 1000)
}
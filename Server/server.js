const express = require('express')
const bodyParser = require('body-parser')
const crypto = require("crypto");
const cors = require('cors');
const { groupCollapsed } = require('console');

const app = express()
const port = 3000

const jsonParser = bodyParser.json()

let groups = []
const cardSets = [
  {
    id: 0,
    name: 'Siciliane',
    size: 40
  }
]

const games = [
  {
    id: 0,
    name: 'Cucù',
    handCards: 1,
    minPlayers: 2,
    maxPlayers: 39,
    clockwise: false,
    swapOffset: 1,
    defaultBalance: 3,
    mustShow: true,
    adminMoves: [
      {
        name: 'Inizia',
        id: 0
      },
      {
        name: 'Termina',
        id: 1
      }
    ],
    playerMoves: [
      {
        name: 'Dichiara',
        id: 2
      },
      {
        name: 'Ti stai',
        id: 3
      },
      {
        name: 'Cambia',
        id: 4
      }
    ]
  }
]

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

app.post('/createGroup', jsonParser, cors(corsOptions), (req, res) => {
  let code
  let group
  do {
    code = newCode()
    group = groups.find(x => x.code == code)
  } while (group)
  const game = games.find(x => x.id == req.body.game)
  const newGroup = {
    code: code,
    cardSet: req.body.cardSet,
    game: req.body.game,
    status: false,
    money: req.body.money,
    players: [
      {
        name: req.body.nickname,
        isAdmin: true,
        canMove: false,
        moves: game.adminMoves,
        timestamp: getTime(),
        cards: [],
        visible: false,
        balance: game.defaultBalance
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
  if (group && group.status != true) {
    const game = games.find(x => x.id == group.game)
    if (group.players.length < game.maxPlayers) {
      if (!group.players.find(x => x.name == nickname)) {
        const player = {
          name: nickname,
          isAdmin: group.players.length > 0 ? false : true,
          canMove: false,
          moves: group.players.length > 0 ? [] : game.adminMoves,
          timestamp: getTime(),
          cards: []
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
    const game = games.find(x => x.id == group.game)
    if (group.players.length < game.minPlayers) {
      group.status = false
      group.cards = []
      group.players.forEach(player => {
        player.canMove = false
        player.cards = []
        player.moves = player.isAdmin ? game.adminMoves : []
      })
    }
    const player = group.players.find(x => x.name == nickname)
    if (player) {
      player.timestamp = getTime()
      response = {
        success: true,
        data: group
      }
    } else {
      response = {
        success: false
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
    data: cardSets
  }
  res.send(response)
})

app.get('/getGames', cors(corsOptions), (req, res) => {
  const response = {
    success: true,
    data: games
  }
  res.send(response)
})

app.post('/updatePlayers', jsonParser, cors(corsOptions), (req, res) => {
  let newPlayers = req.body.players;
  const code = req.body.code;
  const group = groups.find(x => x.code == code);
  let response
  if (group) {
    group.players = solveConflicts(group, newPlayers);
    response = {
      success: true
    }
  } else {
    response = {
      success: false
    }
  }
  res.send(response)
});

app.get('/sendMove/:nick/:code/:move', cors(corsOptions), (req, res) => {
  const nickname = req.params['nick']
  const code = req.params['code']
  const move = req.params['move']
  const group = groups.find(x => x.code == code)
  let response
  if (group) {
    const player = group.players.find(x => x.name == nickname)
    if (player) {
      if (executeMove(group, player, move)) {
        response = {
          success: true
        }
      } else {
        response = {
          success: false
        }
      }
    } else {
      response = {
        success: false
      }
    }
  } else {
    response = {
      success: false
    }
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
    const game = games.find(x => x.id == group.game)
    const playerToDelete = group.players.find(x => x.name == nick)
    const indexToDelete = group.players.indexOf(playerToDelete)
    if (indexToDelete > -1) {
      const wasAdmin = playerToDelete.isAdmin ? true : false;
      group.players.splice(indexToDelete,1)
      if (wasAdmin && group.players.length > 0) {
        group.players[0].isAdmin = true
        group.players[0].moves = game.adminMoves
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

function solveConflicts(group, newPlayers) {
  const game = games.find(x => x.id == group.game)
  group.players.forEach(player => {
    let found = false
    newPlayers.forEach(newPlayer => {
      if (player.name == newPlayer.name) found = true
    })
    if (!found) newPlayers.push(player)
  })
  let admin = newPlayers.find(x => x.isAdmin == true)
  admin.isAdmin = false
  admin.moves = []
  let newAdmin = newPlayers[0]
  newAdmin.isAdmin = true
  newAdmin.moves = game.adminMoves
  return newPlayers
}

function executeMove(group, player, move) {
  switch (move) {
    case "0":
      return startMove(group, player)
    case "1":
      return stopMove(group,player)
    case "2":
      return showMove(group, player)
    case "3":
      return skipMove(group, player)
    case "4":
      return swapMove(group, player)
    default:
      return false
  }
}

function startMove(group, player) {
  if (player.isAdmin) {
    group.status = true
    group.cards = getShuffledSet(group.cardSet)
    const game = games.find(x => x.id == group.game)
    for (let i = 0; i < group.players.length; i++) {
      group.players[i].cards = []
      for (let j = 0; j < game.handCards; j++) {
        group.players[i].cards.push(group.cards.pop())
      }
    }
    return turnChange(group, player)
  } else {
    return false
  }
}

function stopMove(group, player) {
  if (player.isAdmin) {
    group.status = false
    group.cards = []
    for (let i = 0; i < group.players.length; i++) {
      group.players[i].cards = []
      group.players[i].canMove = false
      player.visible = false
    }
    return true
  } else {
    return false
  }
}

function showMove(group, player) {
  player.visible = true
  if (!player.isAdmin) {
    return turnChange(group, player)
  } else {
    return turnStop(group, player)
  }
}

function skipMove(group, player) {
  if (!player.isAdmin) {
    return turnChange(group, player)
  } else {
    return turnStop(group, player)
  }
}

function swapMove(group, player) {
  const game = games.find(x => x.id == group.game)
  const index = group.players.findIndex(x => x.name == player.name)
  const newIndex = (index + game.swapOffset) % group.players.length
  if (!player.isAdmin) {
    const tempCards = [...group.players[index].cards]
    group.players[index].cards = group.players[newIndex].cards
    group.players[newIndex].cards = tempCards;
    return turnChange(group, player)
  } else {
    group.players[index].cards = []
    for (let j = 0; j < game.handCards; j++) {
      group.players[index].cards.push(group.cards.pop())
    }
    return turnStop(group, player)
  }
}

function turnChange(group, player) {
  const index = group.players.findIndex(x => x.name == player.name)
  const newIndex = (index + 1) % group.players.length
  const game = games.find(x => x.id == group.game)
  group.players[index].canMove = false;
  group.players[index].moves = group.players[index].isAdmin ? game.adminMoves : []
  group.players[newIndex].canMove = true;
  group.players[newIndex].moves = group.players[newIndex].moves.concat(game.playerMoves)
  return true
}

function turnStop(group, player) {
  const index = group.players.findIndex(x => x.name == player.name)
  const game = games.find(x => x.id == group.game)
  group.players[index].canMove = false;
  group.players[index].moves = group.players[index].isAdmin ? game.adminMoves : []
  if (game.mustShow) {
      group.players.forEach(x => x.visible = true)
  }
  return true
}

function getShuffledSet(cardSet) {
  const size = cardSets.find(x => x.id == cardSet).size
  for (var array=[],i=0; i < size; ++i) array[i]=i
  var tmp, current, top = array.length
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1))
    tmp = array[current]
    array[current] = array[top]
    array[top] = tmp
  }
  return array
}
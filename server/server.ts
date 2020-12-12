const express = require('express');
const bodyParser = require('body-parser')
const crypt = require("crypt")
const cors = require('cors')
const { groupCollapsed } = require('console')
const ws = require('ws');

const app = express();
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
        name: 'Mostra',
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
    round: 0,
    players: [
      {
        name: req.body.nickname,
        isAdmin: true,
        canMove: false,
        moves: game.adminMoves,
        timestamp: getTime(),
        cards: [],
        visible: false,
        balance: game.defaultBalance,
        ghost: false
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
          cards: [],
          visible: false,
          balance: game.defaultBalance,
          ghost: false
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

app.get('/updateBalance/:nick/:code/:balance', cors(corsOptions), (req, res) => {
  const nickname = req.params['nick']
  const code = req.params['code']
  const newBalance = req.params['balance']
  const group = groups.find(x => x.code == code)
  let response
  if (group) {
    const player = group.players.find(x => x.name == nickname)
    player.balance = newBalance
    response = {
      success: true
    }
    if (newBalance == 0) {
      player.ghost = true
    }
  } else {
    response = {
      success: false
    }
  }
  res.send(response)
})

app.get('/setGhost/:nick/:code/:value', cors(corsOptions), (req, res) => {
  const nickname = req.params['nick']
  const code = req.params['code']
  const value = req.params['value']
  const group = groups.find(x => x.code == code)
  let response
  if (group) {
    const player = group.players.find(x => x.name == nickname)
    player.ghost = value == "true" ? true : false
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

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', (socket: any) => {
  socket.on('message', (message: any) => console.log(message));
});

const server = app.listen(port, (err: any) => {
  if (err) console.log(err); 
  console.log(`Example app listening at http://localhost:${port}`)
})

server.on('upgrade', (request: any, socket: any, head: any) => {
  wsServer.handleUpgrade(request, socket, head, (socket: any) => {
    wsServer.emit('connection', socket, request);
  });
});
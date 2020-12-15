const express = require('express');
const bodyParser = require('body-parser')
const crypt = require("crypto")
const cors = require('cors')
const { groupCollapsed } = require('console')
const ws = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000

const jsonParser = bodyParser.json()

let subscribers = []

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
        name: 'Cucù!',
        id: 2,
        disabled: false,
        forbiddenCards: [0,1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,30,31,32,33,34,35,36,37,38],
        forbiddenNextCards: []
      },
      {
        name: 'Ti stai',
        id: 3,
        disabled: false,
        forbiddenCards: [9,19,29,39],
        forbiddenNextCards: []
      },
      {
        name: 'Cambia',
        id: 4,
        disabled: false,
        forbiddenCards: [9,19,29,39],
        forbiddenNextCards: [9,19,29,39]
      }
    ]
  }
]

const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100',
  'capacitor://ammireto.cloud',
  'ionic://ammireto.cloud',
  'http://ammireto.cloud',
  'http://ammireto.cloud:8080',
  'http://ammireto.cloud:8100',
  'ionic://www.ammireto.cloud',
  'http://www.ammireto.cloud',
  'http://www.ammireto.cloud:8080',
  'http://www.ammireto.cloud:8100',
  'ionic://www.untivitti.it',
  'http://www.untivitti.it',
  'http://www.untivitti.it:8080',
  'http://www.untivitti.it:8100'
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.log("Unknown origin ----->",origin,"<-----");
      callback(new Error('Origin not allowed by CORS'));
    }
  }
}

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));

app.get('/', cors(corsOptions), (req, res) => {
  const nGroups = groups.length;
  let nUsers = 0
  groups.forEach(x => nUsers += x.players.length)
  res.send('Server untivitti.</br>Status: Ok</br></br>Current groups: ' + nGroups + '</br>Current users: ' + nUsers)
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
    cards: [],
    ground: [],
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
    if (getPlayersLength(group) < game.maxPlayers) {
      if (!group.players.find(x => x.name == nickname)) {
        const player = {
          name: nickname,
          isAdmin: getPlayersLength(group) > 0 ? false : true,
          canMove: false,
          moves: getPlayersLength(group) > 0 ? [] : getAdminMoves(group),
          timestamp: getTime(),
          cards: [],
          visible: false,
          balance: game.defaultBalance,
          ghost: false
        }
        group.players.push(player)
      }
      const text = nickname + ' si è connesso/a'
      const icon = 'Login'
      sendNotification(group, text, icon)
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

/*
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
*/

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

/*
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
*/

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
    if (player.ghost) {
      const text = nickname + ' è ora spettatore'
      const icon = 'Watcher'
      sendNotification(group, text, icon)
    } else {
      const text = nickname + ' è ora giocatore'
      const icon = 'Player'
      sendNotification(group, text, icon)
    }
    setAdmin(group)
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
  socket.isAlive = true;

  socket.on('pong', () => {
    socket.isAlive = true;
  });

  socket.on('message', (message: any) => {
    const msg = JSON.parse(message)
    switch (msg.type) {
      case 'init':
        let found = false;
        subscribers.forEach(subscriber => {
          if (subscriber.code == msg.code && subscriber.nick == msg.nick) {
            found = true
          }
        })
        if (!found) {
          const uuid = uuidv4()
          socket.uuid = uuid
          socket.send(JSON.stringify({success: true, type: msg.type, uuid: uuid}))
          subscribers.push({uuid: uuid, code: msg.code, nick: msg.nick})
        }
        break
      case 'move':
        const subscriber = subscribers.find(x => x.uuid == msg.uuid)
        const group = groups.find(x => x.code == subscriber.code)
        if (group) {
          const player = group.players.find(x => x.name == subscriber.nick)
          if (player) {
            if (executeMove(group, player, msg.move)) {
              socket.send(JSON.stringify({success: true, type: msg.type}))
            } else {
              socket.send(JSON.stringify({success: false, type: msg.type}))
            }
          } else {
            socket.send(JSON.stringify({success: false, type: msg.type}))
          }
        } else {
          socket.send(JSON.stringify({success: false, type: msg.type}))
        }
      default:
        socket.send(JSON.stringify({success: false, type: msg.type}))
    }
  });
  setInterval(function() {
    subscribers.forEach(subscriber => {
      const group = groups.find(x => x.code == subscriber.code)
      if (group) {
        const game = games.find(x => x.id == group.game)
        if (group.status && getPlayersLength(group) < game.minPlayers) {
          group.status = false
          group.cards = []
          group.ground = []
          group.players.forEach(player => {
            player.canMove = false
            player.cards = []
            player.moves = player.isAdmin ? getAdminMoves(group) : []
          })
        }
        const player = group.players.find(x => x.name == subscriber.nick)
        if (player) {
          player.timestamp = getTime()
          wsServer.clients.forEach((ws) => {
            if (ws.uuid == subscriber.uuid && ws.isAlive) {
              ws.send(JSON.stringify({type: 'update', state: group}))
            }
          });
        } 
      } 
    })
  }, 1000);
});

setInterval(() => {
  /*
  console.log(groups)
  console.log(subscribers)
  let list = []
  wsServer.clients.forEach((ws) => {
    list.push(ws.uuid)
  })
  console.log(list)
  */
  wsServer.clients.forEach((ws) => {
    if (!ws.isAlive) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping(null, false, true);
  });
  subscribers.forEach(subscriber => {
    let found = false
    wsServer.clients.forEach((ws) => {
      if (subscriber.uuid == ws.uuid) {
        found = true;
      }
    });
    if (!found) {
      const indexToDelete = subscribers.indexOf(subscriber)
      deletePlayer(subscriber.code, subscriber.nick)
      checkGroup(subscriber.code)
      subscribers.splice(indexToDelete, 1)
    }
  })
}, 60000);

const server = app.listen(port, (err: any) => {
  if (err) console.log(err); 
  console.log(`Example app listening at http://localhost:${port}`)
})

server.on('upgrade', (request: any, socket: any, head: any) => {
  wsServer.handleUpgrade(request, socket, head, (socket: any) => {
    wsServer.emit('connection', socket, request);
  });
});

function newCode() {
  const id = crypt.randomBytes(3).toString("hex")
  return id
}

function checkGroup(code) {
  const group = groups.find(x => x.code == code)
  if (group && group.players.length == 0) {
    deleteGroup(group.code)
  }
}

function deletePlayer(code, nick) {
  let group = groups.find(x => x.code == code)
  if (group) {
    const playerToDelete = group.players.find(x => x.name == nick)
    const indexToDelete = group.players.indexOf(playerToDelete)
    if (indexToDelete > -1) {
      const wasGhost = playerToDelete.ghost ? true : false;
      group.players.splice(indexToDelete,1)
      if (!wasGhost && getPlayersLength(group) > 0) {
        setAdmin(group)
        resetGroup(group)
      }
      logoutUser(group, nick)
      const text = nick + ' si è disconnesso/a'
      const icon = 'Logout'
      sendNotification(group, text, icon)
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
  group.players.forEach(player => {
    let found = false
    newPlayers.forEach(newPlayer => {
      if (player.name == newPlayer.name) found = true
    })
    if (!found) newPlayers.push(player)
  })
  setAdmin(group)
  return newPlayers
}

function executeMove(group, player, move) {
  switch (move) {
    case 0:
      return startMove(group, player)
    case 1:
      return stopMove(group,player)
    case 2:
      return showMove(group, player)
    case 3:
      return skipMove(group, player)
    case 4:
      return swapMove(group, player)
    default:
      return false
  }
}

function startMove(group, player) {
  const game = games.find(x => x.id == group.game)
  if (player.isAdmin) {
    /*
    const newPlayers = [...group.players]
    const shifted = newPlayers.shift()
    newPlayers.push(shifted)
    group.players = solveConflicts(group, newPlayers);
    */
    group.status = true
    group.cards = getShuffledSet(group.cardSet)
    group.ground = []
    for (let i = 0; i < group.players.length; i++) {
      group.players[i].cards = []
      if (!group.players[i].ghost) {
        for (let j = 0; j < game.handCards; j++) {
          group.players[i].cards.push(group.cards.pop())
        }
      }
    }
    group.round += 1
    const text = player.name +  ' ha iniziato la partita'
    const icon = 'Start'
    sendNotification(group, text, icon)
    return turnChange(group, player)
  } else {
    return false
  }
}

function stopMove(group, player) {
  if (player.isAdmin) {
    player.visible = false
    resetGroup(group)
    const text = player.name +  ' ha messo in pausa la partita'
    const icon = 'Pause'
    sendNotification(group, text, icon)
    return true
  } else {
    return false
  }
}

function showMove(group, player) {
  player.visible = true
  const text = player.name +  ' ha il cucù!'
  const icon = 'Blocked'
  sendNotification(group, text, icon, [player.name])
  if (!player.isAdmin) {
    return turnChange(group, player)
  } else {
    turnStop(group, player)
  }
}

function skipMove(group, player) {
  const text = player.name +  ' si è stato'
  const icon = 'Ok'
  sendNotification(group, text, icon, [player.name])
  if (!player.isAdmin) {
    return turnChange(group, player)
  } else {
    return turnStop(group, player)
  }
}

function swapMove(group, player) {
  const game = games.find(x => x.id == group.game)
  const swapMove = getPlayerMoves(group).find(x => x.id == 4)
  if (!player.isAdmin) {
    const index = group.players.findIndex(x => x.name == player.name)
    const newIndex = getNextPlayer(group, index, game.swapOffset)
    let canSwap = true;
    group.players[newIndex].cards.forEach(card => {
      if (swapMove.forbiddenNextCards.includes(card)) {
        canSwap = false;
      }
    })
    if (canSwap) {
      const tempCards = [...group.players[index].cards]
      player.cards = group.players[newIndex].cards
      group.players[newIndex].cards = tempCards
      const text = group.players[index].name +  ' cambia la carta con ' + group.players[newIndex].name
      const icon = 'Swap'
      sendNotification(group, text, icon, [player.name])
    } else {
      const text = player.name +  ' prova a cambiare ma è stato bloccato/a'
      const icon = 'Close'
      sendNotification(group, text, icon, [player.name])
    }
    return turnChange(group, player)
  } else {
    const newCard = group.cards.pop()
    if (swapMove.forbiddenNextCards.includes(newCard)) {
      group.ground.push(newCard)
    } else {
      player.cards = []
      player.cards.push(newCard)
    }
    return turnStop(group, player)
  }
}

function turnChange(group, player) {
  const index = group.players.findIndex(x => x.name == player.name)
  const newIndex = getNextPlayer(group, index)
  group.players[index].canMove = false;
  group.players[index].moves = group.players[index].isAdmin ? getAdminMoves(group) : []
  group.players[newIndex].canMove = true;
  getPlayerMoves(group).forEach(move => {
    group.players[newIndex].cards.forEach(card => {
      if (move.forbiddenCards.includes(card)) {
        group.players[newIndex].moves.push({name: move.name, id: move.id, disabled: true})
      } else {
        group.players[newIndex].moves.push({name: move.name, id: move.id, disabled: false})
      }
    })
  })
  if (group.players[newIndex].isAdmin) {
    group.players[newIndex].visible = true
    const text = 'La carta del mazziere ' + group.players[newIndex].name +  ' è ora visibile'
    const icon = 'Show'
    sendNotification(group, text, icon)
  }
  return true
}

function turnStop(group, player) {
  const game = games.find(x => x.id == group.game)
  player.canMove = false
  player.moves = player.isAdmin ? getAdminMoves(group) : []
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

function getNextPlayer(group, index, offset = 1) {
  let newIndex = index
  do {
    do {
      newIndex = (newIndex + 1) % group.players.length
    } while (group.players[newIndex].ghost && index != newIndex)
    offset -= 1
  } while (offset != 0)
  return newIndex
}

function resetGroup(group) {
  group.status = false
  group.cards = []
  for (let i = 0; i < group.players.length; i++) {
    group.players[i].cards = []
    group.players[i].canMove = false
    group.players[i].moves = group.players[i].isAdmin ? getAdminMoves(group) : []
    group.players[i].visible = false
  }
}

function sendNotification(group, text, icon, excludeList = []) {
  subscribers.forEach(subscriber => {
    if (subscriber.code == group.code) {
      wsServer.clients.forEach((ws) => {
        if (ws.uuid == subscriber.uuid && ws.isAlive && !excludeList.includes(subscriber.nick)) {
          ws.send(JSON.stringify({type: 'message', text: text, icon: icon})); 
        }
      })
    }
  })
}

function logoutUser(group, nick) {
  subscribers.forEach((subscriber, i) => {
    if (subscriber.code == group.code && subscriber.nick == nick) {
      wsServer.clients.forEach((ws) => {
        if (ws.uuid == subscriber.uuid && ws.isAlive) {
          ws.send(JSON.stringify({type: 'close'}))
          subscribers.splice(i, 1)
          ws.terminate()
        }
      })
    }
  })
}

function getPlayerMoves(group) {
  const game = games.find(x => x.id == group.game)
  let moveToReturn = []
  game.playerMoves.forEach(move => {
    moveToReturn.push({name: move.name, id: move.id, disabled: false, forbiddenCards: move.forbiddenCards, forbiddenNextCards: move.forbiddenNextCards})
  })
  return moveToReturn
}

function getAdminMoves(group) {
  const game = games.find(x => x.id == group.game)
  let moveToReturn = []
  game.adminMoves.forEach(move => {
    moveToReturn.push({name: move.name, id: move.id, disabled: false})
  })
  return moveToReturn
}

function getPlayersLength(group) {
  let count = 0
  group.players.forEach(player => {
    if (!player.ghost) {
      count += 1
    }
  });
  return count
}

function setAdmin(group) {
  if (getPlayersLength(group) > 0) {
    const adminIndex = group.players.findIndex(x => x.isAdmin == true)
    const newAdminIndex = getNextPlayer(group, -1)
    if (adminIndex != -1 && adminIndex != newAdminIndex) {
      group.players[adminIndex].isAdmin = false
      group.players[adminIndex].moves = []
      const newAdmin = group.players[newAdminIndex]
      newAdmin.isAdmin = true
      newAdmin.moves = getAdminMoves(group)
      const text = newAdmin.name + ' è il nuovo mazziere'
      const icon = 'Admin'
      sendNotification(group, text, icon)
    }
  }
  orderGroup(group)
}

function orderGroup(group) {
  const adminIndex = group.players.find(x => x.isAdmin == true)
  if (adminIndex && adminIndex != 0) {
    const shifted = group.players.splice(0, adminIndex)
    group.players.concat(shifted)
  }
}
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
        name: 'Distribuisci',
        id: 0,
        disabled: false,
        icon: 'share-outline',
        rotateIcon: false,
        side: 'top',
        status: false
      },
      {
        name: 'Ritira carte',
        id: 1,
        disabled: false,
        icon: 'download-outline',
        rotateIcon: false,
        side: 'top',
        status: true
      },
      {
        name: 'Passa il mazzo',
        id: 2,
        disabled: false,
        icon: 'albums-outline',
        rotateIcon: true,
        side: 'bottom',
        status: false
      }
    ],
    playerMoves: [
      {
        name: 'Cucù!',
        id: 3,
        disabled: false,
        icon: 'hand-left-outline',
        rotateIcon: false,
        side: 'bottom',
        status: true,
        forbiddenCards: [0,1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,30,31,32,33,34,35,36,37,38],
        forbiddenNextCards: []
      },
      {
        name: 'Ti stai',
        id: 4,
        disabled: false,
        icon: 'thumbs-up-outline',
        rotateIcon: false,
        side: 'start',
        status: true,
        forbiddenCards: [9,19,29,39],
        forbiddenNextCards: []
      },
      {
        name: 'Cambia',
        id: 5,
        disabled: false,
        icon: 'repeat-outline',
        rotateIcon: false,
        side: 'end',
        status: true,
        forbiddenCards: [9,19,29,39],
        forbiddenNextCards: [9,19,29,39]
      },
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
  if (group) {
    if (group.status != true) {
      const game = games.find(x => x.id == group.game)
      if (getPlayersLength(group) < game.maxPlayers) {
        if (!group.players.find(x => x.name == nickname)) {
          const player = {
            name: nickname,
            isAdmin: getPlayersLength(group) > 0 ? false : true,
            canMove: false,
            moves: getPlayersLength(group) > 0 ? [] : getAdminMoves(group),
            cards: [],
            visible: false,
            balance: game.defaultBalance,
            ghost: false
          }
          group.players.push(player)
          setAdmin(group)
          const text = nickname + ' si è connesso/a'
          const icon = 'Login'
          sendNotification(group, text, icon)
          response = {
            success: true,
            data: group
          }
        } else {
          response = {
            success: false,
            errorCode: "DUPLICATE"
          }
        }
      } else {
        response = {
          success: false,
          errorCode: "MAX_PLAYERS"
        }
      }
    } else {
      response = {
        success: false,
        errorCode: "ALREADY_STARTED"
      }
    }
  } else {
    response = {
      success: false,
      errorCode: "GROUP_NOT_EXISTS"
    }
  }
  res.send(response)
})

app.get('/exitGroup/:nick/:code', cors(corsOptions), (req, res) => {
  const nickname = req.params['nick']
  const code = req.params['code']
  let response
  const group = groups.find(x => x.code == code)
  if (group) {
    const player = group.players.find(x => x.name == nickname)
    if (player) {
      deletePlayer(player.uuid)
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
        const uuid = uuidv4()
        socket.uuid = uuid
        groups.forEach(group => {
          if (group.code == msg.code) {
            group.players.forEach(player => {
              if (player.name == msg.nick) {
                player.uuid = uuid
                player.timestamp =  Date.now()
                socket.send(JSON.stringify({success: true, type: msg.type, uuid: uuid}))
              }
            })
          }
        })
        break
      case 'move':
        groups.forEach(group => {
          group.players.forEach(player => {
            if (player.uuid == msg.uuid) {
              if (executeMove(group, player, msg.move)) {
                socket.send(JSON.stringify({success: true, type: msg.type}))
              } else {
                socket.send(JSON.stringify({success: false, type: msg.type}))
              }
            }
          })
        })
        break
      default:
        socket.send(JSON.stringify({success: false, type: msg.type}))
    }
  });
});

setInterval(function() {
  groups.forEach(group => {
    const game = games.find(x => x.id == group.game)
    if (getPlayersLength(group) < game.minPlayers) {
      if (group.status) {
        resetGroup(group)
      }
      setAdminMoves(group, false)
    } else {
      setAdminMoves(group, true)
    }
    group.players.forEach(player => {
      wsServer.clients.forEach(ws => {
        if (ws.uuid == player.uuid) {
          if (ws.isAlive) {
            player.timestamp = Date.now()
            ws.send(JSON.stringify({type: 'update', state: group}))
          }
          ws.isAlive = false;
          ws.ping(null, false, true);
        }
      });
      if (Date.now() - player.timestamp > 1000 * 60) {
        deletePlayer(player.uuid)
      }
    })
    checkGroup(group.code)
  })
  
}, 1000);

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

function deletePlayer(uuid) {
  groups.forEach(group => {
    group.players.forEach((player, i) => {
      if (player.uuid == uuid) {
        const text = player.name + ' si è disconnesso/a'
        const icon = 'Logout'
        sendNotification(group, text, icon)
        if (player.isAdmin) {
          setAdmin(group)
        }
        group.players.splice(i, 1)
        if (group.status && !player.ghost && getPlayersLength(group) > 0) {
          resetGroup(group)
          const text = 'Partita interrotta'
          const icon = 'Pause'
          sendNotification(group, text, icon)
        }
        logoutClient(uuid)
      } 
    })
  })
}

function logoutClient(uuid) {
  wsServer.clients.forEach(ws => {
    if (ws.uuid == uuid) {
      ws.terminate()
    }
  })
}

function deleteGroup(code) {
  let group = groups.find(x => x.code == code)
  if (group) {
    const indexToDelete = groups.indexOf(group)
    if (indexToDelete > -1) {
      groups.splice(indexToDelete,1)
    }
  }
}

function getTime() {
  return Math.floor(Date.now() / 1000)
}

function solveConflicts(group, newPlayers) {
  group.players.forEach(player => {
    let found = false
    newPlayers.forEach(newPlayer => {
      if (player.name == newPlayer.name) {
        found = true
      }
    })
    if (!found) {
      newPlayers.push(player)
    }
  })
  return newPlayers
}

function executeMove(group, player, move) {
  switch (move) {
    case 0:
      return startMove(group, player)
    case 1:
      return stopMove(group,player)
    case 2:
      return passMove(group, player)
    case 3:
      return showMove(group, player)
    case 4:
      return skipMove(group, player)
    case 5:
      return swapMove(group, player)
    default:
      return false
  }
}

function startMove(group, player) {
  const game = games.find(x => x.id == group.game)
  if (player.isAdmin) {
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
    const text = player.name +  ' ha distribuito le carte'
    const icon = 'Start'
    sendNotification(group, text, icon)
    return turnChange(group, player)
  } else {
    return false
  }
}

function stopMove(group, player) {
  if (player.isAdmin) {
    resetGroup(group)
    const text = player.name +  ' ha ritirato le carte'
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
  const swapMove = getPlayerMoves(group).find(x => x.id == 5)
  if (!player.isAdmin) {
    const newPlayer = getNextPlayer(group, player)
    let canSwap = true;
    newPlayer.cards.forEach(card => {
      if (swapMove.forbiddenNextCards.includes(card)) {
        canSwap = false;
      }
    })
    const text = player.name + ' prova a cambiare con ' + newPlayer.name
    const icon = 'Swap'
    sendNotification(group, text, icon, [player.name])
    if (canSwap) {
      const tempCards = [...player.cards]
      player.cards = newPlayer.cards
      newPlayer.cards = tempCards
    }
    return turnChange(group, player)
  } else {
    const text = player.name + ' prova a pescare dal mazzo'
    const icon = 'Swap'
    sendNotification(group, text, icon, [player.name])
    const newCard = group.cards.pop()
    group.ground.push(newCard)
    if (swapMove.forbiddenNextCards.includes(newCard)) {
      const text = 'Cucù!'
      const icon = 'Close'
      sendNotification(group, text, icon)
    } 
    return turnStop(group, player)
  }
}

function passMove(group, player) {
  if (player.isAdmin) {
    resetGroup(group)
    const text = player.name +  ' passa il mazzo'
    const icon = 'Admin'
    sendNotification(group, text, icon, [player.name])
    setAdmin(group)
    return true
  } else {
    return false
  }
}

function turnChange(group, player) {
  const newPlayer = getNextPlayer(group, player)
  player.canMove = false;
  player.moves = player.isAdmin ? getAdminMoves(group) : []
  newPlayer.canMove = true;
  getPlayerMoves(group).forEach(move => {
    newPlayer.cards.forEach(card => {
      if (move.forbiddenCards.includes(card)) {
        newPlayer.moves.push(copyMove(move, true))
      } else {
        newPlayer.moves.push(copyMove(move))
      }
    })
  })
  if (newPlayer.isAdmin) {
    newPlayer.visible = true
    const text = 'La carta del mazziere ' + newPlayer.name +  ' è ora visibile'
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

function getNextPlayer(group, player, next = true) {
  let attempts = 0
  let newIndex = player ? group.players.findIndex(x => x.name == player.name) : 0
  newIndex = next ? newIndex = newIndex + 1 % group.players.length : newIndex
  console.log(newIndex)
  while (group.players[newIndex].ghost && attempts < group.players.length) {
    attempts += 1
    newIndex = (newIndex + 1) % group.players.length
  }
  return group.players[newIndex]
}

function resetGroup(group) {
  group.status = false
  group.cards = []
  group.ground = []
  for (let i = 0; i < group.players.length; i++) {
    group.players[i].cards = []
    group.players[i].canMove = false
    group.players[i].moves = group.players[i].isAdmin ? getAdminMoves(group) : []
    group.players[i].visible = false
  }
}

function sendNotification(group, text, icon, excludeList = []) {
  group.players.forEach(player => {
    wsServer.clients.forEach((ws) => {
      if (ws.uuid == player.uuid && ws.isAlive && !excludeList.includes(player.name)) {
        ws.send(JSON.stringify({type: 'message', text: text, icon: icon})); 
      }
    })
  })
}

function getPlayerMoves(group) {
  const game = games.find(x => x.id == group.game)
  let moveToReturn = []
  game.playerMoves.forEach(move => {
    moveToReturn.push({
      name: move.name,
      id: move.id,
      disabled: false,
      icon: move.icon,
      rotateIcon: move.rotateIcon,
      side: move.side,
      status: move.status,
      forbiddenCards: move.forbiddenCards,
      forbiddenNextCards: move.forbiddenNextCards
    })
  })
  return moveToReturn
}

function getAdminMoves(group, enableMoves?) {
  const game = games.find(x => x.id == group.game)
  let moveToReturn = []
  game.adminMoves.forEach(move => {
    moveToReturn.push(copyMove(move, !enableMoves))
  })
  return moveToReturn
}

function copyMove(move, disabled?) {
  return {
    name: move.name,
    id: move.id,
    disabled: disabled ? disabled : move.disabled,
    icon: move.icon,
    rotateIcon: move.rotateIcon,
    side: move.side,
    status: move.status,
    forbiddenCards: move.forbiddenCards,
    forbiddenNextCards: move.forbiddenNextCards
  }
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
  const admin = group.players.find(x => x.isAdmin == true)
  if (admin) {
    admin.isAdmin = false
    admin.moves = []
  }
  if (getPlayersLength(group) > 0) {
    const newAdmin = getNextPlayer(group, admin, false)
    if (newAdmin) {
      newAdmin.isAdmin = true
      newAdmin.moves = getAdminMoves(group)
    }
    if (!admin || admin.name != newAdmin.name) {
      const text = newAdmin.name + ' è il nuovo mazziere'
      const icon = 'Admin'
      sendNotification(group, text, icon)
    }
  }
}

function setAdminMoves(group, enable) {
  for (let i = 0; i < group.players.length; i++) {
    if (group.players[i].isAdmin) {
      group.players[i].moves = getAdminMoves(group, enable)
    }
  }
}


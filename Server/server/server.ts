import e from "express";

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
    size: 40,
    games: [0]
  },
  {
    id: 3,
    name: 'Genovesi',
    size: 52,
    games: [1]
  }
]

const extraCardSets = [
  {
    id: 1,
    name: 'Siciliane (Friends Edition)',
    size: 40,
    games: [0],
    code: 'FRIENDS'
  },
  {
    id: 2,
    name: 'Siciliane (Family Edition)',
    size: 40,
    games: [0],
    code: 'FAMILY'
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
    defaultBalance: 3,
    mustShow: true,
    maxValue: 10,
    fixedDealer: false,
    teams: 0,
    adminMoves: [
      {
        name: 'Distribuisci',
        id: 0,
        disabled: false,
        icon: 'albums-outline',
        rotateIcon: true,
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
  },
  {
    id: 1,
    name: 'Baccarà',
    handCards: 2,
    minPlayers: 3,
    maxPlayers: 100,
    clockwise: false,
    defaultBalance: 500,
    mustShow: true,
    maxValue: 13,
    fixedDealer: true,
    teams: 2,
    adminMoves: [
      {
        name: 'Distribuisci',
        id: 0,
        disabled: false,
        icon: 'albums-outline',
        rotateIcon: true,
        side: 'top',
        status: false
      },
      {
        name: 'Ritira carte',
        id: 1,            
        disabled: false,
        icon: 'albums-outline',            
        rotateIcon: false,
        side: 'top',
        status: true
      }
    ],
    playerMoves: [
      {
        name: 'Chiusi',
        id: 6,
        disabled: false,                                                                                                                                                                                                                             
        icon: 'thumbs-up-outline',
        rotateIcon: false,
        side: 'end',
        status: true,
        forbiddenCards: [],
        forbiddenNextCards: []
      },
      {
        name: 'Aperti',
        id: 7                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ,
        disabled: false,
        icon: 'thumbs-down-outline',
        rotateIcon: false,
        side: 'start',
        status: true,
        forbiddenCards: [],
        forbiddenNextCards: []
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
  'ionic://untivitti.it',
  'http://untivitti.it',
  'http://untivitti.it:8080',
  'http://untivitti.it:8100',
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
    balance: req.body.balance,
    round: 0,
    cards: [],
    ground: [],
    activePlayers: 0,
    history: [],
    players: [
      {
        name: req.body.nickname,
        isAdmin: true,
        canMove: false,
        moves: game.adminMoves,
        cards: [],
        visible: false,
        balance: req.body.balance,
        haveToPay: false,
        ghost: false,
        isWinner: false,
        index: 0,
        team: game.teams ? 0 : undefined
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
    const cardSet = cardSets.concat(extraCardSets).find(x => x.id == group.cardSet)
    const savedPlayer = loadState(group, nickname)
    if ((group.status != true && group.round == 0) || 
        (group.status != true && group.round > 0 && savedPlayer)) {
      const game = games.find(x => x.id == group.game)
      if (getPlayersLength(group) < game.maxPlayers) {
        if (!group.players.find(x => x.name == nickname)) {
          let team, index
          if (game.teams) {
            if (!savedPlayer) {
              team = getNewTeam(group)
            } else {
              team = savedPlayer.team
            }
            index = getIndexByTeam(group, team)
          }
          const player = {
            name: nickname,
            isAdmin: false,
            canMove: false,
            moves: [],
            cards: [],
            visible: false,
            balance: savedPlayer ? savedPlayer.balance : group.balance,
            haveToPay: savedPlayer ? savedPlayer.haveToPay : false,
            ghost: savedPlayer ? savedPlayer.ghost : false,
            isWinner: false,
            index: game.teams ? index : savedPlayer ? savedPlayer.index : undefined,
            team: team
          }
          if (player.index && player.index < group.players.length) {
            group.players.splice(player.index, 0, player);
          } else {
            group.players.push(player)
          }
          if (savedPlayer && savedPlayer.isAdmin && !savedPlayer.ghost && group.round == savedPlayer.round) {
            setAdmin(group, undefined, player)
          } else {
            setAdmin(group)
          }
          const text = nickname + ' si è connesso/a'
          const icon = 'Login'
          sendNotification(group, text, icon)
          response = {
            success: true,
            data: { group, cardSet }
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

app.get('/getCardSets/:extraSet', cors(corsOptions), (req, res) => {
  const extraSetCode = req.params['extraSet']
  let extraSetList = extraCardSets.filter(x => x.code == extraSetCode);
  const response = {
    success: true,
    data: cardSets.concat(extraSetList)
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
  const newBalance = parseInt(req.params['balance'], 10)
  const group = groups.find(x => x.code == code)
  const game = games.find(x => x.id == group.game)
  let response
  if (group) {
    if (newBalance >= 0 && newBalance <= game.defaultBalance) {
      const player = group.players.find(x => x.name == nickname)
      if (player) {
        player.haveToPay = false
        const text = player.name + ' ha pagato'
        const icon = 'Money'
        sendNotification(group, text, icon)
        player.balance = newBalance
        if (newBalance == 0) {
          setGhost(group, player, true, false)
          if (group.money) {
            checkWinner(group)
          }
          if (!isFinished(group)) {
            sendImpressedText(group, player.name + ' è morto/a!', [player.name]);
            let excludeList = []
            group.players.filter(x => {
              if (x.name != player.name) excludeList.push(x.name)
            });
            sendImpressedText(group, 'Sei morto!', excludeList);
          }
        }
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
        success: false,
        errorCode: "Valore non valido"
      }
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
  const value = req.params['value'] == "true"
  const group = groups.find(x => x.code == code)
  let response
  if (group) {
    const player = group.players.find(x => x.name == nickname)
    setGhost(group, player, value)
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

app.get('/retrieveSession/:uuid', cors(corsOptions), (req, res) => {
  const uuid = req.params['uuid']
  let response
  if (uuid) {
    let group, player, game, cardSet;
    [group, player, game, cardSet] = retrievePlayer(uuid)
    response = {
      success: true,
      data: {
        group: group,
        player: player,
        game: game,
        cardSet: cardSet
      }
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
      case 'text':
        groups.forEach(group => {
          group.players.forEach(player => {
            if (player.uuid == msg.uuid) {
              sendImpressedText(group, msg.text, undefined, msg.from);
            }
          })
        })
        break;
      default:
        socket.send(JSON.stringify({success: false, type: msg.type}))
    }
  });
});

setInterval(function() {
  groups.forEach(group => {
    const game = games.find(x => x.id == group.game)
    if (getPlayersLength(group) < game.minPlayers && group.status) {
        resetGroup(group)
    }
    group.activePlayers = getPlayersLength(group)
    group.players.forEach(player => {
      saveState(group, player)
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
      if (Date.now() - player.timestamp > 1000 * 120) {
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
          setAdmin(group, true)
        }
        group.players.splice(i, 1)
        if (group.status && !group.ground && !player.ghost && getPlayersLength(group) > 0) {
          resetGroup(group)
          group.round -= 1;
          const text = 'Partita interrotta'
          const icon = 'Pause'
          sendNotification(group, text, icon)
        }
        logoutClient(uuid)
      } 
    })
  })
}

function retrievePlayer(uuid) {
  let retrievedGroup, retrievedPlayer, retrievedGame, retrieveCardSet
  groups.forEach(group => {
    group.players.forEach(player => {
      if (player.uuid == uuid) {
        retrievedGroup = group
        retrievedPlayer = player
        retrievedGame = games.find(x => x.id == retrievedGroup.game)
        retrieveCardSet = cardSets.concat(extraCardSets).find(x => x.id == retrievedGroup.cardSet)
      } 
    })
  })
  return [retrievedGroup, retrievedPlayer, retrievedGame, retrieveCardSet]
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
  player.lastMove = move
  switch (move) {
    case 0:
      return startMove(group, player)
    case 1:
      return stopMove(group,player)
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
      group.players[i].isWinner = false
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
    const isFinished = group.players.findIndex(x => x.canMove) == -1;
    if (isFinished) {
      resetGroup(group)
      passMove(group, player)
    } else {
      resetGroup(group)
      group.round -= 1;
      const text = player.name +  ' ha ritirato le carte'
      const icon = 'Pause'
      sendNotification(group, text, icon)
    }
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
  const text = player.name +  ' si è stato/a'
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
      const icon = 'Blocked'
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
    setAdmin(group, true)
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
  let excludeList = []
  group.players.filter(x => {
    if (x.name != newPlayer.name) excludeList.push(x.name)
  });
  sendImpressedText(group, 'E\' il tuo turno!', excludeList);
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
  if (group.money) {
    computeLosers(group)
  }
  return true
}

function getShuffledSet(cardSet) {
  const size = cardSets.concat(extraCardSets).find(x => x.id == cardSet).size
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
  newIndex = next ? (newIndex + 1) % group.players.length : newIndex
  while (group.players[newIndex].ghost && attempts < group.players.length) {
    attempts += 1
    newIndex = (newIndex + 1) % group.players.length
  }
  return group.players[newIndex]
}

function resetGroup(group, hard?) {
  const game = games.find(x => x.id == group.game)
  group.status = false
  group.cards = []
  group.ground = []
  for (let i = 0; i < group.players.length; i++) {
    group.players[i].cards = []
    group.players[i].canMove = false
    group.players[i].moves = group.players[i].isAdmin ? getAdminMoves(group) : []
    group.players[i].visible = false
    group.players[i].lastMove = undefined
    if (hard) {
      group.players[i].ghost = false
      group.players[i].haveToPay = false
      group.players[i].balance = group.balance
    }
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

function sendImpressedText(group, text, excludeList = [], from = undefined) {
  group.players.forEach(player => {
    wsServer.clients.forEach((ws) => {
      if (ws.uuid == player.uuid && ws.isAlive && !excludeList.includes(player.name)) {
        ws.send(JSON.stringify({type: 'text', text: text, from: from})); 
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

function getAdminMoves(group) {
  const game = games.find(x => x.id == group.game)
  let moveToReturn = []
  game.adminMoves.forEach(move => {
    moveToReturn.push(copyMove(move))
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

function setAdmin(group, next = false, player?) {
  const admin = group.players.find(x => x.isAdmin == true)
  if (admin) {
    admin.isAdmin = false
    admin.moves = []
  }
  if (getPlayersLength(group) > 0) {
    let newAdmin;
    if (player) {
      newAdmin = player;
    } else {
      newAdmin = getNextPlayer(group, admin, next)
    }
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

function setGhost(group, player, value, notification = true) {
  player.ghost = value ? true : false

  if (notification) {
    if (player.ghost) {
      const text = player.name + ' è ora spettatore'
      const icon = 'Watcher'
      sendNotification(group, text, icon)
    } else {
      const text = player.name + ' è ora giocatore'
      const icon = 'Player'
      sendNotification(group, text, icon)
    }
  }
}

function computeLosers(group) {
  const game = games.find(x => x.id == group.game)
  let results = []
  for (let i = 0; i < group.players.length; i++) {
    const player = group.players[i]
    if (!player.ghost) {
      if (player.isAdmin && group.ground.length != 0 && !game.playerMoves.find(x => x.id == 5).forbiddenCards.includes(group.ground[0])) {
        results.push(group.ground[0] % game.maxValue)
      } else {
        results.push(player.cards[0] % game.maxValue)
      }
    }
  }
  const min = Math.min(...results)

  let losers = []
  group.players.forEach(player => {
    if (!player.ghost) {
      let card
      if (player.isAdmin && group.ground.length != 0 && !game.playerMoves.find(x => x.id == 5).forbiddenCards.includes(group.ground[0])) {
        card = group.ground[0]
      } else {
        card = player.cards[0]
      }
      if ((card % game.maxValue) == min) { 
        player.haveToPay = true
        losers.push(player.name)
      }
    }
  });

  if (losers.length > 1) {
    let tie = false
    if (losers.length == getPlayersLength(group)) {
      losers.forEach(loser => {
        const player = group.players.find(x => x.name == loser)
        if (player.balance == 1) {
          tie = true
        } else {
          tie = false
        }
      })
    }
    if (tie) {
      group.players.forEach(player => {
        player.haveToPay = false
        player.ghost = false
        player.balance = 1
      })
      const text = 'Pareggio! Tutti i giocatori rientrano in partita!'
      const icon = 'Players'
      sendNotification(group, text, icon)
    } else {
      const last = losers.pop()
      const people = losers.join(', ') + 'e ' + last
      const text = people + ' devono pagare'
      const icon = 'Money'
      sendNotification(group, text, icon)
    }
  } else {
    const text = losers[0] + ' deve pagare'
    const icon = 'Money'
    sendNotification(group, text, icon)
  }
}

function checkWinner(group) {
  if (getPlayersLength(group) <= 1) {
    const winner = group.players.find(x => x.balance > 0)
    if (winner && group.round > 0) {
      resetGroup(group, true)
      winner.isWinner = true
      const text = winner.name +  ' è il vincitore della partita!'
      const icon = 'Winner'
      sendNotification(group, text, icon)
      sendImpressedText(group, winner.name + ' ha vinto!', [winner.name]);
      let excludeList = []
      group.players.filter(x => {
        if (x.name != winner.name) excludeList.push(x.name)
      });
      sendImpressedText(group, 'Hai vinto!', excludeList);
    }
  }
}

function isFinished(group) {
  const winner = group.players.find(x => x.isWinner === true)
  return winner != undefined
}

function saveState(group, player) {
  const historyIndex = group.history.findIndex(x => x.name == player.name)
  if (historyIndex != -1) {
    player.round = group.round
    const index = group.players.findIndex(x => x.name == player.name)
    player.index = index
    group.history.splice(historyIndex, 1, Object.assign({}, player))
  } else {
    group.history.push(Object.assign({}, player))
  }
}

function loadState(group, nickname) {
  return group.history.find(x => x.name == nickname)
}

function getNewTeam(group) {
  const game = games.find(x => x.id == group.game)
  const nTeams = game.teams;
  let members = []
  for (let i = 0; i < nTeams; i++) {
    const index = game.fixedDealer ? i + 1 : i
    const players = group.players.filter(x => x.team == index)
    members.push(players.length)
  }
  const min = Math.min(...members)
  const newTeam = members.indexOf(min)
  return game.fixedDealer ? newTeam + 1 : newTeam
}

function getIndexByTeam(group, team) {
  let last = group.players.length - 1
  for (let i = 0; i < group.players.length; i++) {
    if (group.players[i].team == team) {
      last = i
    }
  }
  return last + 1
}

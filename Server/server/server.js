"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var express = require('express');
var bodyParser = require('body-parser');
var crypt = require("crypto");
var cors = require('cors');
var groupCollapsed = require('console').groupCollapsed;
var ws = require('ws');
var uuidv4 = require('uuid').v4;
var app = express();
var port = 3000;
var jsonParser = bodyParser.json();
var subscribers = [];
var groups = [];
var cardSets = [
    {
        id: 0,
        name: 'Siciliane',
        size: 40
    }
];
var games = [
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
                id: 2,
                disabled: false,
                forbiddenCards: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38],
                forbiddenNextCards: []
            },
            {
                name: 'Ti stai',
                id: 3,
                disabled: false,
                forbiddenCards: [9, 19, 29, 39],
                forbiddenNextCards: []
            },
            {
                name: 'Cambia',
                id: 4,
                disabled: false,
                forbiddenCards: [9, 19, 29, 39],
                forbiddenNextCards: [9, 19, 29, 39]
            }
        ]
    }
];
var allowedOrigins = [
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
var corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            console.log("----->", origin, "<-----");
            callback(new Error('Origin not allowed by CORS'));
        }
    }
};
// Enable preflight requests for all routes
app.options('*', cors(corsOptions));
app.get('/', cors(corsOptions), function (req, res) {
    var nGroups = groups.length;
    var nUsers = 0;
    groups.forEach(function (x) { return nUsers += x.players.length; });
    res.send('Server untivitti.</br>Status: Ok</br></br>Current groups: ' + nGroups + '</br>Current users: ' + nUsers);
});
app.post('/createGroup', jsonParser, cors(corsOptions), function (req, res) {
    var code;
    var group;
    do {
        code = newCode();
        group = groups.find(function (x) { return x.code == code; });
    } while (group);
    var game = games.find(function (x) { return x.id == req.body.game; });
    var newGroup = {
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
    };
    groups.push(newGroup);
    var response = {
        success: true,
        data: newGroup
    };
    res.send(response);
});
app.get('/joinGroup/:nick/:code', cors(corsOptions), function (req, res) {
    var nickname = req.params['nick'];
    var group = groups.find(function (x) { return x.code == req.params['code']; });
    var response;
    if (group && group.status != true) {
        var game = games.find(function (x) { return x.id == group.game; });
        if (group.players.length < game.maxPlayers) {
            if (!group.players.find(function (x) { return x.name == nickname; })) {
                var player = {
                    name: nickname,
                    isAdmin: group.players.length > 0 ? false : true,
                    canMove: false,
                    moves: group.players.length > 0 ? [] : game.adminMoves,
                    timestamp: getTime(),
                    cards: [],
                    visible: false,
                    balance: game.defaultBalance,
                    ghost: false
                };
                group.players.push(player);
            }
            response = {
                success: true,
                data: group
            };
        }
        else {
            response = {
                success: false
            };
        }
    }
    else {
        response = {
            success: false
        };
    }
    res.send(response);
});
app.get('/exitGroup/:nick/:code', cors(corsOptions), function (req, res) {
    var nickname = req.params['nick'];
    var code = req.params['code'];
    var response;
    if (deletePlayer(code, nickname)) {
        response = {
            success: true
        };
    }
    else {
        response = {
            success: false
        };
    }
    res.send(response);
});
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
app.get('/getCardSets', cors(corsOptions), function (req, res) {
    var response = {
        success: true,
        data: cardSets
    };
    res.send(response);
});
app.get('/getGames', cors(corsOptions), function (req, res) {
    var response = {
        success: true,
        data: games
    };
    res.send(response);
});
app.post('/updatePlayers', jsonParser, cors(corsOptions), function (req, res) {
    var newPlayers = req.body.players;
    var code = req.body.code;
    var group = groups.find(function (x) { return x.code == code; });
    var response;
    if (group) {
        group.players = solveConflicts(group, newPlayers);
        response = {
            success: true
        };
    }
    else {
        response = {
            success: false
        };
    }
    res.send(response);
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
app.get('/updateBalance/:nick/:code/:balance', cors(corsOptions), function (req, res) {
    var nickname = req.params['nick'];
    var code = req.params['code'];
    var newBalance = req.params['balance'];
    var group = groups.find(function (x) { return x.code == code; });
    var response;
    if (group) {
        var player = group.players.find(function (x) { return x.name == nickname; });
        player.balance = newBalance;
        response = {
            success: true
        };
        if (newBalance == 0) {
            player.ghost = true;
        }
    }
    else {
        response = {
            success: false
        };
    }
    res.send(response);
});
app.get('/setGhost/:nick/:code/:value', cors(corsOptions), function (req, res) {
    var nickname = req.params['nick'];
    var code = req.params['code'];
    var value = req.params['value'];
    var group = groups.find(function (x) { return x.code == code; });
    var response;
    if (group) {
        var player = group.players.find(function (x) { return x.name == nickname; });
        player.ghost = value == "true" ? true : false;
        response = {
            success: true
        };
    }
    else {
        response = {
            success: false
        };
    }
    res.send(response);
});
var wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', function (socket) {
    socket.isAlive = true;
    socket.on('pong', function () {
        socket.isAlive = true;
    });
    socket.on('message', function (message) {
        var msg = JSON.parse(message);
        switch (msg.type) {
            case 'init':
                var found_1 = false;
                subscribers.forEach(function (subscriber) {
                    if (subscriber.code == msg.code && subscriber.nick == msg.nick) {
                        found_1 = true;
                    }
                });
                if (!found_1) {
                    var uuid = uuidv4();
                    socket.uuid = uuid;
                    socket.send(JSON.stringify({ success: true, type: msg.type, uuid: uuid }));
                    subscribers.push({ uuid: uuid, code: msg.code, nick: msg.nick });
                }
                break;
            case 'move':
                var subscriber_1 = subscribers.find(function (x) { return x.uuid == msg.uuid; });
                var group = groups.find(function (x) { return x.code == subscriber_1.code; });
                if (group) {
                    var player = group.players.find(function (x) { return x.name == subscriber_1.nick; });
                    if (player) {
                        if (executeMove(group, player, msg.move)) {
                            socket.send(JSON.stringify({ success: true, type: msg.type }));
                        }
                        else {
                            socket.send(JSON.stringify({ success: false, type: msg.type }));
                        }
                    }
                    else {
                        socket.send(JSON.stringify({ success: false, type: msg.type }));
                    }
                }
                else {
                    socket.send(JSON.stringify({ success: false, type: msg.type }));
                }
            default:
                socket.send(JSON.stringify({ success: false, type: msg.type }));
        }
    });
    setInterval(function () {
        subscribers.forEach(function (subscriber) {
            var group = groups.find(function (x) { return x.code == subscriber.code; });
            var response;
            if (group) {
                var game_1 = games.find(function (x) { return x.id == group.game; });
                if (group.players.length < game_1.minPlayers) {
                    group.status = false;
                    group.cards = [];
                    group.ground = [];
                    group.players.forEach(function (player) {
                        player.canMove = false;
                        player.cards = [];
                        player.moves = player.isAdmin ? game_1.adminMoves : [];
                    });
                }
                var player = group.players.find(function (x) { return x.name == subscriber.nick; });
                if (player) {
                    player.timestamp = getTime();
                    wsServer.clients.forEach(function (ws) {
                        if (ws.uuid == subscriber.uuid && ws.isAlive) {
                            ws.send(JSON.stringify({ type: 'update', state: group }));
                        }
                    });
                }
            }
        });
    }, 1000);
});
setInterval(function () {
    /*
    console.log(groups)
    console.log(subscribers)
    let list = []
    wsServer.clients.forEach((ws) => {
      list.push(ws.uuid)
    })
    console.log(list)
    */
    wsServer.clients.forEach(function (ws) {
        if (!ws.isAlive) {
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping(null, false, true);
    });
    subscribers.forEach(function (subscriber) {
        var found = false;
        wsServer.clients.forEach(function (ws) {
            if (subscriber.uuid == ws.uuid) {
                found = true;
            }
        });
        if (!found) {
            var indexToDelete = subscribers.indexOf(subscriber);
            deletePlayer(subscriber.code, subscriber.nick);
            checkGroup(subscriber.code);
            subscribers.splice(indexToDelete, 1);
        }
    });
}, 5000);
var server = app.listen(port, function (err) {
    if (err)
        console.log(err);
    console.log("Example app listening at http://localhost:" + port);
});
server.on('upgrade', function (request, socket, head) {
    wsServer.handleUpgrade(request, socket, head, function (socket) {
        wsServer.emit('connection', socket, request);
    });
});
function newCode() {
    var id = crypt.randomBytes(3).toString("hex");
    return id;
}
function checkGroup(code) {
    var group = groups.find(function (x) { return x.code == code; });
    if (group && group.players.length == 0) {
        deleteGroup(group.code);
    }
}
function deletePlayer(code, nick) {
    var group = groups.find(function (x) { return x.code == code; });
    if (group) {
        var game = games.find(function (x) { return x.id == group.game; });
        var playerToDelete = group.players.find(function (x) { return x.name == nick; });
        var indexToDelete = group.players.indexOf(playerToDelete);
        if (indexToDelete > -1) {
            var wasAdmin = playerToDelete.isAdmin ? true : false;
            group.players.splice(indexToDelete, 1);
            if (wasAdmin && group.players.length > 0) {
                group.players[0].isAdmin = true;
                group.players[0].moves = game.adminMoves;
            }
            return true;
        }
        {
            return false;
        }
    }
    else {
        return false;
    }
}
function deleteGroup(code) {
    var group = groups.find(function (x) { return x.code == code; });
    if (group) {
        var indexToDelete = groups.indexOf(group);
        if (indexToDelete > -1) {
            groups.splice(indexToDelete, 1);
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
function getTime() {
    return Math.floor(Date.now() / 1000);
}
function solveConflicts(group, newPlayers) {
    var game = games.find(function (x) { return x.id == group.game; });
    group.players.forEach(function (player) {
        var found = false;
        newPlayers.forEach(function (newPlayer) {
            if (player.name == newPlayer.name)
                found = true;
        });
        if (!found)
            newPlayers.push(player);
    });
    var admin = newPlayers.find(function (x) { return x.isAdmin == true; });
    admin.isAdmin = false;
    admin.moves = [];
    var newAdmin = newPlayers[0];
    newAdmin.isAdmin = true;
    newAdmin.moves = game.adminMoves;
    return newPlayers;
}
function executeMove(group, player, move) {
    switch (move) {
        case 0:
            return startMove(group, player);
        case 1:
            return stopMove(group, player);
        case 2:
            return showMove(group, player);
        case 3:
            return skipMove(group, player);
        case 4:
            return swapMove(group, player);
        default:
            return false;
    }
}
function startMove(group, player) {
    var game = games.find(function (x) { return x.id == group.game; });
    if (player.isAdmin) {
        /*
        const newPlayers = [...group.players]
        const shifted = newPlayers.shift()
        newPlayers.push(shifted)
        group.players = solveConflicts(group, newPlayers);
        */
        group.status = true;
        group.cards = getShuffledSet(group.cardSet);
        group.ground = [];
        for (var i = 0; i < group.players.length; i++) {
            group.players[i].cards = [];
            if (!group.players[i].ghost) {
                for (var j = 0; j < game.handCards; j++) {
                    group.players[i].cards.push(group.cards.pop());
                }
            }
        }
        group.round += 1;
        return turnChange(group, player);
    }
    else {
        return false;
    }
}
function stopMove(group, player) {
    var game = games.find(function (x) { return x.id == group.game; });
    if (player.isAdmin) {
        group.status = false;
        group.cards = [];
        for (var i = 0; i < group.players.length; i++) {
            group.players[i].cards = [];
            group.players[i].canMove = false;
            group.players[i].moves = group.players[i].isAdmin ? game.adminMoves : [];
            group.players[i].visible = false;
            player.visible = false;
        }
        return true;
    }
    else {
        return false;
    }
}
function showMove(group, player) {
    player.visible = true;
    if (!player.isAdmin) {
        return turnChange(group, player);
    }
    else {
        return turnStop(group, player);
    }
}
function skipMove(group, player) {
    if (!player.isAdmin) {
        return turnChange(group, player);
    }
    else {
        return turnStop(group, player);
    }
}
function swapMove(group, player) {
    var game = games.find(function (x) { return x.id == group.game; });
    if (!player.isAdmin) {
        var swapMove_1 = game.playerMoves.find(function (x) { return x.id == 4; });
        var index = group.players.findIndex(function (x) { return x.name == player.name; });
        var newIndex = getNextPlayer(group, player, game.swapOffset);
        player.cards.forEach(function (card) {
            if (swapMove_1.forbiddenNextCards.includes(card)) {
                return false;
            }
        });
        var tempCards = __spreadArrays(group.players[index].cards);
        group.players[index].cards = group.players[newIndex].cards;
        group.players[newIndex].cards = tempCards;
        return turnChange(group, player);
    }
    else {
        group.group.ground.push(group.cards.pop());
        return turnStop(group, player);
    }
}
function turnChange(group, player) {
    var game = games.find(function (x) { return x.id == group.game; });
    var index = group.players.findIndex(function (x) { return x.name == player.name; });
    var newIndex = getNextPlayer(group, player);
    group.players[index].canMove = false;
    group.players[index].moves = group.players[index].isAdmin ? game.adminMoves : [];
    group.players[newIndex].canMove = true;
    game.playerMoves.forEach(function (move) {
        player.cards.array.forEach(function (card) {
            if (move.forbiddenCards.includes(card)) {
                move.disabled = true;
            }
        });
    });
    group.players[newIndex].moves = group.players[newIndex].moves.concat(game.playerMoves);
    return true;
}
function turnStop(group, player) {
    var index = group.players.findIndex(function (x) { return x.name == player.name; });
    var game = games.find(function (x) { return x.id == group.game; });
    group.players[index].canMove = false;
    group.players[index].moves = group.players[index].isAdmin ? game.adminMoves : [];
    if (game.mustShow) {
        group.players.forEach(function (x) { return x.visible = true; });
    }
    return true;
}
function getShuffledSet(cardSet) {
    var size = cardSets.find(function (x) { return x.id == cardSet; }).size;
    for (var array = [], i = 0; i < size; ++i)
        array[i] = i;
    var tmp, current, top = array.length;
    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    return array;
}
function getNextPlayer(group, player, offset) {
    if (offset === void 0) { offset = 1; }
    var index = group.players.findIndex(function (x) { return x.name == player.name; });
    var newIndex = index;
    do {
        do {
            newIndex = (newIndex + 1) % group.players.length;
        } while (group.players[newIndex].ghost);
        offset -= 1;
    } while (offset == 0);
    return newIndex;
}

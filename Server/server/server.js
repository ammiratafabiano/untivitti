//import e from "express";
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
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('/home/pi/certs/private.key', 'utf8');
var certificate = fs.readFileSync('/home/pi/certs/certificate.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var app = express();
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var port = 3000;
var sslPort = 3440;
var jsonParser = bodyParser.json();
var groups = [];
var cardSets = [
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
];
var extraCardSets = [
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
];
var games = [
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
        bet: false,
        deadMessage: 'E su purtaru... bobom, bobom!',
        adminMoves: [
            {
                name: 'Distribuisci',
                id: 0,
                disabled: false,
                icon: 'albums-outline',
                rotateIcon: true,
                side: 'top',
                status: false,
                warnings: []
            },
            {
                name: 'Ritira carte',
                id: 1,
                disabled: false,
                icon: 'download-outline',
                rotateIcon: false,
                side: 'top',
                status: true,
                warnings: [
                    {
                        type: 'NOT_FINISHED',
                        description: 'Ritirando ora invalidi la partita, clicca questo bottone solo per errori nel gioco o per consentire ad un partecipante di rientrare in partita.',
                        block: false
                    },
                    {
                        type: 'NOT_PAID',
                        description: 'Prima di ritirare le carte è necessario che tutti i giocatori paghino.',
                        block: true
                    }
                ]
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
                warnings: [],
                forbiddenCards: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38],
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
                warnings: [],
                forbiddenCards: [9, 19, 29, 39],
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
                warnings: [],
                forbiddenCards: [9, 19, 29, 39],
                forbiddenNextCards: [9, 19, 29, 39]
            },
        ]
    },
    {
        id: 1,
        name: 'Baccarà',
        handCards: 2,
        minPlayers: 3,
        maxPlayers: 200,
        clockwise: false,
        defaultBalance: 500,
        mustShow: true,
        maxValue: 13,
        fixedDealer: true,
        teams: 2,
        bet: true,
        minBet: 20,
        maxBet: 100,
        decks: 6,
        earlyShow: [8, 9],
        adminMoves: [
            {
                name: 'Distribuisci',
                id: 0,
                disabled: false,
                icon: 'albums-outline',
                rotateIcon: true,
                side: 'top',
                status: false,
                warnings: [
                    {
                        type: 'NOT_BET',
                        description: 'Prima di iniziare il turno è necessario che tutti i giocatori facciano la propria puntata.',
                        block: true
                    }
                ]
            },
            {
                name: 'Ritira carte',
                id: 1,
                disabled: false,
                icon: 'download-outline',
                rotateIcon: false,
                side: 'bottom',
                status: true,
                warnings: [
                    {
                        type: 'NOT_FINISHED',
                        description: 'Ritirando ora invalidi la partita, clicca questo bottone solo per errori nel gioco o per consentire ad un partecipante di rientrare in partita.',
                        block: false
                    },
                    {
                        type: 'NOT_PAID',
                        description: 'Prima di ritirare le carte è necessario pagare o ritirare le puntate.',
                        block: true
                    }
                ]
            },
            {
                name: 'Dai carta',
                id: 2,
                disabled: false,
                icon: 'albums-outline',
                rotateIcon: true,
                side: 'top',
                status: true,
                warnings: [
                    {
                        type: 'NOT_MOVE',
                        description: 'Non puoi dare la carta se prima i giocatori non hanno deciso se essere chiusi o aperti.',
                        block: true
                    },
                    {
                        type: 'NOT_OPEN',
                        description: 'Nessuna squadra o il banco ha le carte aperte.',
                        block: true
                    }
                ]
            }
        ],
        playerMoves: [
            {
                name: 'Chiusi',
                id: 6,
                disabled: false,
                icon: 'thumbs-up-outline',
                rotateIcon: false,
                side: 'start',
                status: true,
                warnings: [],
                forbiddenCards: [],
                forbiddenNextCards: []
            },
            {
                name: 'Aperti',
                id: 7,
                disabled: false,
                icon: 'thumbs-down-outline',
                rotateIcon: false,
                side: 'end',
                status: true,
                warnings: [],
                forbiddenCards: [],
                forbiddenNextCards: []
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
    'ionic://untivitti.it',
    'http://untivitti.it',
    'http://untivitti.it:8080',
    'http://untivitti.it:8100',
    'ionic://www.untivitti.it',
    'http://www.untivitti.it',
    'http://www.untivitti.it:8080',
    'http://www.untivitti.it:8100',
    'ionic://2.238.108.96',
    'http://2.238.108.96',
    'http://2.238.108.96:8080',
    'http://2.238.108.96:8100'
];
// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
var corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            console.log("Unknown origin ----->", origin, "<-----");
            callback(new Error('Origin not allowed by CORS'));
        }
    }
};
httpServer.listen(port, function () {
    console.log("App listening at http://localhost:" + port);
});
httpsServer.listen(sslPort, function () {
    console.log("App listening at https://localhost:" + sslPort);
});
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
        balance: req.body.balance,
        minBet: req.body.minBet,
        maxBet: req.body.maxBet,
        decks: req.body.decks,
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
                team: game.teams ? 0 : undefined,
                bet: 0
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
    if (group) {
        var cardSet = cardSets.concat(extraCardSets).find(function (x) { return x.id == group.cardSet; });
        var savedPlayer = loadState(group, nickname);
        if ((group.status != true && group.round == 0) ||
            (group.round > 0 && savedPlayer)) {
            var game = games.find(function (x) { return x.id == group.game; });
            if (getPlayersLength(group) < game.maxPlayers) {
                if (!group.players.find(function (x) { return x.name == nickname; })) {
                    var team = void 0, index = void 0;
                    if (game.teams) {
                        if (!savedPlayer) {
                            team = getNewTeam(group);
                        }
                        else {
                            team = savedPlayer.team;
                        }
                        index = getIndexByTeam(group, team);
                    }
                    var player = {
                        name: nickname,
                        isAdmin: savedPlayer && group.round == savedPlayer.round ? savedPlayer.isAdmin : false,
                        canMove: savedPlayer && group.round == savedPlayer.round ? savedPlayer.canMove : false,
                        moves: savedPlayer && group.round == savedPlayer.round ? savedPlayer.moves : [],
                        cards: savedPlayer && group.round == savedPlayer.round ? savedPlayer.cards : [],
                        visible: savedPlayer && group.round == savedPlayer.round ? savedPlayer.visible : false,
                        balance: savedPlayer ? savedPlayer.balance : group.balance,
                        haveToPay: savedPlayer ? savedPlayer.haveToPay : false,
                        haveToBePaid: savedPlayer ? savedPlayer.haveToBePaid : false,
                        ghost: savedPlayer ? savedPlayer.ghost : false,
                        isWinner: false,
                        index: game.teams ? index : savedPlayer ? savedPlayer.index : undefined,
                        team: team,
                        bet: savedPlayer ? savedPlayer.bet : 0
                    };
                    if (player.index && player.index < group.players.length) {
                        group.players.splice(player.index, 0, player);
                    }
                    else {
                        group.players.push(player);
                    }
                    if (savedPlayer && savedPlayer.isAdmin && !savedPlayer.ghost && group.round == savedPlayer.round) {
                        setAdmin(group, undefined, player);
                    }
                    else {
                        setAdmin(group);
                    }
                    var text = nickname + ' si è connesso/a';
                    var icon = 'Login';
                    sendNotification(group, text, icon);
                    response = {
                        success: true,
                        data: { group: group, cardSet: cardSet }
                    };
                }
                else {
                    response = {
                        success: false,
                        errorCode: "DUPLICATE"
                    };
                }
            }
            else {
                response = {
                    success: false,
                    errorCode: "MAX_PLAYERS"
                };
            }
        }
        else {
            response = {
                success: false,
                errorCode: "ALREADY_STARTED"
            };
        }
    }
    else {
        response = {
            success: false,
            errorCode: "GROUP_NOT_EXISTS"
        };
    }
    res.send(response);
});
app.get('/exitGroup/:nick/:code', cors(corsOptions), function (req, res) {
    var nickname = req.params['nick'];
    var code = req.params['code'];
    var response;
    var group = groups.find(function (x) { return x.code == code; });
    if (group) {
        var player = group.players.find(function (x) { return x.name == nickname; });
        if (player) {
            deletePlayer(player.uuid);
            response = {
                success: true
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
app.get('/getCardSets/:extraSet', cors(corsOptions), function (req, res) {
    var extraSetCode = req.params['extraSet'];
    var extraSetList = extraCardSets.filter(function (x) { return x.code == extraSetCode; });
    var response = {
        success: true,
        data: cardSets.concat(extraSetList)
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
    var game = games.find(function (x) { return x.id == group.game; });
    var response;
    if (group) {
        group.players = solveConflicts(group, newPlayers);
        if (game.fixedDealer && game.teams) {
            resetDealer(group);
        }
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
app.get('/updateBalance/:nick/:code/:balance', cors(corsOptions), function (req, res) {
    var nickname = req.params['nick'];
    var code = req.params['code'];
    var newBalance = parseInt(req.params['balance'], 10);
    var group = groups.find(function (x) { return x.code == code; });
    var response;
    if (group) {
        var game = games.find(function (x) { return x.id == group.game; });
        if (newBalance >= 0) {
            var player_1 = group.players.find(function (x) { return x.name == nickname; });
            if (player_1) {
                player_1.haveToPay = false;
                player_1.haveToBePaid = false;
                player_1.balance = newBalance;
                player_1.bet = 0;
                if (newBalance == 0 || (group.maxBet && newBalance < group.maxBet)) {
                    setGhost(group, player_1, true, false);
                    if (group.money) {
                        checkWinner(group);
                    }
                    if (!isFinished(group)) {
                        var text = player_1.name + ' non ha più monete!';
                        var icon = 'Money';
                        sendNotification(group, text, icon, [player_1.name]);
                        var excludeList_1 = [];
                        group.players.filter(function (x) {
                            if (x.name != player_1.name)
                                excludeList_1.push(x.name);
                        });
                        text = 'Non hai più monete!';
                        icon = 'Money';
                        sendNotification(group, text, icon, excludeList_1);
                        if (game.deadMessage) {
                            sendImpressedText(group, game.deadMessage);
                        }
                    }
                }
                response = {
                    success: true
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
                success: false,
                errorCode: "Valori ammessi tra 0 e " + group.balance
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
app.get('/setGhost/:nick/:code/:value', cors(corsOptions), function (req, res) {
    var nickname = req.params['nick'];
    var code = req.params['code'];
    var value = req.params['value'] == "true";
    var group = groups.find(function (x) { return x.code == code; });
    var response;
    if (group) {
        var player = group.players.find(function (x) { return x.name == nickname; });
        setGhost(group, player, value);
        setAdmin(group);
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
app.get('/retrieveSession/:uuid', cors(corsOptions), function (req, res) {
    var _a;
    var uuid = req.params['uuid'];
    var response;
    if (uuid) {
        var group = void 0, player = void 0, game = void 0, cardSet = void 0;
        _a = retrievePlayer(uuid), group = _a[0], player = _a[1], game = _a[2], cardSet = _a[3];
        response = {
            success: true,
            data: {
                group: group,
                player: player,
                game: game,
                cardSet: cardSet
            }
        };
    }
    else {
        response = {
            success: false
        };
    }
    res.send(response);
});
app.post('/placeBet', jsonParser, cors(corsOptions), function (req, res) {
    var nickname = req.body.nickname;
    var code = req.body.code;
    var bet = req.body.value;
    var group = groups.find(function (x) { return x.code == code; });
    var response;
    if (group) {
        var player = group.players.find(function (x) { return x.name == nickname; });
        if (player) {
            if (player.wasTie) {
                if (bet == player.bet || bet == (player.bet * 2)) {
                    player.bet = bet;
                    response = {
                        success: true
                    };
                }
                else {
                    response = {
                        success: false,
                        errorCode: "In caso di \"come\" è solo possibile raddoppiare o lasciare intatta la puntata"
                    };
                }
            }
            else {
                if (bet >= group.minBet && bet <= group.maxBet) {
                    player.bet = bet;
                    response = {
                        success: true
                    };
                }
                else {
                    response = {
                        success: false,
                        errorCode: "Valori ammessi tra " + group.minBet + " e " + group.maxBet
                    };
                }
            }
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
                var uuid_1 = uuidv4();
                socket.uuid = uuid_1;
                groups.forEach(function (group) {
                    if (group.code == msg.code) {
                        group.players.forEach(function (player) {
                            if (player.name == msg.nick) {
                                player.uuid = uuid_1;
                                player.timestamp = Date.now();
                                socket.send(JSON.stringify({ success: true, type: msg.type, uuid: uuid_1 }));
                            }
                        });
                    }
                });
                break;
            case 'move':
                groups.forEach(function (group) {
                    group.players.forEach(function (player) {
                        if (player.uuid == msg.uuid) {
                            if (executeMove(group, player, msg.move)) {
                                socket.send(JSON.stringify({ success: true, type: msg.type }));
                            }
                            else {
                                socket.send(JSON.stringify({ success: false, type: msg.type }));
                            }
                        }
                    });
                });
                break;
            case 'text':
                groups.forEach(function (group) {
                    group.players.forEach(function (player) {
                        if (player.uuid == msg.uuid) {
                            var excludeList_2 = [];
                            if (msg.isPrivate) {
                                group.players.forEach(function (otherPlayer) {
                                    if (otherPlayer.team != player.team) {
                                        excludeList_2.push(otherPlayer.name);
                                    }
                                });
                            }
                            sendImpressedText(group, msg.text, excludeList_2, msg.from);
                        }
                    });
                });
                break;
            case 'hand':
                groups.forEach(function (group) {
                    group.players.forEach(function (player) {
                        if (player.uuid == msg.uuid) {
                            var excludeList_3 = [];
                            group.players.forEach(function (x) {
                                if (x.uuid == player.uuid || x.team != player.team) {
                                    excludeList_3.push(x.name);
                                }
                            });
                            sendHandPosition(group, msg.newVw, msg.newVh, excludeList_3);
                        }
                    });
                });
            default:
                socket.send(JSON.stringify({ success: false, type: msg.type }));
        }
    });
});
setInterval(function () {
    groups.forEach(function (group) {
        var game = games.find(function (x) { return x.id == group.game; });
        if (getPlayersLength(group) < game.minPlayers && group.status) {
            resetGroup(group);
        }
        group.activePlayers = getPlayersLength(group);
        group.players.forEach(function (player) {
            saveState(group, player);
            wsServer.clients.forEach(function (ws) {
                try {
                    if (ws.uuid == player.uuid) {
                        if (ws.isAlive) {
                            player.timestamp = Date.now();
                            ws.send(JSON.stringify({ type: 'update', state: group }));
                        }
                        ws.isAlive = false;
                        ws.ping(null, false, true);
                    }
                }
                catch (error) {
                    console.log("Websocket error\n\n===>\n\n");
                    console.log(error);
                }
            });
            if (Date.now() - player.timestamp > 1000 * 120) {
                deletePlayer(player.uuid);
            }
        });
        checkGroup(group.code);
    });
}, 1000);
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
function deletePlayer(uuid) {
    groups.forEach(function (group) {
        var game = games.find(function (x) { return x.id == group.game; });
        group.players.forEach(function (player, i) {
            if (player.uuid == uuid) {
                var text = player.name + ' si è disconnesso/a';
                var icon = 'Logout';
                sendNotification(group, text, icon);
                if (player.isAdmin) {
                    setAdmin(group, true);
                }
                group.players.splice(i, 1);
                if (group.status && group.ground.length == 0 && !player.ghost && getPlayersLength(group) > 0 && !(game.teams && game.fixedDealer)) {
                    resetGroup(group);
                    group.round -= 1;
                    var text_1 = 'Partita interrotta';
                    var icon_1 = 'Pause';
                    sendNotification(group, text_1, icon_1);
                }
                logoutClient(uuid);
            }
        });
    });
}
function retrievePlayer(uuid) {
    var retrievedGroup, retrievedPlayer, retrievedGame, retrieveCardSet;
    groups.forEach(function (group) {
        group.players.forEach(function (player) {
            if (player.uuid == uuid) {
                retrievedGroup = group;
                retrievedPlayer = player;
                retrievedGame = games.find(function (x) { return x.id == retrievedGroup.game; });
                retrieveCardSet = cardSets.concat(extraCardSets).find(function (x) { return x.id == retrievedGroup.cardSet; });
            }
        });
    });
    return [retrievedGroup, retrievedPlayer, retrievedGame, retrieveCardSet];
}
function logoutClient(uuid) {
    wsServer.clients.forEach(function (ws) {
        if (ws.uuid == uuid) {
            ws.terminate();
        }
    });
}
function deleteGroup(code) {
    var group = groups.find(function (x) { return x.code == code; });
    if (group) {
        var indexToDelete = groups.indexOf(group);
        if (indexToDelete > -1) {
            groups.splice(indexToDelete, 1);
        }
    }
}
function getTime() {
    return Math.floor(Date.now() / 1000);
}
function solveConflicts(group, newPlayers) {
    group.players.forEach(function (player) {
        var found = false;
        newPlayers.forEach(function (newPlayer) {
            if (player.name == newPlayer.name) {
                found = true;
            }
        });
        if (!found) {
            newPlayers.push(player);
        }
    });
    return newPlayers;
}
function executeMove(group, player, move) {
    player.lastMove = move;
    switch (move) {
        case 0:
            return startMove(group, player);
        case 1:
            return stopMove(group, player);
        case 2:
            return cardMove(group, player);
        case 3:
            return showMove(group, player);
        case 4:
            return skipMove(group, player);
        case 5:
            return swapMove(group, player);
        case 6:
            return voteMove(group, player, false);
        case 7:
            return voteMove(group, player, true);
        default:
            return false;
    }
}
function startMove(group, player) {
    var game = games.find(function (x) { return x.id == group.game; });
    if (player.isAdmin) {
        if (game.fixedDealer && game.teams) {
            setHand(group);
            group.status = true;
            if (group.cards.length == 0) {
                group.cards = getShuffledSet(group.cardSet, group.decks);
            }
            group.ground = [];
            for (var j = 0; j < game.handCards; j++) {
                var _loop_1 = function (i) {
                    var newCard = group.cards.pop();
                    checkEndCards(group);
                    group.players.forEach(function (player) {
                        if (player.team == i) {
                            var tempCards = __spreadArrays(player.cards);
                            tempCards.push(newCard);
                            player.cards = tempCards;
                        }
                    });
                };
                for (var i = 0; i < game.teams + 1; i++) {
                    _loop_1(i);
                }
            }
        }
        else {
            group.status = true;
            group.cards = getShuffledSet(group.cardSet);
            group.ground = [];
            for (var i = 0; i < group.players.length; i++) {
                group.players[i].cards = [];
                group.players[i].isWinner = false;
                if (!group.players[i].ghost) {
                    for (var j = 0; j < game.handCards; j++) {
                        group.players[i].cards.push(group.cards.pop());
                    }
                }
            }
        }
        group.round += 1;
        var text = player.name + ' ha distribuito le carte';
        var icon = 'Start';
        sendNotification(group, text, icon);
        return turnChange(group, player);
    }
    else {
        return false;
    }
}
function stopMove(group, player) {
    var game = games.find(function (x) { return x.id == group.game; });
    if (player.isAdmin) {
        var isFinished_1 = group.players.findIndex(function (x) { return x.canMove; }) == -1;
        if (isFinished_1) {
            passMove(group, player);
        }
        else {
            resetGroup(group);
            group.round -= 1;
            var text = player.name + ' ha ritirato le carte';
            var icon = 'Pause';
            sendNotification(group, text, icon);
        }
        return true;
    }
    else {
        return false;
    }
}
function cardMove(group, player) {
    var game = games.find(function (x) { return x.id == group.game; });
    var vote = checkVote(group, 0);
    if (vote != undefined) {
        var teamPlayer = group.players.find(function (x) { return x.team == 0; });
        var newCards_1 = teamPlayer ? __spreadArrays(teamPlayer.cards) : [];
        var newCard = group.cards.pop();
        checkEndCards(group);
        newCards_1.push(newCard);
        var excludeList_4 = [];
        group.players.forEach(function (x) {
            if (x.team == 0 && !x.ghost) {
                x.canMove = false;
                x.cards = newCards_1;
            }
            else {
                excludeList_4.push(x.name);
            }
        });
        computeLosers(group);
    }
    else {
        var _loop_2 = function (i) {
            var vote_1 = checkVote(group, i);
            if (vote_1 != undefined) {
                if (vote_1 == true) {
                    var teamPlayer = group.players.find(function (x) { return x.team == i; });
                    var newCards_2 = teamPlayer ? __spreadArrays(teamPlayer.cards) : [];
                    var newCard = group.cards.pop();
                    checkEndCards(group);
                    newCards_2.push(newCard);
                    var excludeList_5 = [];
                    group.players.forEach(function (x) {
                        if (x.team == i && !x.ghost) {
                            x.cards = newCards_2;
                        }
                        else {
                            excludeList_5.push(x.name);
                        }
                    });
                }
            }
        };
        for (var i = 1; i < game.teams + 1; i++) {
            _loop_2(i);
        }
        group.players.forEach(function (x) {
            if (x.team == 0 && !x.ghost) {
                x.moves = getAdminMoves(group).concat(getPlayerMoves(group));
            }
        });
    }
}
function showMove(group, player) {
    player.visible = true;
    var text = player.name + ' ha il cucù!';
    var icon = 'Blocked';
    sendNotification(group, text, icon, [player.name]);
    if (!player.isAdmin) {
        return turnChange(group, player);
    }
    else {
        turnStop(group, player);
    }
}
function skipMove(group, player) {
    var text = player.name + ' si è stato/a';
    var icon = 'Ok';
    sendNotification(group, text, icon, [player.name]);
    if (!player.isAdmin) {
        return turnChange(group, player);
    }
    else {
        return turnStop(group, player);
    }
}
function swapMove(group, player) {
    var swapMove = getPlayerMoves(group).find(function (x) { return x.id == 5; });
    if (!player.isAdmin) {
        var newPlayer = getNextPlayer(group, player);
        var canSwap_1 = true;
        newPlayer.cards.forEach(function (card) {
            if (swapMove.forbiddenNextCards.includes(card)) {
                canSwap_1 = false;
            }
        });
        var text = player.name + ' prova a cambiare con ' + newPlayer.name;
        var icon = 'Swap';
        sendNotification(group, text, icon, [player.name]);
        if (canSwap_1) {
            var tempCards = __spreadArrays(player.cards);
            player.cards = newPlayer.cards;
            newPlayer.cards = tempCards;
        }
        return turnChange(group, player);
    }
    else {
        var text = player.name + ' prova a pescare dal mazzo';
        var icon = 'Swap';
        sendNotification(group, text, icon, [player.name]);
        var newCard = group.cards.pop();
        group.ground.push(newCard);
        if (swapMove.forbiddenNextCards.includes(newCard)) {
            var text_2 = 'Cucù!';
            var icon_2 = 'Blocked';
            sendNotification(group, text_2, icon_2);
        }
        return turnStop(group, player);
    }
}
function passMove(group, player) {
    var game = games.find(function (x) { return x.id == group.game; });
    if (player.isAdmin) {
        resetGroup(group);
        if (!game.fixedDealer) {
            var text = player.name + ' passa il mazzo';
            var icon = 'Admin';
            sendNotification(group, text, icon, [player.name]);
            setAdmin(group, true);
        }
        return true;
    }
    else {
        return false;
    }
}
function voteMove(group, player, vote) {
    var game = games.find(function (x) { return x.id == group.game; });
    player.vote = vote;
    player.moves = player.isAdmin ? getAdminMoves(group) : [];
    unsetHand(group, undefined, player.name);
    if (player.team == 0) {
        if (checkEarlyShow(group, player.team)) {
            var tot = computePoints(group, player.cards);
            sendImpressedText(group, 'Il banco dichiara ' + tot);
            computeLosers(group);
        }
        else {
            var vote_2 = checkVote(group, 0);
            if (vote_2 != undefined) {
                if (vote_2 == true) {
                    group.players.forEach(function (x) {
                        x.moves = x.isAdmin ? getAdminMoves(group) : [];
                    });
                    var text = 'Il banco è aperto';
                    var icon = 'No';
                    sendNotification(group, text, icon);
                }
                else {
                    group.players.forEach(function (x) {
                        x.canMove = false;
                        x.moves = x.isAdmin ? getAdminMoves(group) : [];
                    });
                    var text = 'Il banco è chiuso';
                    var icon = 'Ok';
                    sendNotification(group, text, icon);
                    computeLosers(group);
                }
            }
        }
    }
    else {
        if (checkEarlyShow(group, player.team)) {
            group.players.forEach(function (x) {
                if (x.team == player.team) {
                    x.canMove = false;
                    x.moves = [];
                    x.visible = true;
                    x.vote = false;
                }
            });
            var tot = computePoints(group, player.cards);
            sendImpressedText(group, 'La squadra ' + player.team + ' dichiara ' + tot);
        }
        else {
            player.canMove = false;
            var vote_3 = checkVote(group, player.team);
            if (vote_3 != undefined) {
                if (vote_3 == true) {
                    var text = 'La squadra ' + player.team + ' è aperta';
                    var icon = 'No';
                    sendNotification(group, text, icon);
                }
                else {
                    var text = 'La squadra ' + player.team + ' è chiusa';
                    var icon = 'Ok';
                    sendNotification(group, text, icon);
                }
            }
        }
        var allVoted = true;
        var open_1 = 0;
        var early = 0;
        for (var i = 1; i < game.teams + 1; i++) {
            if (checkEarlyShow(group, i, true)) {
                early += 1;
                continue;
            }
            var vote_4 = checkVote(group, i);
            if (vote_4 != undefined) {
                if (vote_4 == true) {
                    open_1 += 1;
                }
            }
            else {
                allVoted = false;
                break;
            }
        }
        if (early == game.teams) {
            computeLosers(group);
        }
        else if (allVoted) {
            var excludeList_6 = [];
            group.players.forEach(function (player) {
                if (player.team == 0) {
                    player.canMove = true;
                    player.visible = true;
                    if (open_1 == 0) {
                        player.moves = player.moves.concat(getPlayerMoves(group));
                    }
                }
                else {
                    excludeList_6.push(player.name);
                }
            });
            sendImpressedText(group, 'E\' il vostro turno!', excludeList_6);
        }
    }
}
function turnChange(group, player) {
    var game = games.find(function (x) { return x.id == group.game; });
    if (game.fixedDealer && game.teams) {
        var excludeList_7 = [];
        group.players.forEach(function (player) {
            if (!player.ghost) {
                if (player.team == 0) {
                    excludeList_7.push(player.name);
                    if (checkEarlyShow(group, player.team)) {
                        getPlayerMoves(group).forEach(function (move) {
                            if (move.id == 7 && checkEarlyShow(group, player.team)) {
                                player.moves.push(copyMove(move, true));
                            }
                            else {
                                player.moves.push(copyMove(move));
                            }
                        });
                    }
                }
                else {
                    player.canMove = true;
                    player.moves = [];
                    getPlayerMoves(group).forEach(function (move) {
                        if (move.id == 7 && checkEarlyShow(group, player.team)) {
                            player.moves.push(copyMove(move, true));
                        }
                        else {
                            player.moves.push(copyMove(move));
                        }
                    });
                }
            }
            else {
                excludeList_7.push(player.name);
            }
        });
        sendImpressedText(group, 'E\' il vostro turno!', excludeList_7);
    }
    else {
        var newPlayer_1 = getNextPlayer(group, player);
        player.canMove = false;
        player.moves = player.isAdmin ? getAdminMoves(group) : [];
        newPlayer_1.canMove = true;
        var excludeList_8 = [];
        group.players.filter(function (x) {
            if (x.name != newPlayer_1.name)
                excludeList_8.push(x.name);
        });
        sendImpressedText(group, 'E\' il tuo turno!', excludeList_8);
        getPlayerMoves(group).forEach(function (move) {
            newPlayer_1.cards.forEach(function (card) {
                if (move.forbiddenCards.includes(card)) {
                    newPlayer_1.moves.push(copyMove(move, true));
                }
                else {
                    newPlayer_1.moves.push(copyMove(move));
                }
            });
        });
        if (newPlayer_1.isAdmin) {
            newPlayer_1.visible = true;
            var text = 'La carta del mazziere ' + newPlayer_1.name + ' è ora visibile';
            var icon = 'Show';
            sendNotification(group, text, icon);
        }
    }
    return true;
}
function turnStop(group, player) {
    var game = games.find(function (x) { return x.id == group.game; });
    player.canMove = false;
    player.moves = player.isAdmin ? getAdminMoves(group) : [];
    if (game.mustShow) {
        group.players.forEach(function (x) { return x.visible = true; });
    }
    if (group.money) {
        computeLosers(group);
    }
    return true;
}
function getShuffledSet(cardSet, decks) {
    if (decks === void 0) { decks = 1; }
    var size = cardSets.concat(extraCardSets).find(function (x) { return x.id == cardSet; }).size;
    var array = [];
    for (var i = 0; i < decks; i++) {
        for (var j = 0; j < size; ++j)
            array.push(j);
    }
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
function getNextPlayer(group, player, next) {
    if (next === void 0) { next = true; }
    var attempts = 0;
    var newIndex = player ? group.players.findIndex(function (x) { return x.name == player.name; }) : 0;
    newIndex = next ? (newIndex + 1) % group.players.length : newIndex;
    while (group.players[newIndex].ghost && attempts < group.players.length) {
        attempts += 1;
        newIndex = (newIndex + 1) % group.players.length;
    }
    return group.players[newIndex];
}
function resetGroup(group, hard) {
    var game = games.find(function (x) { return x.id == group.game; });
    group.status = false;
    if (!game.fixedDealer) {
        group.cards = [];
        unsetHand(group);
    }
    if (hard) {
        group.round = 0;
    }
    group.ground = [];
    var _loop_3 = function (i) {
        var player = group.players[i];
        player.cards = [];
        player.canMove = false;
        player.moves = player.isAdmin ? getAdminMoves(group) : [];
        player.visible = false;
        player.lastMove = undefined;
        player.vote = undefined;
        player.haveToPay = false;
        player.haveToBePaid = false;
        var savedPlayer = group.history.find(function (x) { return x.name == player.name; });
        savedPlayer.cards = [];
        savedPlayer.canMove = false;
        savedPlayer.moves = savedPlayer.isAdmin ? getAdminMoves(group) : [];
        savedPlayer.visible = false;
        savedPlayer.lastMove = undefined;
        savedPlayer.vote = undefined;
        savedPlayer.haveToPay = false;
        savedPlayer.haveToBePaid = false;
        if (hard) {
            player.ghost = false;
            player.balance = group.balance;
            savedPlayer.ghost = false;
            savedPlayer.balance = group.balance;
        }
    };
    for (var i = 0; i < group.players.length; i++) {
        _loop_3(i);
    }
}
function sendNotification(group, text, icon, excludeList) {
    if (excludeList === void 0) { excludeList = []; }
    group.players.forEach(function (player) {
        wsServer.clients.forEach(function (ws) {
            if (ws.uuid == player.uuid && ws.isAlive && !excludeList.includes(player.name)) {
                ws.send(JSON.stringify({ type: 'message', text: text, icon: icon }));
            }
        });
    });
}
function sendImpressedText(group, text, excludeList, from) {
    if (excludeList === void 0) { excludeList = []; }
    if (from === void 0) { from = undefined; }
    group.players.forEach(function (player) {
        wsServer.clients.forEach(function (ws) {
            if (ws.uuid == player.uuid && ws.isAlive && !excludeList.includes(player.name)) {
                ws.send(JSON.stringify({ type: 'text', text: text, from: from }));
            }
        });
    });
}
function getPlayerMoves(group) {
    var game = games.find(function (x) { return x.id == group.game; });
    var moveToReturn = [];
    game.playerMoves.forEach(function (move) {
        moveToReturn.push(copyMove(move));
    });
    return moveToReturn;
}
function getAdminMoves(group) {
    var game = games.find(function (x) { return x.id == group.game; });
    var moveToReturn = [];
    game.adminMoves.forEach(function (move) {
        moveToReturn.push(copyMove(move));
    });
    return moveToReturn;
}
function copyMove(move, disabled) {
    return {
        name: move.name,
        id: move.id,
        disabled: disabled ? disabled : move.disabled,
        icon: move.icon,
        rotateIcon: move.rotateIcon,
        side: move.side,
        status: move.status,
        warnings: move.warnings,
        forbiddenCards: move.forbiddenCards,
        forbiddenNextCards: move.forbiddenNextCards
    };
}
function getPlayersLength(group) {
    var count = 0;
    group.players.forEach(function (player) {
        if (!player.ghost) {
            count += 1;
        }
    });
    return count;
}
function setAdmin(group, next, player) {
    if (next === void 0) { next = false; }
    var game = games.find(function (x) { return x.id == group.game; });
    if (game.fixedDealer && game.teams) {
        resetDealer(group);
    }
    else {
        var admin = group.players.find(function (x) { return x.isAdmin == true; });
        if (admin) {
            admin.isAdmin = false;
            admin.moves = [];
        }
        if (getPlayersLength(group) > 0) {
            var newAdmin = void 0;
            if (player) {
                newAdmin = player;
            }
            else {
                newAdmin = getNextPlayer(group, admin, next);
            }
            if (newAdmin) {
                newAdmin.isAdmin = true;
                newAdmin.moves = getAdminMoves(group);
            }
            if (!admin || admin.name != newAdmin.name) {
                var text = newAdmin.name + ' è il nuovo mazziere';
                var icon = 'Admin';
                sendNotification(group, text, icon);
            }
        }
    }
}
function setGhost(group, player, value, notification) {
    if (notification === void 0) { notification = true; }
    var game = games.find(function (x) { return x.id == group.game; });
    player.ghost = value ? true : false;
    if (player.ghost && game.fixedDealer && game.teams) {
        var currentIndex = group.players.findIndex(function (x) { return x.name == player.name; });
        var newIndex = getIndexByTeam(group, player.team);
        group.players.splice(newIndex, 0, group.players.splice(currentIndex, 1)[0]);
    }
    if (notification) {
        if (player.ghost) {
            var text = player.name + ' è ora spettatore';
            var icon = 'Watcher';
            sendNotification(group, text, icon);
        }
        else {
            var text = player.name + ' è ora giocatore';
            var icon = 'Player';
            sendNotification(group, text, icon);
        }
    }
}
function computeLosers(group) {
    var game = games.find(function (x) { return x.id == group.game; });
    if (game.fixedDealer && game.teams) {
        group.players.forEach(function (x) {
            x.visible = true;
            x.canMove = false;
            x.moves = x.isAdmin ? getAdminMoves(group) : [];
        });
        var dealer_1 = group.players.find(function (x) { return x.team == 0; });
        var _loop_4 = function (i) {
            var team = group.players.find(function (x) { return x.team == i; });
            var teamResult = computePoints(group, team.cards);
            group.players.forEach(function (player) {
                if (player.team == i) {
                    var dealerResult = computePoints(group, range(dealer_1.cards, team.cards.length));
                    if (teamResult > dealerResult) {
                        player.haveToBePaid = true;
                    }
                    else if (teamResult < dealerResult) {
                        player.haveToPay = true;
                    }
                    else {
                        player.wasTie = true;
                    }
                }
            });
        };
        for (var i = 1; i < game.teams + 1; i++) {
            _loop_4(i);
        }
    }
    else {
        var results = [];
        for (var i = 0; i < group.players.length; i++) {
            var player = group.players[i];
            if (!player.ghost) {
                if (player.isAdmin && group.ground.length != 0 && !game.playerMoves.find(function (x) { return x.id == 5; }).forbiddenCards.includes(group.ground[0])) {
                    results.push(group.ground[0] % game.maxValue);
                }
                else {
                    results.push(player.cards[0] % game.maxValue);
                }
            }
        }
        var min_1 = Math.min.apply(Math, results);
        var losers_1 = [];
        group.players.forEach(function (player) {
            if (!player.ghost) {
                var card = void 0;
                if (player.isAdmin && group.ground.length != 0 && !game.playerMoves.find(function (x) { return x.id == 5; }).forbiddenCards.includes(group.ground[0])) {
                    card = group.ground[0];
                }
                else {
                    card = player.cards[0];
                }
                if ((card % game.maxValue) == min_1) {
                    player.haveToPay = true;
                    losers_1.push(player.name);
                }
            }
        });
        if (losers_1.length > 1) {
            var tie = false;
            if (losers_1.length == getPlayersLength(group)) {
                var _loop_5 = function (i) {
                    var player = group.players.find(function (x) { return x.name == losers_1[i]; });
                    if (player.balance == 1) {
                        tie = true;
                    }
                    else {
                        tie = false;
                        return "break";
                    }
                };
                for (var i = 0; i < losers_1.length; i++) {
                    var state_1 = _loop_5(i);
                    if (state_1 === "break")
                        break;
                }
            }
            if (tie) {
                group.players.forEach(function (player) {
                    player.haveToPay = false;
                    player.ghost = false;
                    player.balance = 1;
                });
                var text = 'Pareggio! Tutti i giocatori rientrano in partita!';
                var icon = 'Players';
                sendNotification(group, text, icon);
            }
            else {
                var last = losers_1.pop();
                var people = losers_1.join(', ') + 'e ' + last;
                var text = people + ' devono pagare';
                var icon = 'Money';
                sendNotification(group, text, icon);
            }
        }
        else {
            var text = losers_1[0] + ' deve pagare';
            var icon = 'Money';
            sendNotification(group, text, icon);
        }
    }
}
function checkWinner(group) {
    if (getPlayersLength(group) <= 1) {
        var winner_1 = group.players.find(function (x) { return x.balance > 0; });
        if (winner_1 && group.round > 0) {
            resetGroup(group, true);
            winner_1.isWinner = true;
            var text = winner_1.name + ' è il vincitore della partita!';
            var icon = 'Winner';
            sendNotification(group, text, icon);
            sendImpressedText(group, winner_1.name + ' ha vinto!', [winner_1.name]);
            var excludeList_9 = [];
            group.players.filter(function (x) {
                if (x.name != winner_1.name)
                    excludeList_9.push(x.name);
            });
            sendImpressedText(group, 'Hai vinto!', excludeList_9);
        }
    }
}
function isFinished(group) {
    var winner = group.players.find(function (x) { return x.isWinner === true; });
    return winner != undefined;
}
function saveState(group, player) {
    var historyIndex = group.history.findIndex(function (x) { return x.name == player.name; });
    if (historyIndex != -1) {
        player.round = group.round;
        var index = group.players.findIndex(function (x) { return x.name == player.name; });
        player.index = index;
        group.history.splice(historyIndex, 1, Object.assign({}, player));
    }
    else {
        group.history.push(Object.assign({}, player));
    }
}
function loadState(group, nickname) {
    return group.history.find(function (x) { return x.name == nickname; });
}
function getNewTeam(group) {
    var game = games.find(function (x) { return x.id == group.game; });
    var nTeams = game.teams;
    var members = [];
    var _loop_6 = function (i) {
        var index = game.fixedDealer ? i + 1 : i;
        var players = group.players.filter(function (x) { return x.team == index; });
        members.push(players.length);
    };
    for (var i = 0; i < nTeams; i++) {
        _loop_6(i);
    }
    var min = Math.min.apply(Math, members);
    var newTeam = members.indexOf(min);
    return game.fixedDealer ? newTeam + 1 : newTeam;
}
function getIndexByTeam(group, team) {
    var last = group.players.length - 1;
    for (var i = 0; i < group.players.length; i++) {
        if (group.players[i].team == team) {
            last = i;
        }
    }
    return last + 1;
}
function resetDealer(group) {
    var list = [];
    group.players.forEach(function (player) {
        if (player.isAdmin) {
            list.push(player.name);
            player.isAdmin = false;
            player.moves = [];
        }
    });
    group.players.forEach(function (player) {
        if (player.team == 0) {
            player.isAdmin = true;
            player.moves = getAdminMoves(group);
            if (!list.includes(player.name)) {
                var text = player.name + ' è il nuovo mazziere';
                var icon = 'Admin';
                sendNotification(group, text, icon);
            }
        }
    });
}
function checkVote(group, team) {
    var openVote = 0;
    var closeVote = 0;
    var total = 0;
    group.players.forEach(function (player) {
        if (player.team == team && !player.ghost) {
            if (player.vote == true) {
                openVote += 1;
            }
            if (player.vote == false) {
                closeVote += 1;
            }
            total += 1;
        }
    });
    if ((closeVote + openVote) == total) {
        if (openVote >= (total / 2)) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return undefined;
    }
}
function computePoints(group, cards) {
    var game = games.find(function (x) { return x.id == group.game; });
    var total = 0;
    cards.forEach(function (card) {
        var tempValue = (card % game.maxValue) + 1;
        total += tempValue < 10 ? tempValue : 10;
    });
    return total % 10;
}
function checkEarlyShow(group, team, voted) {
    var game = games.find(function (x) { return x.id == group.game; });
    var player;
    if (!voted) {
        player = group.players.find(function (x) { return x.team == team && !x.ghost; });
    }
    else {
        player = group.players.find(function (x) { return x.team == team && !x.ghost && x.vote != undefined; });
    }
    if (player) {
        var tot = computePoints(group, player.cards);
        if (game.earlyShow.includes(tot)) {
            return true;
        }
    }
    return false;
}
function sendHandPosition(group, vw, vh, excludeList, direct) {
    if (excludeList === void 0) { excludeList = []; }
    group.players.forEach(function (player) {
        if (!player.ghost) {
            wsServer.clients.forEach(function (ws) {
                if (ws.uuid == player.uuid && ws.isAlive && (direct && player.name == direct || !direct && !excludeList.includes(player.name))) {
                    ws.send(JSON.stringify({ type: 'hand', newVw: vw, newVh: vh }));
                }
            });
        }
    });
}
function setHand(group, excludeList, direct) {
    sendHandPosition(group, "-10vw", "30vh", excludeList, direct);
}
function unsetHand(group, excludeList, direct) {
    sendHandPosition(group, "27vw", "-27vh", excludeList, direct);
}
function range(cards, length) {
    var list = [];
    for (var i = 0; i != Math.min(length, cards.length); i++) {
        list.push(cards[i]);
    }
    return list;
}
function checkEndCards(group) {
    if (group.cards.length == 18) {
        sendImpressedText(group, 'Il prossimo giro sarà l\'ultimo!');
    }
}

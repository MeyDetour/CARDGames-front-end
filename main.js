let globalSocket = null

// total data
const game = {
    id: 2,
    name: "poker",
    description: null,
    notes: [{
        note: 2,
        commentaire: "anfnezgkfzf"
    }],
    joueursAccueillis: 0,
    gamesEnded: 0,
    metadata: {
        "type": ["Strategy", "luckk", "smart"],
        lastEdit: "01/02/2025 12:20",
        editionHistory: [],
    },

    globalValue: {
        smallBlind: {type: "number", value: "1"},
        allPlayersHasPlayed: {type: "boolean", value: false}, // default  calculated value
        currentBet: {type: "number", value: 0}, // value of the highter mise
        startPlayer: {type: "number", value: 0}, // global value static
        state: {type: "string", value: "waiting"},
        groupPot: {
            type: "gainObject", value: {
                "gain#1": 0
            }
        },
        boardCard: {type: "cardList", value: []}, // ex : [ tas1 [x,x,x,] , tas2 [x,x,]]   ex poker : [[1],[2],[3],[4],[5]]
        winners: {type: "playerList", value: []},
        tour: {type: "number", value: 0},
    },
    globalValuesOfPlayer: {
        currentBet: {type: "number", value: 0},
        hasPlayed: {type: "boolean", value: false},
        haswin: {type: "boolean", value: false},
        attachedEventForTour: {type: "eventList", value: ["skipPlayerTour"]},
        gain: {
            type: "gainObject", value: {
                "1": 0
            }
        },
    },
    params: {
        globalGame: {
            jeuSolo: false,
            playersCanJoin: false,
            minPlayer: 2,
            maxPlayer: 5,
        },
        rendering: {
            menu: {template: 1, backgroundImage: null,},
            game: {template: 1, backgroundImage: null,}
        },
        tours: {
            activation: true,
            sens: "incrementation", // or decrementation
            startNumber: 0,

            actionOnlyAtPlayerTour: true,
            // all 10min , allPlayerPlayedAtSameTime
            endOfTour: ["allPlayersHasPlayed"], // allPlayersHasPlayed default event 301
            actions: [{
                name: "Se coucher",
                condition: [],
                return: "currentPlayer",
                withValue: [
                    // Suivre la mise
                    {
                        id: 7,
                        type: "withValueEvent",
                        player: "{currentPlayer}",
                    }
                ]
            }, {
                name: "miser",
                return: "currentPlayer",
                withValue: [
                    // Suivre la mise
                    {
                        id: 11,
                        type: "withValueEvent",
                        player: "{currentPlayer}",
                    }

                ]
            }, {
                name: "suivre",
                condition: [
                    "exp(comp({currentPlayer#currentBet};isNotEqualNumber;{currentBet})&&comp({currentPlayer#gain#1};isSuperiorNumber;calc({currentBet}-{currentPlayer#currentBet})));",
                ],
                return: "{currentPlayer}",
                withValue: [
                    // Suivre la mise
                    {
                        id: 14,
                        type: "withValueEvent",
                        player: "{currentPlayer}",
                        inputNumber: "calc({currentBet}-{currentPlayer#currentBet})"
                    }

                ]
            }, {
                name: "Check",
                condition: [
                    "comp({currentPlayer#currentBet};isEqualNumber;0)",
                ],
                return: "currentPlayer",
                withValue: [
                    // Suivre la mise
                    {
                        id: 8,
                        type: "withValueEvent",
                        player: "{currentPlayer}",
                    }

                ]
            }, {
                name: "Tapis",
                condition: [
                    "exp(comp({currentPlayer#currentBet};isNotEqualNumber;{currentBet})&&comp({currentPlayer#gain#1};isInferiorNumber;calc({currentBet}-{currentPlayer#currentBet})));",
                ],
                return: "currentPlayer",
                withValue: [
                    // Suivre la mise
                    {
                        id: 14,
                        type: "withValueEvent",
                        player: "{currentPlayer}",
                        inputNumber: "{currentPlayer#gain#1}",
                    }

                ]
            },

            ],
            actionsAtEnd: 0,

        },
        // manche
        manche: {
            actionsAtStart: [],
            actionsAtEnd: 0,
        },
        cards: {
            activeHandDeck: true, // card in player's hand
            activPersonalHandDeck: true, // deck in player's hand
            activPersonalHandDiscard: true, // discard deck in player's hand
            activeDiscardDeck: false,
            discard: {
                quantity: {
                    min: null,// calculate value
                    max: null, //calculate value
                }
            },
            pickOnDeck: {
                quantity: {
                    min: null,// calculate value
                    max: null, // calculate value
                }
            },
            activeCardAsGain: true,
            handDeck: {
                activation: true,
                visibility: "nobody"
            },
            startGame: {
                distribution: true,
                quantity: 2,
                to: "allPlayersInGame"
            },
            cardBoard: { // plateau de pile de carte

            }
        },
        gain: {
            groupPot: true,
        }
    },
    events: { //Evenements globaux qui s'applique de maniere systematique
        demon: [ // la partie se lance apres que tous les demons se soient activés si etat != start
            {
                condition: [
                    "exp(comp({tour};isEqualNumber;4)&&allPlayersHasPlayed)"
                ],
                event: [13, 15, 16, 302]
                // 13 récupération des mises
                // 15 lancer la verification des cartes
                // 16 reset global bet
                // 302 change manche
            },

            {
                condition: [
                    "exp(comp({tour};isEqualNumber;5)&&eachEndOfTour)"
                ],
                event: []
                // lancer la verification des cartes
            },


            {
                condition: [
                    ["eachStartOfTour"]
                ],
                event: [13]
                // récupérer les mises centrales
            },
            {
                condition: [
                    ["startOfGame"]
                ],
                event: [8, 4]
                // melanger les cartes
                // distribution des gains
                // distrubtion des cartes se fait au debut de la manche
            }, {
                condition: [
                    ["eachStartOfManche"]
                ],
                event: [3, 5, 6, 7, 9, 8, 10, 14]
                // 3 reset events 'coucher'
                // 5 changer le joueur de depart
                // 6 pose de la petite blinde
                // 7 pose de la grosse blinde
                // 9 rassembler les paquets
                // 8 melanger la pioche
                // 10 distribuer les cartes
                // 14 mettre le status de tous les joueurs en "non joués"
            },


            // creer automatiquement
            {
                condition: [
                    ["allPlayersHasPlayed"]
                ],
                event: [300]
            },
        ],
        events: [
            // default events
            {
                id: 300,
                name: "WIN",
                condition: [],
                event: {
                    for: ["{currentPlayer}"],
                    give: {},
                    attachedEventForTour: null,
                    action: "WIN",
                    value: null,
                }
            }, {
                id: 301,
                name: "Change tour",
                condition: [],
                event: {
                    for: null,
                    give: {},
                    attachedEventForTour: null,
                    action: "endOfTour",
                    value: null,
                }
            }, {
                id: 302,
                name: "Change manche",
                condition: [],
                event: {
                    for: null,
                    give: {},
                    attachedEventForTour: null,
                    action: "endOfManche",
                    value: null,
                }
            },


            {
                id: 3,
                name: "Faire revenir tous les joueurs dans la partie",
                condition: [],
                event: {
                    for: ["allPlayerInGame"],
                    give: {},
                    action: "removeAllAtachedEventsForTour",
                    value:
                        null,
                }
            },
            {
                id: 4,
                name: "Distribute all gains",
                condition: [""],
                boucle: "{allPlayersInGame}",
                event: {
                    // if not "from" gain are created
                    for: "{playerBoucle#gain#1}",
                    give: {
                        "{gain#1}": 6250, //jeton 1    ,   key(gain donnée):value(quantité)
                    },
                    action: null,
                    value: null,
                }
            },
            {
                id: 5,
                name: "Changer le joueur qui commence",
                condition: [],
                event: {
                    for: null,
                    give: {},
                    action: "changeStartingPlayer",
                    value: "next"
                }

            }, {
                id: 6,
                name: "Pose des petites blind ",
                condition: [],
                event: {
                    from: ["{{getPlayer(calc({startPlayer}+1))#gain#1}",],
                    for: ["{getPlayer(calc({startPlayer}+1))#currentBet"],
                    give: {
                        "{gain#1}": "{smallBlind}", //jeton 1    ,   key(gain donnée):value(quantité)
                    },
                },
                action: null,
                value: null
            }, {
                id: 7,
                name: "Pose de la grosse blind ",
                condition: [],
                event: {
                    from: ["{getPlayer(calc({startPlayer}+2))#gain#1}"],
                    for: ["{getPlayer(calc({startPlayer}+2))#currentBet"],
                    give: {
                        "{gain#1}": "calc(2*{smallBlind})", //jeton 1    ,   key(gain donnée):value(quantité)
                    },
                    action: null,
                    value: null,
                }
            }, {
                id: 8,
                name: "Melanger le jeu",
                condition: [],
                event: {
                    from: null,
                    for: "deck",
                    give: null,
                    action: "shuffle",
                    value: null
                }
            }, {
                id: 9,
                name: "Rassembler les jeux",
                condition: [],
                event: {
                    from: "discardDeck",
                    for: "deck",
                    give: {
                        "{card#type=french_standard}": "*"
                    },
                    action: null,
                    value: null
                }
            }, {
                id: 10,
                name: "Distribuer",
                condition: [],
                event: {
                    for: ["allPlayerInGame"],
                    give: {
                        "{card#type=french_standard}": {
                            "normal": 2
                        }
                    },
                    attachedEventForTour: null,
                    action: null,
                    value: null,
                }
            }, {
                id: 12,
                name: "Distribuer",
                condition: [],
                boucle: "{allPlayerInGame}",
                event: {
                    for: ["{playerBoucle}"],
                    give: {
                        "{card#french_standard}": 2
                    },
                    attachedEventForTour: null,
                    action: null,
                    value: null,
                }
            }, {
                id: 13,
                name: "Recuperer les mises",
                condition: [],
                boucle: "{allPlayerInGame}",
                event: {
                    from: ["{playerBoucle#currentBet}"], // bien supprimer les currentBet
                    for: ["{groupPot}"],
                    give: {
                        "gain#1": "{playerBoucle#currentBet}"
                    },
                    attachedEventForTour: null,
                    action: null,
                    value: null,
                }
            },
            {
                id: 14,
                name: "change play status to all player at start of game",
                condition: [""],
                boucle: "{allPlayersInGame}",
                event: {
                    for: "{playerBoucle#hasPlayed}",
                    action: "updateGlobalValue",
                    value: "false",
                }
            }, {
                id: 15,
                name: "Verification des combinaisons",
                condition: [""],
                boucle: "{allPlayerInGame}}",
                event: {
                    for: "{currentPlayer#handCardDeck#type=french_standard}",
                    action: "verificationCards",
                    return: "{winnersPlayers}",
                    withValue: [
                        {id: 6, type: "withValueEvent", inputPlayers: "{winnersPlayers}",}
                    ]
                }
            }, {
                id: 16,
                name: "Reset global bet",
                condition: [""],
                event: {
                    for: "{groupPot#gain#1}",
                    action: "updateGlobalValue",
                    value: 0
                }
            }

        ],
        withValueEvent: [ //Evenements suite a une action qui concerne un joueur specifique ou des varibales

            // combinaison poker unused
            {
                "id": 300,
                "name": "Verifier une suite",
                "condition": [],
                "boucle": "{inputCardList#type=french_standard}",
                "event": {
                    "condition": [],
                    "for": ["card"],
                    "give": {},
                    "action": "french-card-verify-straight",
                    "value": true
                }
            },
            {
                "id": 301,
                "name": "Verifier une suite royale",
                "condition": [],
                "boucle": "{inputCardList#type=french_standard}",
                "event": {
                    "condition": [],
                    "for": ["card"],
                    "give": {},
                    "action": "french-card-verify-royal-straight",
                    "value": true
                }
            },
            {
                "id": 302,
                "name": "Verifier quinte flush",
                "condition": [],
                "boucle": "{inputCardList#type=french_standard}",
                "event": {
                    "condition": [],
                    "for": ["card"],
                    "give": {},
                    "action": "french-card-verify-straight-flush",
                    "value": true
                }
            }
            , {
                "id": 303,
                "name": "Verifier carre",
                "condition": [],
                "boucle": "{inputCardList#type=french_standard}",
                "event": {
                    "condition": [],
                    "for": ["card"],
                    "give": {},
                    "action": "french-card-verify-four-of-a-kind",
                    "value": true
                }
            }
            , {
                "id": 304,
                "name": "Verifier full",
                "condition": [],
                "boucle": "{inputCardList#type=french_standard}",
                "event": {
                    "condition": [],
                    "for": ["card"],
                    "give": {},
                    "action": "french-card-verify-full-house",
                    "value": true
                }
            }
            , {
                "id": 305,
                "name": "Verifier couleur",
                "condition": [],
                "boucle": "{inputCardList#type=french_standard}",
                "event": {
                    "condition": [],
                    "for": ["card"],
                    "give": {},
                    "action": "french-card-verify-flush",
                    "value": true
                }
            }
            , {
                "id": 306,
                "name": "Verifier brelan",
                "condition": [],
                "boucle": "{inputCardList#type=french_standard}",
                "event": {
                    "condition": [],
                    "for": ["card"],
                    "give": {},
                    "action": "french-card-verify-three-of-a-kind",
                    "value": true
                }
            }
            , {
                "id": 307,
                "name": "Verifier deux paires",
                "condition": [],
                "boucle": "{inputCardList#type=french_standard}",
                "event": {
                    "condition": [],
                    "for": ["card"],
                    "give": {},
                    "action": "french-card-verify-two-pair",
                    "value": true
                }
            }
            , {
                "id": 308,
                "name": "Verifier une paire",
                "condition": [],
                "boucle": "{inputCardList#type=french_standard}",
                "event": {
                    "condition": [],
                    "for": ["card"],
                    "give": {},
                    "action": "french-card-verify-one-pair",
                    "value": true
                }
            }
            , {
                "id": 309,
                "name": "Verifier carte haute",
                "condition": [],
                "boucle": "{inputCardList#type=french_standard}",
                "event": {
                    "condition": [],
                    "for": ["card"],
                    "give": {},
                    "action": "french-card-verify-high-card",
                    "value": true
                }
            },


            {  // set player has played
                id: 1,
                name: "change status of 'hasPlayed' for one player",
                condition: [],
                boucle: null,
                event: {
                    for: ["inputTypePlayer#hasPlayed"],
                    give: {},
                    action: "updateGlobalValue",
                    value: "{inputBool}",
                },

            },

            {  // update current bet of player
                id: 2,
                name: "when player bet or follow bet ",
                condition: [],
                boucle: null,
                event: {
                    from: "{inputTypePlayer}",
                    for: "{groupPot}",
                    give: {
                        "{gain#1}": "{inputNumber}",
                    },
                    action: null,
                    value: null,
                },
            }, {  // update current bet
                id: 3,
                name: "updateGlobalBet",
                condition: [],
                boucle: null,
                event: {
                    for: "{currentBet}",   // global variable
                    action: "updateGlobalValue",
                    value: "{inputNumber}",    // "input" means variable get at call
                }


            }, {  // Change all player wich not bet to "no played"
                id: 4,
                name: "change play status to all player when player bet",
                condition: [""],
                boucle: "{allPlayersInGame}",
                event: {
                    condition: "exp(comp({playerBoucle#attachedEventForTour};notContain;value=skipPlayerTour)||comp({playerBoucle};different;{currentPlayer}))",
                    for: "{playerBoucle#hasPlayed}",
                    action: "updateGlobalValue",
                    value: "false",
                }
            }
            , {
                id: 14,
                name: "suivre une mise",
                condition: [],
                boucle: null,
                event: {
                    from: ["{currentPlayer#gain#1}"],
                    for: "{currentPlayer#currentBet}",
                    action: "updateGlobalValue",
                    value: "{inputNumber}",
                }
            },
            {
                id: 11,
                name: "Miser",
                condition: [],
                event: {
                    from: ["{currentPlayer}"],
                    action: "askPlayer",
                    requiresInput: {
                        type: "number",
                        label: "Choisissez le montant à miser",
                        min: 1,
                        max: "playerMaxGain", // calculate value
                        unit: "gain#1",
                        return: ["{currentPlayer}", "{insertedValue}"],
                        withValue: [
                            //events to do with number inserted
                            //  player give value of bet to groupPot
                            {
                                id: 2,
                                type: "withValueEvent",
                                player: "{currentPlayer}",
                                inputNumber: "calc({currentPlayer#currentBet}+{insertedValue})"
                            },


                            // change global "currentBet"
                            {
                                id: 3,
                                type: "withValueEvent",
                                player: "{currentPlayer}",
                                inputNumber: "calc({currentPlayer#currentBet}+{insertedValue})"
                            },

                            //  Player status switch to played
                            {
                                id: 1,
                                type: "withValueEvent",
                                player: "{currentPlayer}",
                                inputBool: true,
                            },

                            // Change all Other Player to "not played"
                            {
                                id: 4,
                                type: "withValueEvent",
                                player: "{currentPlayer}",
                                inputBool: true,
                            }


                        ]
                    },
                    "attachedEventForTour": null,
                    "value": null
                }
            },
            {
                id: 5,
                name: "distribution de carte dans le pot",
                condition: [""],
                boucle: null,
                event: {
                    from: "{deck}",
                    for: "{boardDeck}",
                    give: {
                        "card#type=french_stard": "exp(comp({tour};isEqualNumber;1;return;1)||comp({tour};isEqualNumber;2;return;1)||comp({tour};isEqualNumber;3;return;3))"
                    },
                    action: null,
                    value: "true",
                }
            }, {
                id: 6,
                name: "distribution des gains  ",
                condition: [""],
                boucle: "{inputPlayers}",
                event: {
                    from: "{groupPot}",
                    for: "{bouclePlayer#gain#1}",
                    give: {
                        "{gain#1}": "%"
                    },
                    action: null,
                    value: null,
                }
            },
            {
                id: 7,
                name: "Se coucher", // pas besoin de donner la mise
                // si il a miser elle est dans "current bet" et sera récupéré
                // sinon elle est dans la petite blind ou grosse blinde et deja dans "current bet" du joueur
                condition: [],
                event: {
                    for: ["{currentPlayer}"],
                    give: {},
                    attachedEventForTour: "skipPlayerTour",
                    action: null,
                    value: null,
                }
            }, {
                id: 8,
                name: "Check", // pas besoin de donner la mise
                condition: [],
                event: {
                    for: ["{currentPlayer}"],
                    give: {},
                    attachedEventForTour: null,
                    action: "skipPlayerTour",
                    value: null,
                }
            },
        ]
    },
    assets: {
        cards: [{
            id: 2,
            value: "1",
            type: "french_standard",
            addedAttributs: {
                couleur: "pique"
            }
        }, {
            id: 3,
            value: "3",
            type: "french_standard",
            addedAttributs: {
                couleur: "treffle"
            }
        }, {
            id: 4,
            value: "4",
            type: "french_standard",
            addedAttributs: {
                couleur: "coeur"
            }
        }, {
            id: 5,
            value: "5",
            type: "french_standard",
            addedAttributs: {
                couleur: "coeur"
            }
        }],

        gains: // en cas de monnai et jeton comme au poker veuillez faire un seulelement representant cette monai : ex jeton = 1piece , valeur numerique 1 , distribué x par personnes
            [{
                id: 1,
                nom: "jetons",
                value: null,
                value_numérique: 1,
                quantite: null, // in fini
            }]
        ,
        roles:
            [
                {
                    nom: "dealer",
                    attribution: "{getPlayer(calc({startPlayer}-1))}",
                }
            ],
    }
}

// data received
// une manche = une partie de mise
// Un tour  = mise stabilisé -> tous les joueurs ont joué, des que qqn remise les joueurs qui ne sont pas couché repassent en non joués
// Distribution de 2 cartes par tour à chaque -> demon
// se coucher :  atached event
// miser : event



// win
function connectSocket() {
    if (globalSocket) return;

    const socket = io('ws://localhost:8008');
    globalSocket = socket;


    socket.emit("createRoom");

}

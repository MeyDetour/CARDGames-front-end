let socket = null;

// total data
// je me suis arreter car je faisait l'event 8 , ou un joueur devait mettre dans sa mise x jeton, mais que faire si il n'en a pas assez
const gameInDB = {
  id: 2,
  name: "poker",
  description: null,
  notes: [
    {
      note: 2,
      commentaire: "anfnezgkfzf",
    },
  ],
  joueursAccueillis: 0,
  gamesEnded: 0,
  metadata: {
    type: ["Strategy", "luckk", "smart"],
    lastEdit: "01/02/2025 12:20",
    editionHistory: [],
  },

  globalValue: {
    smallBlind: { type: "number", value: 1 },
    allPlayersHasPlayed: { type: "boolean", value: false }, // default  calculated value
    currentBet: { type: "number", value: 1 }, // value of the highter mise
    state: { type: "string", value: "waitingPlayers" },
    deck: { type: "cardList", value: [3, 4] }, //card id
    discardDeck: { type: "cardList", value: [5, 2] }, // card id
    groupPot: {
      type: "gainObject",
      value: {
        gain: {
          type: "gainObject",
          value: {
            1: {
              value: 0,
            },
          },
        },
      },
    },
    gain: {
      type: "gainObject",
      value: {
        1: {
          value: 0,
        },
      },
    },
    boardCard: { type: "cardList", value: [] }, // ex : [ tas1 [x,x,x,] , tas2 [x,x,]]   ex poker : [[1],[2],[3],[4],[5]]
    winners: { type: "playerList", value: [] },
  },
  globalValuesOfPlayer: {
    currentBet: {
      type: "number",
      value: 0,
    },

    attachedEventForTour: {
      type: "array",
      value: ["skipPlayerTour"],
    },
    gain: {
      type: "object",
      value: {
        1: {
          value: 0,
        },
      },
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
      menu: {
        template: 1,
        backgroundImage: null,
      },
      game: {
        template: 1,
        backgroundImage: null,
      },
    },
    tours: {
      activation: true,
      sens: "incrementation", // or decrementation
      startNumber: 0,

      actionOnlyAtPlayerTour: true,
      // all 10min , allPlayerPlayedAtSameTime
      endOfTour: ["allPlayersHasPlayed/endOfTour"], // allPlayersHasPlayed default event 301
      actions: [
        {
          name: "Se coucher",
          condition: null,
          return: "currentPlayer",
          appearAtPlayerTurn: true,
          withValue: [
            // Suivre la mise
            {
              id: 7,
              type: "withValueEvent",
              player: "{currentPlayer}",
            },
          ],
        },
        {
          name: "miser",
          return: "currentPlayer",
          appearAtPlayerTurn: true,
          condition:
            "comp({currentPlayer#gain#1};isSuperiorNumber;{currentBet})",
          withValue: [
            // Suivre la mise
            {
              id: 11,
              player: "{currentPlayer}",
            },
          ],
        },
        {
          name: "suivre",
          appearAtPlayerTurn: true,
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
              inputNumber: "calc({currentBet}-{currentPlayer#currentBet})",
            },
          ],
        },
        {
          name: "Check",
          appearAtPlayerTurn: true,
          condition: ["comp({currentPlayer#currentBet};isEqualNumber;0)"],
          return: "currentPlayer",
          withValue: [
            // Suivre la mise
            {
              id: 8,
              type: "withValueEvent",
              player: "{currentPlayer}",
            },
          ],
        },
        {
          name: "Tapis",
          appearAtPlayerTurn: true,
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
            },
          ],
        },
      ],
      actionsAtEnd: 0,
    },
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
          min: null, // calculate value
          max: null, //calculate value
        },
      },
      pickOnDeck: {
        quantity: {
          min: null, // calculate value
          max: null, // calculate value
        },
      },
      activeCardAsGain: true,
      handDeck: {
        activation: true,
        visibility: "nobody",
      },
      cardBoard: {
        // plateau de pile de carte
      },
    },
    gain: {
      groupPot: true,
    },
  },
  events: {
    demons: [
      // la partie se lance apres que tous les demons se soient activés si etat != start
      {
        // pas besoin d'une liste de conditions , on met une comp "or" si plusieurs conditions d'exec
        condition:
          "exp(comp({tour};isEqualNumber;4)&&allPlayersHasPlayed/endOfTour)",
        events: [13, 15, 16, 302],
        // 13 récupération des mises
        // 15 lancer la verification des cartes
        // 16 reset global bet
        // 302 change manche
      },

      {
        condition: "exp(comp({tour};isEqualNumber;5)&&eachEndOfTour)",
        events: [],
        // lancer la verification des cartes
      },

      {
        condition: "eachEndOfTour",
        events: [13],
        // récupérer les mises centrales
      },
      {
        condition: "startOfGame",
        events: [8, 4],
        // melanger les cartes
        // distribution des gains
        // distrubtion des cartes se fait au debut de la manche
      },
      {
        condition: "eachStartOfManche",
        events: [3, 5, 6, 7, 9, 8, 10, 14],
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
        condition: "allPlayersHasPlayed/endOfTour", // ALSO END OF TOUR
        events: [300],
      },
    ],
    events: [
      // default events
      {
        id: 300,
        name: "WIN",
        condition: null,
        event: {
          for: ["{currentPlayer}"],
          give: {},
          attachedEventForTour: null,
          action: "WIN",
          value: null,
        },
      },
      {
        id: 301,
        name: "Change tour",
        loadMessage: "Changement de tour...",
        condition: null,
        event: {
          for: null,
          give: {},
          attachedEventForTour: null,
          action: "endOfTour",
          value: null,
        },
      },
      {
        id: 302,
        name: "Change manche",
        loadMessage: "Changement de manche...",
        condition: null,
        event: {
          for: null,
          give: {},
          attachedEventForTour: null,
          action: "endOfManche",
          value: null,
        },
      },

      {
        id: 3,
        name: "Faire revenir tous les joueurs dans la partie",
        condition: null,

        loadMessage: "Réintégration des joueurs...",
        boucle: "{allPlayersInGame}",
        event: {
          for: "{playerBoucle}",
          give: {},
          action: "removeAllAtachedEventsForTour",
          value: null,
        },
      },
      {
        id: 4,
        name: "Distribute all gains",
        condition: null,
        boucle: "{allPlayersInGame}",

        loadMessage: "Distribution des gains...",
        event: {
          // if not "from" gain are created
          for: "{playerBoucle}",
          give: {
            "{gain#1}": 6250, //jeton 1    ,   key(gain donnée):value(quantité)
          },
          action: null,
          value: null,
        },
      },
      {
        id: 5,
        name: "Changer le joueur qui commence",
        loadMessage: "Changement du joueur de départ...",
        condition: null,
        event: {
          for: null,
          give: null,
          action: "changeStartingPlayer",
          value: "next",
        },
      },
      {
        id: 6,
        name: "Pose des petites blind ",
        loadMessage: "Pose de la petite blinde...",
        condition: null,
        event: {
          from: "getPlayer(calc({startPlayer#position}+1))",
          for: "{getPlayer(calc({startPlayer#position}+1))#currentBet}",
          give: {
            "{gain#1}": "{smallBlind}", //jeton 1    ,   key(gain donnée):value(quantité)
          },
        },
        action: null,
        value: null,
      },
      {
        id: 7,
        name: "Pose de la grosse blind ",
        loadMessage: "Pose de la grosse blinde...",
        condition: null,
        event: {
          from: "getPlayer(calc({startPlayer#position}+2))",
          for: "{getPlayer(calc({startPlayer#position}+2))#currentBet}",
          give: {
            "{gain#1}": "calc(2*{smallBlind})", //jeton 1    ,   key(gain donnée):value(quantité)
          },
          action: null,
          value: null,
          params: {
            ifFromStackDoesNotHaveRessource: {
              giveAllRessourcePossible: false,
              doEvents: [],
            },
          },
        },
      },
      {
        id: 8,
        name: "Melanger le jeu",
        loadMessage: "Mélange du jeu...",
        condition: null,
        event: {
          from: null,
          for: "{deck}",
          give: null,
          action: "shuffle",
          value: null,
        },
      },
      {
        id: 9,
        name: "Rassembler les jeux",
        loadMessage: null,
        condition: null,
        event: {
          from: "{discardDeck}",
          for: "{deck}",
          give: {
            "{cards}": "*",
          },
          action: null,
          value: null,
        },
      },
      {
        id: 10,
        name: "Distribuer",
        condition: null,
        boucle: "{allPlayersInGame}",
        loadMessage: "Distribution des cartes aux joueurs...",
        event: {
          for: "{playerBoucle#handDeck}",
          give: {
            "{cards}": 2,
          },
          attachedEventForTour: null,
          action: null,
          value: null,
        },
      },
      {
        id: 13,
        name: "Recuperer les mises",
        loadMessage: "Récupération de la mise...",
        condition: null,
        boucle: "{allPlayersInGame}",
        event: {
          from: ["{playerBoucle#currentBet}"], // bien supprimer les currentBet
          for: ["{groupPot}"],
          give: {
            "gain#1": "{playerBoucle#currentBet}",
          },
          attachedEventForTour: null,
          action: null,
          value: null,
        },
      },
      {
        id: 14,
        name: "change play status to all player at start of game",
        loadMessage: "Réintégration des joueurs...",
        condition: null,
        boucle: "{allPlayersInGame}",
        event: {
          for: "{playerBoucle#hasPlayed}",
          action: "updateGlobalValue",
          value: "false",
        },
      },
      {
        id: 15,
        name: "Verification des combinaisons",
        condition: null,
        boucle: "{allPlayersInGame}",
        loadMessage: "Analyse des cartes...",
        event: {
          for: "{currentPlayer#handCardDeck#type=french_standard}",
          action: "verificationCards",
          return: "{winnersPlayers}",
          withValue: [{ id: 6, inputPlayers: "{winnersPlayers}" }],
        },
      },
      {
        id: 16,
        name: "Reset global bet",
        loadMessage: "Réinitialisation de la mise globale...",
        condition: null,
        event: {
          for: "{groupPot#gain#1}",
          action: "updateGlobalValue",
          value: 0,
        },
      },
    ],
    withValueEvent: [
      //Evenements suite a une action qui concerne un joueur specifique ou des varibales

      // combinaison poker unused
      {
        id: 300,
        name: "Verifier une suite",
        condition: null,
        boucle: "{inputCardList#type=french_standard}",
        event: {
          condition: null,
          for: ["card"],
          give: {},
          action: "french-card-verify-straight",
          value: true,
        },
      },
      {
        id: 301,
        name: "Verifier une suite royale",
        condition: null,
        boucle: "{inputCardList#type=french_standard}",
        event: {
          condition: null,
          for: ["card"],
          give: {},
          action: "french-card-verify-royal-straight",
          value: true,
        },
      },
      {
        id: 302,
        name: "Verifier quinte flush",
        condition: null,
        boucle: "{inputCardList#type=french_standard}",
        event: {
          condition: null,
          for: ["card"],
          give: {},
          action: "french-card-verify-straight-flush",
          value: true,
        },
      },
      {
        id: 303,
        name: "Verifier carre",
        condition: null,
        boucle: "{inputCardList#type=french_standard}",
        event: {
          condition: null,
          for: ["card"],
          give: {},
          action: "french-card-verify-four-of-a-kind",
          value: true,
        },
      },
      {
        id: 304,
        name: "Verifier full",
        condition: null,
        boucle: "{inputCardList#type=french_standard}",
        event: {
          condition: null,
          for: ["card"],
          give: {},
          action: "french-card-verify-full-house",
          value: true,
        },
      },
      {
        id: 305,
        name: "Verifier couleur",
        condition: null,
        boucle: "{inputCardList#type=french_standard}",
        event: {
          condition: null,
          for: ["card"],
          give: {},
          action: "french-card-verify-flush",
          value: true,
        },
      },
      {
        id: 306,
        name: "Verifier brelan",
        condition: null,
        boucle: "{inputCardList#type=french_standard}",
        event: {
          condition: null,
          for: ["card"],
          give: {},
          action: "french-card-verify-three-of-a-kind",
          value: true,
        },
      },
      {
        id: 307,
        name: "Verifier deux paires",
        condition: null,
        boucle: "{inputCardList#type=french_standard}",
        event: {
          condition: null,
          for: ["card"],
          give: {},
          action: "french-card-verify-two-pair",
          value: true,
        },
      },
      {
        id: 308,
        name: "Verifier une paire",
        condition: null,
        boucle: "{inputCardList#type=french_standard}",
        event: {
          condition: null,
          for: ["card"],
          give: {},
          action: "french-card-verify-one-pair",
          value: true,
        },
      },
      {
        id: 309,
        name: "Verifier carte haute",
        condition: null,
        boucle: "{inputCardList#type=french_standard}",
        event: {
          condition: null,
          for: ["card"],
          give: {},
          action: "french-card-verify-high-card",
          value: true,
        },
      },

      {
        // set player has played
        id: 1,
        name: "change status of 'hasPlayed' for one player",
        condition: null,
        boucle: null,
        event: {
          for: "{player#hasPlayed}",
          give: {},
          action: "updateGlobalValue",
          value: "{inputBool}",
        },
      },

      {
        // update current bet of player
        id: 2,
        name: "when player bet or follow bet ",
        condition: null,
        boucle: null,
        event: {
          from: "{player}",
          for: "{player#currentBet}",
          give: {
            "{gain#1}": "{inputNumber}",
          },
          action: null,
          value: null,
        },
      },
      {
        // update current bet
        id: 3,
        name: "updateGlobalBet",
        condition: null,
        boucle: null,
        event: {
          for: "{currentBet}", // global variable
          action: "updateGlobalValue",
          value: "{inputNumber}", // "input" means variable get at call
        },
      },
      {
        // Change all player wich not bet to "no played"
        id: 4,
        name: "change play status to all player when player bet",
        condition: [""],
        boucle: "{allPlayersInGame}",
        event: {
          condition:
            "exp(comp({playerBoucle#attachedEventForTour};notContain;<<skipPlayerTour>>)||comp({playerBoucle};differentPlayer;{currentPlayer}))",
          for: "{playerBoucle#hasPlayed}",
          action: "updateGlobalValue",
          value: "false",
        },
      },
      {
        id: 14,
        name: "suivre une mise",
        condition: null,
        boucle: null,
        event: {
          from: ["{player#gain#1}"],
          for: "{playerr#currentBet}",
          action: "updateGlobalValue",
          value: "{inputNumber}",
        },
      },
      {
        id: 11,
        name: "Miser",
        condition: null,
        event: {
          for: "{currentPlayer}",
          action: "askPlayer",
          requiresInput: {
            type: "number",
            label: "Choisissez le montant à miser",
            min: 1,
            max: "playerMaxGain", // calculate value
            unit: "gain#1",
            return: ["{currentPlayer}", "{insertedValue}"],
          },
          withValue: [
            //events to do with number inserted
            //  player give value of bet to his current bet
            {
              id: 2,
              inputNumber: "{insertedValue}",
             
            },

            // change global "currentBet"
            {
              id: 3,
              inputNumber: "{currentPlayer#currentBet}",
            },

            //  Player status switch to played
            {
              id: 1,
              inputBool: true,
            },

            // Change all Other Player to "not played"
            {
              id: 4,
              inputBool: true,
            },
          ],

          attachedEventForTour: null,
          value: null,
        },
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
            "card#comp({currentCard#type};isEqualString;<<french_standard>>)":
              "exp(comp({tour};isEqualNumber;1;return;1)||comp({tour};isEqualNumber;2;return;1)||comp({tour};isEqualNumber;3;return;3))",
          },
          action: null,
          value: "true",
        },
      },
      {
        id: 6,
        name: "distribution des gains  ",
        condition: [""],
        boucle: "{inputPlayers}",
        event: {
          from: "{groupPot}",
          for: "{bouclePlayer#gain#1}",
          give: {
            "{gain#1}": "%",
          },
          action: null,
          value: null,
        },
      },
      {
        id: 7,
        name: "Se coucher", // pas besoin de donner la mise
        // si il a miser elle est dans "current bet" et sera récupéré
        // sinon elle est dans la petite blind ou grosse blinde et deja dans "current bet" du joueur
        condition: null,
        event: {
          for: "{currentPlayer}",
          give: {},
          action: "skipPlayerTour",
          value: null,
        },
      },
      {
        id: 8,
        name: "Check", // pas besoin de donner la mise
        condition: null,
        event: {
          for: ["{currentPlayer}"],
          give: {},
          attachedEventForTour: null,
          action: "skipPlayerTour",
          value: null,
        },
      },
    ],
  },
  assets: {
    cards: {
      2: {
        id: 2,
        value: 1,
        type: "french_standard",
        addedAttributs: {
          couleur: "pique",
        },
      },
      3: {
        id: 3,
        value: 3,
        type: "french_standard",
        addedAttributs: {
          couleur: "treffle",
        },
      },
      4: {
        id: 4,
        value: 4,
        type: "french_standard",
        addedAttributs: {
          couleur: "coeur",
        },
      },
      5: {
        id: 5,
        value: 5,
        type: "french_standard",
        addedAttributs: {
          couleur: "coeur",
        },
      },
    },
    gains: [
      {
        id: 1,
        nom: "jetons",
        value: null,
        value_numérique: 1,
        quantite: null, // in fini
      },
    ],
    roles: [
      {
        nom: "dealer",
        attribution: "{startPlayer}",
      },
    ],
  },
};

// data received
// une manche = une partie de mise
// Un tour  = mise stabilisé -> tous les joueurs ont joué, des que qqn remise les joueurs qui ne sont pas couché repassent en non joués
// Distribution de 2 cartes par tour à chaque -> demon
// se coucher :  atached event
// miser : event
const messages = [];

async function getGame() {
  await fetch("../game.json")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

// win
async function connectSocket() {
  if (socket) return;
  socket = io("ws://localhost:8008");
  let playerId = null;

  let pseudo = "mey";

  socket.emit("createRoom", { gameInDB, pseudo });

  socket.on("playerDataId", (id) => {
    playerId = id;
  });

  socket.on("roomCreated", (room) => {
    let roomId = room.roomId;
    console.log(room, roomId);
    connectSocket2();
    changeGameStat(room);
    document.querySelector("#startGame").addEventListener("click", (e) => {
      socket.emit("startGame", { roomId });
    });
  });

  socket.on("gameChanges", (room) => {
    console.log(room);
    changeGamePlayerVariable(1, playerId, room);
    changeGameStat(room);
  });
  socket.on("message", (message) => {
    messages.push(message);
    writeMessage("#message", message);
  });

  socket.on("error", (err) => {
    console.log(err);
    writeMessage("error", err);
  });
  socket.on("askPlayer", ({ event, params, roomId }) => {
    console.log("event :>> ", event);
    console.log("param :>> ", params);

    function sendValueToServer(value) {
      const obj = value;
      socket.emit("playerInsertedValue", { roomId, event, obj, params });
    }
    widget(
      event.event.requiresInput.label,
      event.event.requiresInput.description,
      "Valider",
      event.event.requiresInput.type,
      sendValueToServer,
      (min = event.event.requiresInput.min),
      (max = event.event.requiresInput.max)
    );
  });
}

let socket2 = null;

function connectSocket2() {
  if (socket2) return;
  socket2 = io("ws://localhost:8008");

  let playerId = null;
  socket2.on("playerDataId", (id) => {
    playerId = id;
  });

  let pseudo = "mey2";
  let roomId = "a4a4a4a4";
  socket2.emit("joinRoom", { roomId, pseudo });
  socket2.on("roomJoined", (room) => {});
  socket2.on("gameChanges", (room) => {
    changeGamePlayerVariable(2, playerId, room);
  });
  socket2.on("error", (err) => {
    console.log(err);
    writeMessage("error", err);
  });

  socket.on("askPlayer", ({ event, params, roomId }) => {
    console.log("event :>> ", event);
    console.log("param :>> ", params);

    function sendValueToServer(value) {
      const obj = value;
      socket.emit("playerInsertedValue", { roomId, event, obj, params });
    }
    widget(
      event.event.requiresInput.label,
      event.event.requiresInput.description,
      "Valider",
      event.event.requiresInput.type,
      sendValueToServer,
      (min = event.event.requiresInput.min),
      (max = event.event.requiresInput.max)
    );
  });
}

function writeMessage(type, m) {
  let div = document.querySelector("#message");
  if (div) {
    div.innerHTML += `
    <span ${type == "error" ? "style='color:red'" : ""}>
    ${m}
    </span>
    `;
  } else {
    console.warn("found #" + id);
  }
}

function getPlayer(players, id) {
  return players.filter((p) => p.id == id)[0];
}

function getCardObjectFromId(cardId, gameData) {
  return gameData.roomInDb.assets.cards[
    Object.keys(gameData.roomInDb.assets.cards).filter((k) => k == cardId)[0]
  ];
}
function cardToStr(cardObject) {
  return `${cardObject.value}`;
}
function getGainName(gainId, gameData) {
  return gameData.roomInDb.assets.gains.filter((e) => e.id == gainId)[0].nom;
}

function changeGamePlayerVariable(id, playerId, room) {
  let div = document.querySelector(".p" + id);
  if (div) {
    let player = getPlayer(room.data.players, playerId);
    if (!player) div.innerHTML = ` <span>Player not found </span> `;
    div.innerHTML = `

        <span>ID : ${playerId}</span>


        <span>Position : ${player.position}</span>
        <span>A jouer ? : ${player.hasPlayed.value}</span>
        <span>A Gagné ? : ${player.haswin.value}</span>
        <span>Hand deck : (${
          player.handDeck.value.length
        }) : ${player.handDeck.value.map((id) =>
      cardToStr(getCardObjectFromId(id, room))
    )}</span>
        <span>personalHandDeck : ${player.personalHandDeck.value.length}</span>
        <span>personalHandDiscard : ${
          player.personalHandDiscard.value.length
        }</span>

        <!-- Roles -->
        <span>Roles  : ${player.roles.value.map((r) => `${r.nom}`)}</span>/home/mey/WebstormProjects/CARDGames-front-end/p1/index.html
        
        <!-- Actions -->
        <span>Actions  : ${player.actions.value.map(
          (a) =>
            `<button onclick="changeTour('${playerId}','${room.roomId}','${a.name}')">${a.name}</button>`
        )}</span>


        <!-- Gain -->
        <span>Gain  : ${Object.keys(player.gain.value).map(
          (k) => `${getGainName(k, room)} : ${player.gain.value[k].value}`
        )}</span>

        
        <!-- Other dynamique values -->
        ${Object.keys(room.roomInDb.globalValuesOfPlayer).map(
          (k) =>
            `<span>${k} :  ${
              player[k].value ? player[k].value : player[k]
            }</span>`
        )}

        <!-- Turn -->
        ${
          player.position == room.data.currentPlayerPosition.value
            ? `<span>C'est ton tour !!!</span>`
            : ""
        }   

    `;
  }
  let divMessages = document.querySelector("#message");
  if (divMessages) {
    divMessages.innerHTML = `
    ${room.data.messages.map((m) => `<span>${m}</span>`)}
     
    `;
  } else {
    console.warn("found #" + id);
  }
}
function changeTour(playerId, roomId, action) {
  console.log("change tour");
  socket.emit("changeCurrentPlayer", { playerId, roomId, action });
}
function changeGameStat(room) {
  let div = document.querySelector(".gameStat");
  if (div) {
    div.innerHTML = `
        <span>ETAT  : ${room.data.state.value.toUpperCase()}</span>    
        <span>currentPlayerPosition : ${
          room.data.currentPlayerPosition.value
        }</span>    
        <span>Tour : ${room.data.tour}</span>    
        <span>Manche : ${room.data.manche}</span>    
        <span>joueurs : ${room.data.players.length}</span>    
             ${Object.keys(room.roomInDb.globalValue).map(
               (k) =>
                 `<span>${k} :  ${
                   room.data[k].value
                     ? typeof room.data[k].value == "object"
                       ? JSON.stringify(room.data[k].value)
                       : room.data[k].value
                     : room.data[k]
                 }</span>`
             )}
      
        `;
  }
}
function widget(title, message, buttonText, type, buttonAction, params = {}) {
  if (!params) {
    params = {};
  }
  let widget = document.querySelector(".widget");
  widget.innerHTML = `<div class="container">
            <h1></h1>
            <p></p>
            <div class="input-container"> 
            </div>
            <button></button>
        </div>`;

  let h1 = widget.querySelector("h1");
  let p = widget.querySelector("p");
  let inputContainer = widget.querySelector(".input-container");
  let button = widget.querySelector("button");
  if (!widget) {
    console.warn("widget not found");
    return;
  }
  if (!inputContainer) {
    console.warn("input container not found");
    return;
  }
  if (!h1) {
    console.warn("h1 container not found");
    return;
  }
  if (!p) {
    console.warn("p container not found");
    return;
  }
  if (!button) {
    console.warn("button container not found");
    return;
  }
  widget.style.display = "flex";
  let newInput = document.createElement("input");

  if (type == "number") {
    newInput.type = "number";
    newInput.name;
    if (params.min !== undefined) newInput.min = params.min;
    if (params.max !== undefined) newInput.max = params.max;
    inputContainer.appendChild(newInput);
  }
  h1.innerHTML = title;
  p.innerHTML = message ? message : "";
  button.innerHTML = buttonText;
  button.onclick = () => {
    if (newInput.value != null) {
      console.log("input.value :>> ", newInput.value);
      buttonAction({ insertedValue: newInput.value });
      widget.style.display = "none";
    }
  };
}

connectSocket();

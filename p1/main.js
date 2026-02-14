let socket = null;

// total data
// je me suis arreter car je faisait l'event 8 , ou un joueur devait mettre dans sa mise x jeton, mais que faire si il n'en a pas assez
const gameInDB = {
  id: 2,
  name: "poker",
  description: null,
  isPublic: true,
  notes: [
    {
      note: 2,
      commentaire: "anfnezgkfzf",
    },
  ],
  joueursAccueillis: 0,
  gamesEnded: 0,
  types: ["Strategy", "luckk", "smart"],
 
  editionHistory: [],

  globalValue: {
    smallBlind: { type: "number", value: 1 },
    allPlayersHasPlayed: { type: "boolean", value: false }, // default  calculated value
    currentBet: { type: "number", value: 0 }, // value of the highter mise
    state: { type: "string", value: "waitingPlayers" },

    deck: {
      type: "cardList",
      value: [
        1, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
        24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
        42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
      ],
    },

    discardDeck: {
      type: "cardList",
      value: [5, 2, 3, 4],
    },
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
      value: [],
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
      maxTour: 3,

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
            //  Player status switch to played
            {
              id: 1,
              inputBool: true,
              player: "{currentPlayer}",
            },
          ],
        },
        {
          name: "miser",
          return: "currentPlayer",
          type: "askPlayer",
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
          condition:
            "exp(comp({currentPlayer#currentBet};isNotEqualNumber;{currentBet})&&comp({currentPlayer#gain#1};isSuperiorNumber;calc({currentBet}-{currentPlayer#currentBet})))",

          return: "{currentPlayer}",
          withValue: [
            // Suivre la mise
            {
              id: 14,
              player: "{currentPlayer}",
              inputNumber: "calc({currentBet}-{currentPlayer#currentBet})",
            },
            {
              id: 1,
              inputBool: true,
              player: "{currentPlayer}",
            },
          ],
        },
        {
          name: "Check",
          appearAtPlayerTurn: true,
          condition:
            "comp({currentPlayer#currentBet};isEqualNumber;{currentBet})",

          return: "currentPlayer",
          withValue: [
            // Suivre la mise
            //  Player status switch to played
            {
              id: 1,
              inputBool: true,
              player: "{currentPlayer}",
            },
          ],
        },
        {
          name: "Tapis",
          appearAtPlayerTurn: true,
          condition:
            "exp(comp({currentPlayer#currentBet};isInferiorOrEqual;{currentBet})&&comp({currentPlayer#gain#1};isSuperiorNumber;0))",

          return: "currentPlayer",
          withValue: [
            // Suivre la mise
            {
              id: 14,
              type: "withValueEvent",
              player: "{currentPlayer}",
              inputNumber: "{currentPlayer#gain#1}",
            },
            {
              id: 3,
              inputNumber: "{currentPlayer#currentBet}",
            },

            //  Player status switch to played
            {
              id: 1,
              inputBool: true,
              player: "{currentPlayer}",
            },

            // Change all Other Player to "not played"
            {
              id: 8,
              inputBool: true,
            },
          ],
        },
      ],
      actionsAtEnd: 0,
    },
    manche: {
      actionsAtStart: [],
      actionsAtEnd: 0,
      maxManche: null,
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
        name: "",
        condition:
          "exp(comp({tour};isEqualNumber;4)&&allPlayersHasPlayed/endOfTour)",
        events: [13, 15, 16, 302],
        // 13 récupération des mises
        // 15 lancer la verification des cartes
        // 16 reset global bet
        // 302 change manche
      },

      {name: "",
        condition: "exp(comp({tour};isEqualNumber;5)&&onChangeTour)",
        events: [],
        // lancer la verification des cartes
      },

      {name: "",
        condition: "onChangeTour",
        events: [13, 18],
        // récupérer les mises centrales
      },
      {name: "",
        condition: "startOfGame",
        events: [8, 4],
        removeAfterUse: true,
        // melanger les cartes
        // distribution des gains
        // distrubtion des cartes se fait au debut de la manche
      },
      {name: "",
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

      {name: "",
        boucle: "{allPlayersInGame}",
        condition:
          "exp(comp({playerBoucle};samePlayer;{currentPlayer})||comp({playerBoucle#attachedEventForTour};contain;<<skipPlayerTour>>))",
        events: [13, 17, 18, 302],
        // relance  eachStartOfManche
        // récupérer les mises centrales
        // 18 remettre current bet a  0
      },

      // creer automatiquement
      {name: "",
        condition: "allPlayersHasPlayed/endOfTour", // ALSO END OF TOUR
        events: [14, 301],
        // 14 mettre le status de tous les joueurs en "non joués"
        // 301 changement de tour
      },
    ],
    events: [
      // default events
      {
        id: 300,
        name: "WIN",
        condition: null,
        event: {
          for: "{currentPlayer}",
          give: null,
          attachedEventForTour: null,
          action: "win",
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
          give: null,
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
          give: null,
          attachedEventForTour: null,
          action: "changeManche",
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
          give: null,
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

          action: null,
          value: null,
        },
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
          withValue: [
            // change global "currentBet"
            {
              id: 3,
              inputNumber:
                "{getPlayer(calc({startPlayer#position}+2))#currentBet}",
            },
          ],
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
          from: "{deck}",
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
          from: "{playerBoucle#currentBet}", // bien supprimer les currentBet
          for: "{groupPot}",
          give: {
            "{gain#1}": "{playerBoucle#currentBet}",
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
          for: "{currentPlayer#handœCardDeck#type=french_standard}",
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
      {
        id: 17,
        name: "Donner les mises à un joueur",
        loadMessage: "Réinitialisation de la mise globale...",
        condition: null,
        event: {
          from: "{groupPot}",
          for: "{currentPlayer}",
          give: {
            "{gain#1}": "*",
          },
        },
      },
      {
        id: 18,
        name: "Reset current bet",
        condition: null,
        event: {
          for: "{currentBet}",
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
          give: null,
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
          give: null,
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
          give: null,
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
          give: null,
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
          give: null,
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
          give: null,
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
          give: null,
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
          give: null,
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
          give: null,
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
          give: null,
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
          give: null,
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
        condition: null,
        boucle: "{allPlayersInGame}",
        event: {
          condition:
            "exp(comp({playerBoucle#attachedEventForTour};notContain;<<skipPlayerTour>>)&&comp({playerBoucle};differentPlayer;{currentPlayer}))",
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
          from: "{player}",
          for: "{player#currentBet}",
          give: {
            "{gain#1}": "{inputNumber}",
          },
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
              player: "{currentPlayer}",
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
        condition: null,
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
        condition: null,
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
          give: null,
          action: "skipPlayerTour",
          value: null,
        },
      },
      {
        // Change all player status if current bet is not global current bet
        id: 8,
        name: "change play status to all player when player bet",
        condition: null,
        boucle: "{allPlayersInGame}",
        event: {
          condition:
            "exp(exp(comp({playerBoucle#attachedEventForTour};notContain;<<skipPlayerTour>>)&&comp({playerBoucle};differentPlayer;{currentPlayer}))&&comp({playerBoucle#currentBet};isInferiorNumber;{currentBet}))",
          for: "{playerBoucle#hasPlayed}",
          action: "updateGlobalValue",
          value: "false",
        },
      },
    ],
  },
  assets: {
    cards: {
      // --- PIQUES (Spades) ---
      1: {
        id: 1,
        value: 1,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      },
      2: {
        id: 2,
        value: 2,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      },
      3: {
        id: 3,
        value: 3,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      },
      4: {
        id: 4,
        value: 4,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      },
      5: {
        id: 5,
        value: 5,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      },
      6: {
        id: 6,
        value: 6,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      },
      7: {
        id: 7,
        value: 7,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      },
      8: {
        id: 8,
        value: 8,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      },
      9: {
        id: 9,
        value: 9,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      },
      10: {
        id: 10,
        value: 10,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      },
      11: {
        id: 11,
        value: 11,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      }, // Valet
      12: {
        id: 12,
        value: 12,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      }, // Dame
      13: {
        id: 13,
        value: 13,
        type: "french_standard",
        addedAttributs: { couleur: "pique" },
      }, // Roi

      // --- TREFLES (Clubs) ---
      14: {
        id: 14,
        value: 1,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      15: {
        id: 15,
        value: 2,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      16: {
        id: 16,
        value: 3,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      17: {
        id: 17,
        value: 4,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      18: {
        id: 18,
        value: 5,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      19: {
        id: 19,
        value: 6,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      20: {
        id: 20,
        value: 7,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      21: {
        id: 21,
        value: 8,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      22: {
        id: 22,
        value: 9,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      23: {
        id: 23,
        value: 10,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      24: {
        id: 24,
        value: 11,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      25: {
        id: 25,
        value: 12,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },
      26: {
        id: 26,
        value: 13,
        type: "french_standard",
        addedAttributs: { couleur: "treffle" },
      },

      // --- COEURS (Hearts) ---
      27: {
        id: 27,
        value: 1,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      28: {
        id: 28,
        value: 2,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      29: {
        id: 29,
        value: 3,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      30: {
        id: 30,
        value: 4,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      31: {
        id: 31,
        value: 5,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      32: {
        id: 32,
        value: 6,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      33: {
        id: 33,
        value: 7,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      34: {
        id: 34,
        value: 8,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      35: {
        id: 35,
        value: 9,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      36: {
        id: 36,
        value: 10,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      37: {
        id: 37,
        value: 11,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      38: {
        id: 38,
        value: 12,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },
      39: {
        id: 39,
        value: 13,
        type: "french_standard",
        addedAttributs: { couleur: "coeur" },
      },

      // --- CARREAUX (Diamonds) ---
      40: {
        id: 40,
        value: 1,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      41: {
        id: 41,
        value: 2,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      42: {
        id: 42,
        value: 3,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      43: {
        id: 43,
        value: 4,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      44: {
        id: 44,
        value: 5,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      45: {
        id: 45,
        value: 6,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      46: {
        id: 46,
        value: 7,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      47: {
        id: 47,
        value: 8,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      48: {
        id: 48,
        value: 9,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      49: {
        id: 49,
        value: 10,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      50: {
        id: 50,
        value: 11,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      51: {
        id: 51,
        value: 12,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
      },
      52: {
        id: 52,
        value: 13,
        type: "french_standard",
        addedAttributs: { couleur: "carreau" },
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
    displayWidget(event, params, roomId);
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
  socket2.on("roomJoined", (room) => {
    connectSocket3();
  });
  socket2.on("gameChanges", (room) => {
    changeGamePlayerVariable(2, playerId, room);
  });
  socket2.on("error", (err) => {
    console.log(err);
    writeMessage("error", err);
  });

  socket.on("askPlayer", ({ event, params, roomId }) => {
    displayWidget(event, params, roomId);
  });
}
let socket3 = null;

function connectSocket3() {
  if (socket3) return;
  socket3 = io("ws://localhost:8008");

  let playerId = null;
  socket3.on("playerDataId", (id) => {
    playerId = id;
  });

  let pseudo = "mey3";
  let roomId = "a4a4a4a4";
  socket3.emit("joinRoom", { roomId, pseudo });
  socket3.on("roomJoined", (room) => {});
  socket3.on("gameChanges", (room) => {
    changeGamePlayerVariable(3, playerId, room);
  });
  socket3.on("error", (err) => {
    console.log(err);
    writeMessage("error", err);
  });

  socket.on("askPlayer", ({ event, params, roomId }) => {
    displayWidget(event, params, roomId);
  });
}

function displayWidget(event, params, roomId) {
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
    (max = event.event.requiresInput.max),
  );
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
  if (!cardId) {
    console.warn("cardId is null");
    return null;
  }
  if (!gameData.roomInDb.assets.cards[cardId]) {
    console.warn("cardId not found in assets : " + cardId);
    return null;
  }

  return gameData.roomInDb.assets.cards[cardId];
}
function cardToStr(cardObject) {
  if (!cardObject) return "Card not found";
  return `${cardObject.value} ${cardObject.addedAttributs.couleur}`;
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
          cardToStr(getCardObjectFromId(id, room)),
        )}</span>
        <span>personalHandDeck : ${player.personalHandDeck.value.length}</span>
        <span>personalHandDiscard : ${
          player.personalHandDiscard.value.length
        }</span>

        <!-- Roles -->
        <span>Roles  : ${player.roles.value.map((r) => `${r.nom}`)}</span> 
        
        <!-- Actions -->
        <span>Actions  : ${player.actions.value.map(
          (a) =>
            `<button onclick="doAction('${playerId}','${room.roomId}','${a.name}','${a.type}')">${a.name}</button>`,
        )}</span>


        <!-- Gain -->
        <span>Gain  : ${Object.keys(player.gain.value).map(
          (k) => `${getGainName(k, room)} : ${player.gain.value[k].value}`,
        )}</span>

        
        <!-- Other dynamique values -->
        ${Object.keys(room.roomInDb.globalValuesOfPlayer).map((k) => {
          if (k == "gain") return "";
          return `<span>${k} :  ${
            player[k].value != null ? player[k].value : player[k]
          }</span>`;
        })}

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
function doAction(playerId, roomId, action, actionType) {
  console.log("change tour");

  socket.emit("doAction", { playerId, roomId, action, actionType });
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
                 }</span>`,
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

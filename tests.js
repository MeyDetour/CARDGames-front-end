const exp = [
  // "allPlayersHasPlayed",
  // "startOfGame",
  // "eachStartOfManche",
  // "eachEndOfTour",
  // "{currentPlayer}",
  "allPlayersHasPlayed/endOfTour",
  "{currentPlayer}",
  "comp({currentPlayer#gain#1};isSuperiorNumber;{currentBet})",
  "exp(comp({currentPlayer#currentBet};isNotEqualNumber;{currentBet})&&comp({currentPlayer#gain#1};isSuperiorNumber;calc({currentBet}-{currentPlayer#currentBet})))",
  "calc({currentBet}-{currentPlayer#currentBet})",
  "comp({currentPlayer#currentBet};isEqualNumber;{currentBet})",
  "exp(comp({currentPlayer#currentBet};isInferiorOrEqual;{currentBet})&&comp({currentPlayer#gain#1};isSuperiorNumber;0))",
  "{currentPlayer#gain#1}",
  "exp(comp({tour};isEqualNumber;4)&&allPlayersHasPlayed/endOfTour)",
  "exp(comp({tour};isEqualNumber;5)&&onChangeTour)",
  "exp(comp({playerBoucle};samePlayer;{currentPlayer})||comp({playerBoucle#attachedEventForTour};contain;<<skipPlayerTour>>))",
  "{getPlayer(calc({startPlayer#position}+1))#currentBet}",
  "getPlayer(calc({startPlayer#position}+1))",
  "getPlayer(calc({startPlayer#position}+2))",
  "{getPlayer(calc({startPlayer#position}+2))#currentBet}",
  "{getPlayer(calc({startPlayer#position}+2))#currentBet}",
  "{allPlayersInGame}",
  "{playerBoucle#handDeck}",
  "{playerBoucle#currentBet}",
  "{playerBoucle#currentBet}",
  "{currentPlayer#handœCardDeck#type=french_standard}",
];
// {playerBoucle}

// "removeAllAtachedEventsForTour"
// "changeStartingPlayer"

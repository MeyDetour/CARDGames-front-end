

const exp = [
    // "allPlayersHasPlayed",
    // "startOfGame",
    // "eachStartOfManche",
    // "eachEndOfTour",
    // "{currentPlayer}",
    "exp(comp({currentPlayer#currentBet};isNotEqualNumber;{currentBet})&&comp({currentPlayer#gain#1};isSuperiorNumber;calc({currentBet}-{currentPlayer#currentBet})))",
    "calc({currentBet}-{currentPlayer#currentBet})",
    "comp({currentPlayer#currentBet};isEqualNumber;0)",
    "exp(comp({currentPlayer#currentBet};isNotEqualNumber;{currentBet})&&comp({currentPlayer#gain#1};isInferiorNumber;calc({currentBet}-{currentPlayer#currentBet})))",
    "{currentPlayer#gain#1}",
    "exp(comp({tour};isEqualNumber;4)&&allPlayersHasPlayed)",
    "exp(comp({tour};isEqualNumber;5)&&eachEndOfTour)",
    "{getPlayer(calc({startPlayer}+2))#gain#1}",
    "calc(2*{smallBlind})",
    "{card#type=french_standard}",
    "{currentPlayer#handCardDeck#type=french_standard}",
    "{groupPot#gain#1}",
    "{inputCardList#type=french_standard}",
    "inputTypePlayer#hasPlayed",
    "{inputCardList#type=french_standard}",
    "exp(comp({tour};isEqualNumber;1;return;1)||comp({tour};isEqualNumber;2;return;1)||comp({tour};isEqualNumber;3;return;3))"
]

function getType(exp) {

    if (typeof exp !== "string") {
        return exp;
    }
    if (exp.startsWith("exp(")) {
        return "expression"
    } else if (exp.startsWith("calc(")) {
        return "calcul"
    } else if (exp.startsWith("comp(")) {
        return "comparaison"
    } else if (exp.startsWith("{")) {
        return "variable"
    }else if (exp.startsWith("getPlayer(")) {
        return "getPlayerFunction"
    } else {
        return "calculatedValue"
    }
}

function removeTags(exp) {
    const type = getType(exp)
    if (type === "expression") {
        return exp.substring(4, exp.length - 1)
    }
    if (type === "comparaison" || type === "calcul") {
        return exp.substring(5, exp.length - 1)
    }
    if (type === "getPlayerFunction") {
        return exp.substring(10, exp.length - 1)
    }if (type === "variable") {
        return exp.substring(1, exp.length - 1)
    }
}

function explodeExpression(exp) {
    console.log("======================================================================================")
    const type = getType(exp)
    console.log(exp);
    console.log(type);
    let distribution = logicalRedistribution(exp);
    console.log(distribution)
}

/**
 * Redirige to the good function according to the type
 * @param  {String} str An unknow expression
 * return : callback
 */
function logicalRedistribution(str) {
    let type = getType(str)
    if (type === "expression") {
        return splitLogicalExpression(str)
    }
    if (type === "comparaison") {
        return splitLogicalComparaison(str)
    }
    if (type === "calcul") {
        return splitLogicalCalcul(str)
    }
    if (type === "getPlayerFunction") {
        return splitLogicalGetPlayer(str)
    }
    if (type === "variable") {
        return splitLogicalVariable(str)
    }
    return str
}


/**
 * Execute logical function to get player with id
 * @param  {String} str The full expression variable
 * return : player object
 */
function splitLogicalGetPlayer(str) {
    str = removeTags(str)
    let value = logicalRedistribution(str)
    return game.globalValuesOfPlayer
}

/**
 * Execute logical separation for access variable  ex currentPlayer#gain#1
 * @param  {String} str The full expression variable
 * return : value
 */
function splitLogicalVariable(str) {
    str = removeTags(str)
    let list = str.split("#")
    let value = null
    for (let i = 0; i < list.length; i++) {

        let elt = logicalRedistribution(list[i])

        if (!value) {
            if (elt === "currentPlayer") {
                value = game.globalValuesOfPlayer
            } else {
                value = game.globalValue[elt]
                if (!value) {
                    console.warn(elt + " property is null ")
                    value = elt
                }else{
                    if (value.value != null){
                        value = value.value
                    }
                }

            }

        } else {
            let property = value[elt]
            if (property == null) {
                console.warn(elt + " property is null search :" + str + " in " + JSON.stringify(value))
            } else {
                if (property.value != null) {
                    value = property.value
                } else {
                    value = property
                }
            }

        }
    }
    console.log(str, value)


    return value
}




/**
 * Execute logical separation for comparaison ex : a > b
 * @param  {String} str The full comparaison
 * return : [element to compare (a) ,text comparaison(>), comparaison value(b)]
 */
function splitLogicalCalcul(str) {
    str = removeTags(str)
    let comparators = ["+", "*", "-"]
    let string = ""
    let finalList = []
    for (let i = 0; i < str.length; i++) {
        if (comparators.includes(str[i])) {
            finalList.push(string)
            finalList.push(str[i])
            string = ""
            continue
        }
        string += str[i]
    }
    if (string !== "") {
        finalList.push(string)
    }
    for (let i = 0; i < finalList.length; i++) {
        finalList[i] = logicalRedistribution(finalList[i])
    }
    console.log(str,finalList)
    return resolveLogicalCalcul(finalList)
}
/**
 *  Resolve calcul like 1-1
 * @param  {List} list list of instructions like ["1","+","2"]
 * return : int
 */
function resolveLogicalCalcul(list) {
    let comparateur =  list[1]
    let a = parseInt(list[0])
    let b = parseInt( list[2])
    if (comparateur ==="-")  return a - b
    if (comparateur ==="+")  return a + b
    if (comparateur ==="*")  return a * b
}


/**
 * Execute logical separation for comparaison ex : a > b
 * @param  {String} str The full comparaison
 * return : [element to compare (a) ,text comparaison(>), comparaison value(b)]
 */
function splitLogicalComparaison(str) {
    str = removeTags(str)
    let list = str.split(";")
    for (let i = 0; i < list.length; i++) {
        list[i] = logicalRedistribution(list[i])
    }
    console.log(str,list)

    return resolveLogicalComparaison(list)
}

/**
 *  Resolve comparaison like a < b
 * @param  {List} list list of instructions like ["1","inferior","2"]
 * return : bool
 */
function resolveLogicalComparaison(list) {
    let comparateur =  list[1]
    let a = parseInt(list[0])
    let b = parseInt( list[2])
    if (comparateur ==="isEqualNumber")  return a === b
    if (comparateur ==="isNotEqualNumber")  return a !== b
    if (comparateur ==="isSuperiorNumber")  return a > b
    if (comparateur ==="isInferiorNumber")  return a < b
}


/**
 * Execute logical separation for Expressions
 * @param  {String} str The full expression
 * return : [leftSide,["&&" | "||"], rightSide]
 */
function splitLogicalExpression(str) {

    str = removeTags(str)

    let depth = 0;
    let parts = [];
    let current = "";

    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        const next = str[i + 1];

        if (c === '(') depth++;
        if (c === ')') depth--;

        // On ne split que si profondeur 0 → opérateurs logiques externes
        if (depth === 0 && ((c === '|' && next === '|') || (c === '&' && next === '&'))) {

            // left expression
            parts.push(logicalRedistribution(current.trim()))
            parts.push(c + c);
            current = "";
            i++; // skip the second |
            continue;
        }

        current += c;
    }

    // right side of
    if (current) {
        parts.push(logicalRedistribution(current.trim()))

    }
    if (parts.length === 1) return parts[0];
    console.log(str,parts)
    return resolveLogicalExpressionlist(parts);
}
/**
 *  Resolve  expression like a || b
 * @param  {List} list list of expression like ["false","&&","false"]
 * return : bool
 */
function resolveLogicalExpressionlist(list) {
    let comparateur =  list[1]
    let a = list[0]
    let b =  list[2]
    if (typeof a == "boolean" && typeof b == "boolean") {
        if (comparateur ==="&&") return  a && b
        if (comparateur ==="||")  return a || b
    }
    else{
        console.warn("a et b ne sont pas des int")
    }

}

exp.forEach((exp) => explodeExpression(exp))

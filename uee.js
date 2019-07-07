'use strict'


const ENCOUNTER_TABLE = [ [
        {atk:1, hit:5},
        {atk:1, hit:6},
        {atk:2, hit:6},
        {atk:3, hit:6},
        {atk:4, hit:6},
    ], [
        {atk:2, hit:5},
        {atk:1, hit:6},
        {atk:1, hit:6},
        {atk:3, hit:5},
        {atk:4, hit:6, s:true},
    ], [
        {atk:1, hit:5},
        {atk:2, hit:6},
        {atk:2, hit:6},
        {atk:3, hit:6},
        {atk:4, hit:6},
    ], [
        {atk:1, hit:5},
        {atk:1, hit:6},
        {atk:2, hit:6, s:true},
        {atk:3, hit:6},
        {atk:4, hit:6},
    ], [
        {atk:1, hit:5},
        {atk:1, hit:6, s:true},
        {atk:2, hit:6, s:true},
        {atk:3, hit:6},
        {atk:4, hit:6, s:true},
    ], [
        {atk:1, hit:5},
        {atk:2, hit:5},
        {atk:3, hit:5},
        {atk:3, hit:6, s:true},
        {atk:4, hit:6, s:true},
    ]
]

class Statistics {
    constructor () {
        this.dices = []
        this.moves = 0
        this.searches = 0
        this.encounters1 = 0
        this.encounters2 = 0
        this.encounters3 = 0
        this.encounters4 = 0
        this.encounters5 = 0
    }
}

class State {
    constructor () {
        this.state = "idle"
        this.location = 0
        this.hitpoints = 0
        this.day = 0
        this.godshand = 0
        this.stores = [0, 0, 0, 0, 0, 0]
        this.toolbelt = [true, true, true]
        this.constructs = [false, false, false, false, false, false]
        this.treasures = [false, false, false, false, false, false]
        this.dices = [0, 0]
        this.searchgrid = [0, 0, 0, 0, 0, 0]
        this.searchResult = false
        this.searchesInLocation = 0
        this.encounterLvl = 0
        this.encounterRound = 0
    }
}

class UtopiaEngineEngine {
    constructor (json) {
        if (json) {
            this.state = JSON.parse(json)
        } else {
            this.state = new State()
        }
    }

    isDayPassedOnSearch(location, searchcount) {

    }

    progressTimetrack () {
        this.state.day++
        // TODO Event change, doomsday check etc
    }

    diceRoll () {
        this.state.dices[0] = Math.floor((Math.random() * 6)) + 1
        this.state.dices[1] = Math.floor((Math.random() * 6)) + 1
        console.log(`Dices rolled ${this.state.dices[0]} and ${this.state.dices[1]}`)
    }

    initEncounter() {
        let absResult = this.state.searchResult
        if (absResult < 0) {
            absResult = (absResult * -1) + 99
        }

        this.state.state = "combat"
        this.state.encounterLvl = Math.floor(absResult / 100)

        console.log(`Encounter lvl ${this.state.encounterLvl}`)
    }

    // Action methods //
    doMove (location) {
        if(location != this.state.location && location >= 0 && location <= 6) {
            if(this.state.state == "idle") {
                this.state.location = location
                this.state.searchesInLocation = 0
                console.log(`You moved to ${this.state.location}`)
                return true
            }
        }
        return false
    }

    doRest () {
        if (this.state.state == "idle") {

            if(this.state.hitpoints > 0) {
                this.state.hitpoints--
            }
            this.progressTimetrack()
            console.log(`You rested for one day`)
            return true
        }
        return false
    }

    doSearchBegin () {
        if(this.state.location != 0) {
            if(this.state.state == "idle") {
                this.state.state = "search_input"
                this.state.searchgrid = [0, 0, 0, 0, 0, 0]
                this.state.searchesInLocation++

                this.diceRoll()

                console.log(`You started search at ${this.state.location}`)
                return true
            }
        }
        return false
    }

    doSearchInput (value, position) {
        if(value && value >= 1 && value <= 6 &&
           position >= 0 && position <= 5) {
            if(this.state.state == "search_input" &&
               this.state.searchgrid[position] == 0 &&
               (this.state.dices[0] == value || this.state.dices[1] == value)
               ) {

                this.state.searchgrid[position] = value
                if(this.state.dices[0] == value) {
                    this.state.dices[0] = 0
                } else {
                    this.state.dices[1] = 0
                }
                if(this.state.dices[0] == 0 && this.state.dices[1] == 0 &&
                   this.state.searchgrid.some( i => i == 0 )) {
                    this.diceRoll()
                }

                console.log(`While searching you put ${value} at position ${position}`)
                return true
            }
            console.log('Invalid state, searchgird value or dice')
            return false
        }
        console.log('Invalid value or position')
        return false
    }

    doSearchResult () {
        if(this.state.searchgrid.every( i => i != 0 )) {
            let top = this.state.searchgrid[0] * 100
            top += this.state.searchgrid[1] * 10
            top += this.state.searchgrid[2]

            let bottom = this.state.searchgrid[3] * 100
            bottom += this.state.searchgrid[4] * 10
            bottom += this.state.searchgrid[5]

            this.state.searchResult = top - bottom
            this.state.state = "search_result"

            console.log(`Search result: ${top} - ${bottom} = ${this.state.searchResult}`)
            return true
        }
        console.log('Search not completed')
        return false
    }

    doUseDowsingRod (value) {
        if (this.state.state == "search_result") {
            if (this.state.toolbelt[0] == true) {
                if (value >= 0 && value <= 100) {
                    if (this.state.searchResult > 1) {
                        this.state.searchResult -= value
                        this.state.toolbelt[0] = false
                        if (this.state.searchResult < 1) {
                            this.state.searchResult = 1
                        }

                        console.log(`You used Dowsing Rod and reduced search result to ${this.state.searchResult}`)
                        return true
                    }
                    console.log('Dowsing Rod cannot reduce result to lower than 1!')
                    return false
                }
                console.log('Invalid value for Dowsing Rod!')
                return false
            }
            console.log('Dowsing Rod already used!')
            return false
        }
        console.log('Dowsing Rod cannot be used outside of searching!')
        return false
    }

    doSearchFinish () {
        if ( this.state.searchResult >= 100 ) {
            console.log('Encounter')
            this.initEncounter()
        } else if ( this.state.searchResult >= 11 ) {
            console.log('component')
        } else if ( this.state.searchResult >= 1 ) {
            console.log('construct')
        } else if ( this.state.searchResult == 0 ) {
            console.log('activated construct')
        } else if ( this.state.searchResult >= -555) {
            console.log('encounter')
            this.initEncounter()
        }

    }

    doDamage () {

    }

    doCombatUseMoonlace () {
        if (this.state.treasures[2]) {
            if (this.state.state == "combat" && this.state.encounterRound == 0) {
                console.log("Combat evaded with Shimmering Moonlace")
                this.state.state = "idle"
            }
        }
    }

    doCombatRoll () {
        if (this.state.state == "combat") {
            this.diceRoll()
            const enemy = ENCOUNTER_TABLE[this.state.location-1][this.state.encounterLvl-1]

            let modatk = enemy.atk
            if (this.state.treasures[0]) {
                if (modatk > 1) {
                    modatk--
                }
            }

            let modhit = enemy.hit
            if (this.state.treasures[4]) {
                modhit--
            }

            if (this.state.dices[0] <= modatk) {
                this.doDamage()
            }
            if (this.state.dices[1] <= modatk) {
                this.doDamage()
            }

            if (this.state.dices[0] >= modhit || this.state.dices[1] >= modhit) {

            }
        }
    }

    doCombatWon () {
        if (this.state.state ==  "combat") {

        }
    }

    doAction (action) {
        if(action && action.action == "move") {
            return this.doMove(action.location)
        } else if (action.action == "rest") {
            return this.doRest()
        } else if (action.action == "search_begin") {
            return this.doSearchBegin()
        } else if (action.action == "search_input") {
            return this.doSearchInput(action.value, action.position)
        }
        return false
    }
}


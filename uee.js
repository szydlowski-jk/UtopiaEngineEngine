'use strict'

class State {
    constructor () {
        this.hitpoints = 0
        this.day = 0
        this.godshand = 0
        this.stores = [0, 0, 0, 0, 0, 0]
        this.toolbelt = [false, false, false]
        this.constructs = [false, false, false, false, false, false]
        this.treasures = [false, false, false, false, false, false]
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



}


let uee = new UtopiaEngineEngine()

uee.doMove(2)
uee.doSearchBegin()

uee.doSearchInput(uee.state.dices[0], 0)
uee.doSearchInput(uee.state.dices[1], 1)

uee.doSearchInput(uee.state.dices[0], 2)
uee.doSearchInput(uee.state.dices[1], 3)

uee.doSearchInput(uee.state.dices[0], 4)
uee.doSearchInput(uee.state.dices[1], 5)

uee.doSearchResult()
uee.doUseDowsingRod(101)
uee.doUseDowsingRod(100)
uee.doUseDowsingRod(100)
uee.doSearchFinish()
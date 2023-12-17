import { useEffect, useState } from 'react'
import './App.css'
import { Die } from './Die'
import {nanoid} from "nanoid"
import Confetti from "react-confetti"


function App() {
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)

  useEffect(() => {
    // checks if all dice are held and returns true
    const allHeld = dice.every(die => die.isHeld)
    // picks the number at spot 1
    const firstValue = dice[0].value
    // compares with rest to see if values are the same
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
    }
  }, [dice])

  // this is a helper function 
  // to keep code dry
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()}
  }

  // generates 10 random numbers from 1-6
  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice   
  }

  function diceRoll() {
    // tenzies set to false
    if(!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDie()
      }))
      // we want to restart if user won
    } else {
      setTenzies(false)
      setDice(allNewDice())
    }
    
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        {...die, isHeld: !die.isHeld} :
        die
    }))
  }

  const diceElements = dice.map(die => (<Die key={die.id} value={die.value} 
    isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />))
  return (
    <main>
      {/* render confetti if tenzies is true */}
      {tenzies && <Confetti />}
      <h1 className='title'>{tenzies ? "You've won" : "Tenzies"}</h1>
      <p className='instructions'>{tenzies ? "Click button to start new game" : "Roll until all dice are the same. Click each die to freeze it at its current value between rolls"}</p>
      <div className='dice-container'>
        {diceElements}
      </div>
      <button className='roll-dice'
      onClick={diceRoll}>
        {tenzies ? "New Game" : "Roll Dice"}
      </button>
    </main>
  )
}

export default App

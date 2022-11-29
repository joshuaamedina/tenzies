import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import './App.css';

export default function App() {

  const [dice, setDice] = React.useState(allNewDice(10))
  const [tenzies, setTenzies] = React.useState(false)
  const [rollCount, setRollCount] = React.useState(0)
  const [diceCount, setDiceCount] = React.useState(10)
  const [highscore, setHighscore] = React.useState(JSON.parse(localStorage.getItem("highscore")) || 0)
  
  React.useEffect(() => {
      const allHeld = dice.every(die => die.isHeld)
      const firstValue = dice[0].value
      const allSameValue = dice.every(die => die.value === firstValue)
      if (allHeld && allSameValue) {
          setTenzies(true)
      }
  }, [dice])

  React.useEffect(() => {
    localStorage.setItem("highscore", JSON.stringify(highscore))
  }, [highscore])

  function generateNewBoard(event){
    setRollCount(0)
    setDiceCount(event.target.value)
    setDice(allNewDice(event.target.value))
  }

  function generateNewDie() {
      return {
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid()
      }
  }
  
  function allNewDice(size) {
      const newDice = []
      for (let i = 0; i < size; i++) {
          newDice.push(generateNewDie())
      }
      return newDice
  }
  
  function rollDice() {
      setRollCount(oldCount => oldCount + 1)
      if(!tenzies) {
          setDice(oldDice => oldDice.map(die => {
              return die.isHeld ? 
                  die :
                  generateNewDie()
          }))
      } else {
          if(highscore > rollCount || highscore === 0){
            setHighscore(rollCount)
          }
          setRollCount(0)
          setTenzies(false)
          setDice(allNewDice(diceCount))
      }
  }
  
  function holdDice(id) {
      setDice(oldDice => oldDice.map(die => {
          return die.id === id ? 
              {...die, isHeld: !die.isHeld} :
              die
      }))
  }
  
  const diceElements = dice.map(die => (
      <Die 
          key={die.id} 
          value={die.value} 
          isHeld={die.isHeld}
          tenzies = {tenzies} 
          holdDice={() => holdDice(die.id)}
      />
  ))
  
  return (
    <div className="container">
      {tenzies && <Confetti />}
      <main>
          <h1 className="title">Tenzies</h1>
          <div className="game-board">
            <button
                className="number-board"
                onClick={generateNewBoard}
                value={10}
            > 10 </button>
            <button 
                className="number-board"
                onClick={generateNewBoard}
                value={15}
            > 15 </button>
            <button 
                className="number-board"
                onClick={generateNewBoard}
                value={20}
            > 20 </button>
          </div>
          <h2 className="roll-count">Rolls: {rollCount}</h2>
          <h2 className="highscore">Highscore: {highscore} rolls!</h2>
          <p className="instructions">Roll until all dice are the same. 
          Click each die to freeze it at its current value between rolls.</p>
          <div className="dice-container">
              {diceElements}
          </div>
          <button 
              className="roll-dice" 
              onClick={rollDice}
          >
              {tenzies ? "New Game" : "Roll"}
          </button>
      </main>
    </div>
  )
}
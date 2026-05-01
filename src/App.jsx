import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(0)

  const getCountColor = () => {
    if (count > 0) return '#4ade80'
    if (count < 0) return '#f87171'
    return '#a78bfa'
  }

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">Counter</h1>
        <p className="subtitle">Click the buttons to change the count</p>

        <div className="count-display" style={{ color: getCountColor() }}>
          <span className="count-value">{count}</span>
        </div>

        <div className="controls">
          <button className="btn btn-decrement" onClick={decrement} id="btn-decrement">
            −
          </button>
          <button className="btn btn-reset" onClick={reset} id="btn-reset">
            Reset
          </button>
          <button className="btn btn-increment" onClick={increment} id="btn-increment">
            +
          </button>
        </div>

        <p className="hint">
          {count === 0
            ? 'Start counting!'
            : count > 0
            ? `${count} above zero`
            : `${Math.abs(count)} below zero`}
        </p>
      </div>
    </div>
  )
}

export default App

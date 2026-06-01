import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

const BASIC_KEYS = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'];
const SCI_KEYS = ['sin(','cos(','tan(','log(','ln(','sqrt(','factorial(','pi','e','^','(',')'];

function ModeToggle({ mode, setMode }) {
  return <div className="mode-toggle" role="tablist" aria-label="Calculator modes">
    {['basic','scientific','ai-assist'].map((item) => <button key={item} role="tab" aria-selected={mode===item} className={mode===item ? 'active' : ''} onClick={() => setMode(item)}>{item}</button>)}
  </div>;
}

function DisplayPanel({ expression, result, error }) {
  return <section className="display-panel" aria-live="polite">
    <span className="display-label">Quantum Display</span>
    <div className="expression">{expression || '0'}</div>
    <AnimatePresence mode="wait">
      <motion.div key={error || result || 'idle'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={error ? 'display-error' : 'display-result'}>
        {error || result || 'Awaiting neural input'}
      </motion.div>
    </AnimatePresence>
  </section>;
}

function Keypad({ appendValue, evaluateExpression, clear }) {
  return <section className="keypad" aria-label="Calculator keypad">
    <button className="control danger" onClick={clear}>AC</button>
    {BASIC_KEYS.map((key) => <button key={key} className={key === '=' ? 'equals' : ''} onClick={() => key === '=' ? evaluateExpression() : appendValue(key)}>{key}</button>)}
  </section>;
}

function ScientificPanel({ appendValue }) {
  return <motion.section className="scientific-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-label="Scientific functions">
    {SCI_KEYS.map((key) => <button key={key} onClick={() => appendValue(key)}>{key}</button>)}
  </motion.section>;
}

function AIAssistPanel({ aiPrompt, setAiPrompt, submitPrompt }) {
  return <motion.section className="ai-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-label="AI assist panel">
    <label htmlFor="ai-prompt">Natural language uplink</label>
    <textarea id="ai-prompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Ask: what is the square root of 144 plus sin pi over 2?" />
    <button onClick={submitPrompt}>Interpret with Claude</button>
  </motion.section>;
}

function HistoryRail({ history }) {
  return <aside className="history-rail" aria-label="Expression history">
    <h2>History</h2>
    {history.length === 0 ? <p>No echoes in memory yet.</p> : history.map((item) => <button key={item.id}>{item.expression} = {item.result}</button>)}
  </aside>;
}

export default function App() {
  const [mode, setMode] = useState('basic');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [history] = useState([]);

  const appendValue = (value) => { setError(''); setExpression((current) => current + value); };
  const clear = () => { setExpression(''); setResult(''); setError(''); };
  const evaluateExpression = () => setResult(expression ? 'Ready for backend calculation' : 'Enter an expression');
  const submitPrompt = () => setError(aiPrompt ? 'Neural uplink offline until API call is wired.' : 'Type a prompt first.');

  return <main className="app-shell">
    <div className="neural-grid" />
    <motion.section className="calculator-card" aria-label="AI scientific calculator" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="hero-row"><div><p className="eyebrow">Neural Compute Console</p><h1>AI Scientific Calculator</h1></div><ModeToggle mode={mode} setMode={setMode} /></div>
      <div className="calculator-layout">
        <div className="main-console">
          <DisplayPanel expression={expression} result={result} error={error} />
          {mode === 'scientific' && <ScientificPanel appendValue={appendValue} />}
          {mode === 'ai-assist' && <AIAssistPanel aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} submitPrompt={submitPrompt} />}
          <Keypad appendValue={appendValue} evaluateExpression={evaluateExpression} clear={clear} />
        </div>
        <HistoryRail history={history} />
      </div>
    </motion.section>
  </main>;
}

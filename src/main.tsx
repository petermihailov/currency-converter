import ReactDOM from 'react-dom/client'

import { App } from './App.tsx'
import { CalculatorIconsSprite } from './icons/Calculator.tsx'

import '../styles/fonts.css'
import '../styles/reset.css'
import '../styles/theme.css'
import '../styles/main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <CalculatorIconsSprite />
    <App />
  </>,
)

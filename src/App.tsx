import { useState } from 'react'

import { Currencies } from './screens/Currencies'
import { MainScreen } from './screens/Main'

export const App = () => {
  const [screen, setScreen] = useState<'main' | 'currencies'>('main')

  switch (screen) {
    case 'currencies':
      return <Currencies onBack={() => setScreen('main')} />
    default:
      return <MainScreen goCurrencies={() => setScreen('currencies')} />
  }
}

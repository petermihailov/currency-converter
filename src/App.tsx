import { useState } from 'react'

import { BottomSheet } from './components/BottomSheet'
import { Currencies } from './screens/Currencies'
import { MainScreen } from './screens/Main'

export const App = () => {
  const [isCurrenciesOpen, setIsCurrenciesOpen] = useState(false)

  return (
    <>
      <MainScreen goCurrencies={() => setIsCurrenciesOpen(true)} />
      <BottomSheet open={isCurrenciesOpen} onDismiss={() => setIsCurrenciesOpen(false)}>
        <Currencies />
      </BottomSheet>
    </>
  )
}

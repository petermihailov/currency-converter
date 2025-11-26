import { useState } from 'react'

import { BottomSheet } from './components/BottomSheet'
import { Currencies } from './screens/Currencies'
import { MainScreen } from './screens/Main'
import { AppStorageProvider } from './store/reducer'

export const App = () => {
  return (
    <AppStorageProvider>
      <AppContent />
    </AppStorageProvider>
  )
}

const AppContent = () => {
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

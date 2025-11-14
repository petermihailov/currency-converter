import clsx from 'clsx'
import { memo } from 'react'

import { ButtonSpring } from '../ButtonSpring'
import { Icon } from '../Icon'

import classes from './Tabs.module.css'

export interface TabsProps {
  className?: string
  onCurrencyClick: () => void
}

export const Tabs = memo(({ className, onCurrencyClick }: TabsProps) => {
  return (
    <nav className={clsx(className, classes.tabs)}>
      <ButtonSpring onClick={onCurrencyClick}>
        <Icon name="icon.ui.settings" />
      </ButtonSpring>
      {/*<ButtonSpring>*/}
      {/*  <Icon name="icon.ui.settings" />*/}
      {/*</ButtonSpring>*/}
    </nav>
  )
})

import clsx from 'clsx'
import { memo } from 'react'

import classes from './Settings.module.css'

export interface SettingsProps {
  className?: string
}

const Settings = ({ className }: SettingsProps) => {
  return <div className={clsx(className, classes.settings)}>Settings</div>
}

export default memo(Settings)

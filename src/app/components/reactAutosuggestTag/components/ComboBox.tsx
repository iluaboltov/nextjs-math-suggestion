import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { comboBoxId } from '../lib'

export type ComboBoxProps = React.PropsWithChildren<Record<string, unknown>>

export function ComboBox({ children }: ComboBoxProps): JSX.Element {
  // @ts-ignore
  const { comboBoxRef, id } = useContext(GlobalContext)

  return (
    <div className={'drop-shadow-lg'} id={comboBoxId(id)} ref={comboBoxRef}>
      {children}
    </div>
  )
}

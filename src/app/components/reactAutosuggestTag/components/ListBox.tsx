// @ts-nocheck
import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useListBox } from '../hooks'
import { OptionProps } from './Option'
import type { ClassNames } from '../sharedTypes'

type ListBoxRendererProps = React.ComponentPropsWithRef<'div'> & {
  children: React.ReactNode
  classNames: ClassNames
}

export type ListBoxRenderer = (props: ListBoxRendererProps) => JSX.Element

const DefaultListBox: ListBoxRenderer = ({ children, classNames, ...listBoxProps }) => {
  return (
    <div className={''} {...listBoxProps}>
      {children}
    </div>
  )
}

export type ListBoxProps = {
  children: React.ReactElement<OptionProps>[]
  render?: ListBoxRenderer
}

export function ListBox({ children, render = DefaultListBox }: ListBoxProps): JSX.Element | null {
  const { managerRef } = useContext(GlobalContext)
  const listBoxProps = useListBox()

  if (!managerRef.current.state.isExpanded || React.Children.count(children) === 0) return null

  return render({ children, ...listBoxProps })
}

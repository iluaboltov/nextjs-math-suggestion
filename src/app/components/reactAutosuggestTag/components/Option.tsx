// @ts-nocheck
import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useOption } from '../hooks'
import type { ClassNames, TagOption } from '../sharedTypes'

type OptionRendererProps = React.ComponentPropsWithRef<'div'> & {
  children: React.ReactNode
  classNames: ClassNames
  option: TagOption
}

export type OptionRenderer = (props: OptionRendererProps) => JSX.Element

const DefaultOption: OptionRenderer = ({ children, classNames, option, ...optionProps }) => {
  const classes = [classNames.option]

  if (option.active) classes.push(classNames.optionIsActive)

  return (
    <div className={classes.join(' ')} {...optionProps}>
      {children}
    </div>
  )
}

export type OptionProps = React.PropsWithChildren & {
  index: number
  render?: OptionRenderer
}

export function Option({ children, index, render = DefaultOption }: OptionProps): JSX.Element {
  const { option, optionProps } = useOption(index)

  return render({ children, option, ...optionProps })
}

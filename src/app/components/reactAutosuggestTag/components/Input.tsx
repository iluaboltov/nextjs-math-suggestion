// @ts-nocheck
import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useInput, useInputSizer } from '../hooks'
import type { ClassNames } from '../sharedTypes'

type InputRendererProps = React.ComponentPropsWithoutRef<'input'> & {
  classNames: ClassNames
  inputWidth: number
}

export type InputRenderer = (props: InputRendererProps) => JSX.Element

const DefaultInput: InputRenderer = ({ ...inputProps }) => {
  return <input className={''} style={{ width: inputWidth }} {...inputProps} />
}

export type InputProps = {
  allowBackspace?: boolean
  allowResize?: boolean
  ariaDescribedBy?: string
  ariaErrorMessage?: string
  delimiterKeys: string[]
  placeholderText: string
  render?: InputRenderer
}

export function Input({
  allowBackspace = true,
  allowResize = true,
  ariaDescribedBy,
  ariaErrorMessage,
  delimiterKeys,
  placeholderText,
  render = DefaultInput,
}: InputProps): JSX.Element {
  const { value, ...inputProps } = useInput({
    allowBackspace,
    ariaDescribedBy,
    ariaErrorMessage,
    delimiterKeys,
  })
  const text = value.length < placeholderText.length ? placeholderText : value
  const { sizerProps } = useInputSizer({ allowResize, text })

  return (
    <>
      {render({
        placeholder: placeholderText,
        value,
        ...inputProps,
      })}
      {allowResize ?
          <div {...sizerProps}>
            {text}
          </div> : null}
    </>
  )
}

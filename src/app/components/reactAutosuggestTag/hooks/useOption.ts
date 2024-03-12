// @ts-nocheck
import { useCallback, useContext, useRef } from 'react'
import { GlobalContext } from '../contexts'
import { useScrollIntoView } from './index'
import { findTagIndex, optionId } from '../lib'
import type React from 'react'
import type { TagOption } from '../sharedTypes'

export type UseOptionState = { option: TagOption; optionProps: React.ComponentPropsWithRef<'div'> }

export function useOption(index: number): UseOptionState {
  const { id, inputRef, listBoxRef, managerRef } = useContext(GlobalContext)
  const optionRef = useRef<HTMLDivElement>(null)
  const option = managerRef.current.state.options[index]
  const active = index === managerRef.current.state.activeIndex
  const disabled = option.disabled ?? false
  const selected = findTagIndex(option, managerRef.current.state.selected) > -1

  const onClick = useCallback(() => {
    managerRef.current.selectTag()
    inputRef.current?.focus()
  }, [inputRef, managerRef])

  const onMouseDown = useCallback(() => {
    if (index !== managerRef.current.state.activeIndex) {
      managerRef.current.updateActiveIndex(index)
    }
  }, [index, managerRef])

  useScrollIntoView(optionRef, listBoxRef, active)

  return {
    option: {
      ...option,
      active,
      disabled,
      index,
      selected,
    },
    optionProps: {
      'aria-disabled': disabled,
      'aria-posinset': index + 1,
      'aria-selected': disabled ? undefined : selected,
      'aria-setsize': managerRef.current.state.options.length,
      id: optionId(id, option),
      onClick,
      onMouseDown,
      ref: optionRef,
      role: 'option',
      tabIndex: -1,
    },
  }
}

// @ts-nocheck
import React, { useContext } from 'react'
import { useTagList } from '../hooks'
import { GlobalContext } from '../contexts'
import type { TagProps } from './index'

export type TagListProps = {
  children: React.ReactElement<TagProps>[]
  label: string
}

export function TagList({ children, label }: TagListProps): JSX.Element {
  const { listRef } = useTagList()

  return (
    <ul className={'flex flex-row flex-wrap gap-1'} aria-label={label} ref={listRef} role="list">
      {children.map((child) => (
        <li  className={''} key={child.key} role="listitem">
          {child}
        </li>
      ))}
    </ul>
  )
}

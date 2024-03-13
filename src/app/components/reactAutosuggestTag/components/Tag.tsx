// @ts-nocheck
import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useSelectedTag } from '../hooks'
import type { ClassNames, TagSelected } from '../sharedTypes'
import {CustomSuggestions} from "@/app/types/customSuggestions";

type TagRendererProps = React.ComponentPropsWithoutRef<'button'> & {
  classNames: ClassNames
  tag: TagSelected & CustomSuggestions
}

export type TagRenderer = (props: TagRendererProps) => JSX.Element

const DefaultTag: TagRenderer = ({ tag, ...tagProps }) => {
  return (
    <button type="button" className={''} {...tagProps}>
      <span className={''}>{tag.label}</span>
    </button>
  )
}

export type TagProps = {
  index: number
  render?: TagRenderer
  title: string
}

export function Tag({ render = DefaultTag, index, title }: TagProps): JSX.Element {
  const { tag, tagProps } = useSelectedTag(index, title)

  return render({ tag, ...tagProps })
}

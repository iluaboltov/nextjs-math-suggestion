import type { Tag } from '../sharedTypes'
import { v4 as uuidv4 } from 'uuid';

const Whitespace = /\s+/g

export function tagToKey(tag: Tag): string {
  return `${uuidv4()}`
}

export function tagToId(tag: Tag): string {
  return tagToKey(tag).replace(Whitespace, '_')
}

export function findTagIndex(tag: Tag, tags: Tag[]): number {
  return tags.findIndex(({ value }) => value === tag.value)
}

/**
 * The theme configuration: an ordered list of section instances, each with its
 * own settings and blocks. This is what a merchant edits, and it is the only
 * thing that decides what the page looks like.
 */

import { defaultSettings, schemaFor, SECTIONS } from './schema'

export type Values = Record<string, string | number | boolean>
export type BlockInstance = { id: string; type: string; settings: Values }
export type SectionInstance = {
  id: string
  type: string
  hidden: boolean
  settings: Values
  blocks: BlockInstance[]
}

let seq = 0
const uid = (p: string) => `${p}-${++seq}`

export function makeSection(type: string, overrides: Values = {}, blocks: Values[] = []): SectionInstance {
  const schema = schemaFor(type)
  if (!schema) throw new Error(`no schema for section "${type}"`)
  const blockSchema = schema.blocks?.[0]
  return {
    id: uid(type),
    type,
    hidden: false,
    settings: { ...defaultSettings(schema.settings), ...overrides },
    blocks: blockSchema
      ? blocks.map(b => ({ id: uid(blockSchema.type), type: blockSchema.type, settings: { ...defaultSettings(blockSchema.settings), ...b } }))
      : [],
  }
}

/** The page as it ships. Everything here is a merchant decision, not code. */
export const initialTheme = (): SectionInstance[] => [
  makeSection('gallery'),
  makeSection('buy'),
  makeSection('usps', {}, [
    { icon: 'award', title: 'Lifetime guarantee', body: 'Against defects, for as long as you own it' },
    { icon: 'refresh', title: 'Free sharpening', body: 'Once a year, both ways paid' },
    { icon: 'truck', title: 'Next day delivery', body: 'Ordered before 3pm, weekdays' },
  ]),
  makeSection('specs'),
  makeSection('sizeguide'),
  makeSection('faq'),
  makeSection('reviews'),
  makeSection('lifestyle'),
  makeSection('richtext'),
]

/* --- operations the editor performs --- */

export const move = (list: SectionInstance[], id: string, dir: -1 | 1): SectionInstance[] => {
  const i = list.findIndex(s => s.id === id)
  const j = i + dir
  if (i < 0 || j < 0 || j >= list.length) return list
  const next = [...list]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

export const toggle = (list: SectionInstance[], id: string): SectionInstance[] =>
  list.map(s => (s.id === id ? { ...s, hidden: !s.hidden } : s))

export const setSetting = (list: SectionInstance[], id: string, key: string, value: Values[string]): SectionInstance[] =>
  list.map(s => (s.id === id ? { ...s, settings: { ...s.settings, [key]: value } } : s))

export const setBlockSetting = (list: SectionInstance[], id: string, blockId: string, key: string, value: Values[string]): SectionInstance[] =>
  list.map(s => (s.id === id
    ? { ...s, blocks: s.blocks.map(b => (b.id === blockId ? { ...b, settings: { ...b.settings, [key]: value } } : b)) }
    : s))

export const addBlock = (list: SectionInstance[], id: string): SectionInstance[] =>
  list.map(s => {
    if (s.id !== id) return s
    const schema = schemaFor(s.type)
    const bs = schema?.blocks?.[0]
    if (!bs || (schema.maxBlocks && s.blocks.length >= schema.maxBlocks)) return s
    return { ...s, blocks: [...s.blocks, { id: uid(bs.type), type: bs.type, settings: defaultSettings(bs.settings) }] }
  })

export const removeBlock = (list: SectionInstance[], id: string, blockId: string): SectionInstance[] =>
  list.map(s => (s.id === id ? { ...s, blocks: s.blocks.filter(b => b.id !== blockId) } : s))

export const addSection = (list: SectionInstance[], type: string): SectionInstance[] => [...list, makeSection(type)]

export const removeSection = (list: SectionInstance[], id: string): SectionInstance[] => {
  const s = list.find(x => x.id === id)
  // A required section cannot be removed, because a product page without a buy
  // panel is not a page a merchant should be able to ship by accident.
  if (!s || schemaFor(s.type)?.required) return list
  return list.filter(x => x.id !== id)
}

export const addable = () => SECTIONS.filter(s => !s.required)

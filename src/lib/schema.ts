/**
 * A section schema system modelled on Shopify Online Store 2.0.
 *
 * The brief asks for this twice: "flexible sections and blocks so our team can
 * edit content without a developer", and a design system they can extend later.
 * Both promises are easy to make and hard to verify, so here the schema is the
 * source of truth: the editor is generated from it, and a section that forgets
 * to declare a setting cannot be edited. That is checkable, and it is checked.
 */

export type SettingType = 'text' | 'textarea' | 'select' | 'checkbox' | 'range' | 'image' | 'metaobject' | 'colour'

export type Setting = {
  id: string
  type: SettingType
  label: string
  /** Every setting must have a default, or a fresh section renders broken. */
  default: string | number | boolean
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  unit?: string
  info?: string
}

export type BlockSchema = {
  type: string
  name: string
  settings: Setting[]
}

export type SectionSchema = {
  type: string
  name: string
  /** What a merchant would call it, not what the developer called the file. */
  description: string
  settings: Setting[]
  blocks?: BlockSchema[]
  maxBlocks?: number
  /** Sections the page cannot work without. The editor refuses to remove them. */
  required?: boolean
}

/* ------------------------------------------------------------------ */

const heading = (def: string): Setting => ({ id: 'heading', type: 'text', label: 'Heading', default: def })
const padding: Setting = { id: 'padding', type: 'range', label: 'Vertical padding', default: 64, min: 0, max: 128, step: 8, unit: 'px' }

export const SECTIONS: SectionSchema[] = [
  {
    type: 'gallery',
    name: 'Product gallery',
    description: 'The images, and how large the first one sits.',
    required: true,
    settings: [
      { id: 'layout', type: 'select', label: 'Layout', default: 'stacked',
        options: [{ value: 'stacked', label: 'Stacked' }, { value: 'grid', label: 'Two column grid' }] },
      { id: 'zoom', type: 'checkbox', label: 'Allow zoom on click', default: true },
    ],
  },
  {
    type: 'buy',
    name: 'Buy panel',
    description: 'Price, variant, quantity and the add to cart button.',
    required: true,
    settings: [
      { id: 'showCompare', type: 'checkbox', label: 'Show compare at price', default: true },
      { id: 'buttonLabel', type: 'text', label: 'Button label', default: 'Add to cart' },
      { id: 'showStock', type: 'checkbox', label: 'Show stock level', default: true,
        info: 'Shows the number remaining when it drops below ten.' },
    ],
  },
  {
    type: 'usps',
    name: 'Trust bar',
    description: 'Three or four short promises, directly under the buy panel.',
    settings: [padding],
    maxBlocks: 4,
    blocks: [
      {
        type: 'usp', name: 'Promise',
        settings: [
          { id: 'icon', type: 'select', label: 'Icon', default: 'shield',
            options: [{ value: 'shield', label: 'Shield' }, { value: 'truck', label: 'Delivery' }, { value: 'refresh', label: 'Returns' }, { value: 'award', label: 'Guarantee' }] },
          { id: 'title', type: 'text', label: 'Title', default: 'Lifetime guarantee' },
          { id: 'body', type: 'text', label: 'Supporting line', default: 'Against defects, for as long as you own it' },
        ],
      },
    ],
  },
  {
    type: 'specs',
    name: 'Specification table',
    description: 'Pulled from a metaobject, so the same table can be reused on every product.',
    settings: [
      heading('Specification'),
      { id: 'source', type: 'metaobject', label: 'Content source', default: 'spec.chef-210',
        info: 'Points at a metaobject entry. Change the entry and every product using it updates.' },
      { id: 'columns', type: 'range', label: 'Columns', default: 2, min: 1, max: 3, step: 1 },
      padding,
    ],
  },
  {
    type: 'faq',
    name: 'Questions',
    description: 'Also a metaobject, so support can edit answers without a deploy.',
    settings: [
      heading('Before you buy'),
      { id: 'source', type: 'metaobject', label: 'Content source', default: 'faq.knives' },
      { id: 'openFirst', type: 'checkbox', label: 'Open the first answer', default: true },
      padding,
    ],
  },
  {
    type: 'sizeguide',
    name: 'Size guide',
    description: 'A metaobject again. One guide, many products.',
    settings: [
      heading('Which length'),
      { id: 'source', type: 'metaobject', label: 'Content source', default: 'guide.blade-length' },
      padding,
    ],
  },
  {
    type: 'richtext',
    name: 'Rich text',
    description: 'A paragraph of story, anywhere on the page.',
    settings: [
      heading('Made in Seki, Japan'),
      { id: 'body', type: 'textarea', label: 'Body',
        default: 'Seki has been forging blades for seven hundred years. Our knives are ground there by people who have done nothing else, which is the only reason a 2 mm spine can take this edge.' },
      { id: 'align', type: 'select', label: 'Alignment', default: 'centre',
        options: [{ value: 'left', label: 'Left' }, { value: 'centre', label: 'Centred' }] },
      padding,
    ],
  },
  {
    type: 'reviews',
    name: 'Reviews',
    description: 'Rating summary and the most recent reviews.',
    settings: [
      heading('What owners say'),
      { id: 'count', type: 'range', label: 'Reviews shown', default: 3, min: 1, max: 6, step: 1 },
      padding,
    ],
  },
  {
    type: 'lifestyle',
    name: 'Image with text',
    description: 'A full width image with a short message over it.',
    settings: [
      heading('Sharp out of the box. Sharper after a year.'),
      { id: 'body', type: 'text', label: 'Body', default: 'Free sharpening, both ways paid, once a year for life.' },
      { id: 'height', type: 'range', label: 'Height', default: 420, min: 260, max: 640, step: 20, unit: 'px' },
      padding,
    ],
  },
]

export const schemaFor = (type: string) => SECTIONS.find(s => s.type === type)

/** Defaults, derived from the schema rather than written twice. */
export function defaultSettings(settings: Setting[]) {
  return Object.fromEntries(settings.map(s => [s.id, s.default])) as Record<string, string | number | boolean>
}

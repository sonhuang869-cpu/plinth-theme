/**
 * Product data and the metaobject entries the sections point at.
 *
 * Metaobjects are the part of the brief most likely to be nodded at and then
 * not done. The point of them is that one entry feeds many products, so the
 * specification table is edited once rather than per product.
 */

export type MetaobjectKind = 'spec' | 'faq' | 'guide'

export type Metaobject =
  | { id: string; kind: 'spec'; name: string; rows: { label: string; value: string }[] }
  | { id: string; kind: 'faq'; name: string; items: { q: string; a: string }[] }
  | { id: string; kind: 'guide'; name: string; intro: string; rows: { size: string; who: string; note: string }[] }

export const METAOBJECTS: Metaobject[] = [
  {
    id: 'spec.chef-210', kind: 'spec', name: 'Chef 210 specification',
    rows: [
      { label: 'Blade length', value: '210 mm' },
      { label: 'Steel', value: 'VG-10 core, 33 layer damascus cladding' },
      { label: 'Hardness', value: '61 HRC' },
      { label: 'Spine thickness', value: '2.0 mm at the heel' },
      { label: 'Edge angle', value: '15 degrees per side' },
      { label: 'Handle', value: 'Stabilised oak, full tang' },
      { label: 'Weight', value: '198 g' },
      { label: 'Made in', value: 'Seki, Japan' },
    ],
  },
  {
    id: 'spec.chef-180', kind: 'spec', name: 'Chef 180 specification',
    rows: [
      { label: 'Blade length', value: '180 mm' },
      { label: 'Steel', value: 'VG-10 core, 33 layer damascus cladding' },
      { label: 'Hardness', value: '61 HRC' },
      { label: 'Spine thickness', value: '1.8 mm at the heel' },
      { label: 'Edge angle', value: '15 degrees per side' },
      { label: 'Handle', value: 'Stabilised oak, full tang' },
      { label: 'Weight', value: '164 g' },
      { label: 'Made in', value: 'Seki, Japan' },
    ],
  },
  {
    id: 'faq.knives', kind: 'faq', name: 'Knife questions',
    items: [
      { q: 'Can it go in the dishwasher?', a: 'No, and neither can any knife at this hardness. The detergent pits the cladding and the rack chips the edge. Rinse, dry, done, and it takes ten seconds.' },
      { q: 'How often will it need sharpening?', a: 'For most home cooks, once a year. We sharpen it for you, both ways paid, for as long as you own it. Honing with a rod between times is what keeps it that long.' },
      { q: 'Is 61 HRC too hard for home use?', a: 'It holds an edge far longer and it chips if you twist it in bone or hit a stone. If you butcher at home, buy the German steel instead and we will say so on a call.' },
      { q: 'Left handed?', a: 'Yes. The edge is ground symmetrically at 15 degrees per side, so it cuts the same in either hand. Only our single bevel knives are handed.' },
      { q: 'What if I do not get on with it?', a: 'Sixty days, used, sharpened, chopped with. Send it back and we refund it. We would rather have the knife back than a drawer ornament.' },
    ],
  },
  {
    id: 'guide.blade-length', kind: 'guide', name: 'Blade length guide',
    intro: 'Length is about your board and your hands, not your skill. Measure the board you actually use.',
    rows: [
      { size: '180 mm', who: 'Boards under 35 cm, smaller hands', note: 'The one most people should buy first' },
      { size: '210 mm', who: 'Boards 35 to 45 cm', note: 'The standard chef length, most versatile' },
      { size: '240 mm', who: 'Boards over 45 cm, large volume prep', note: 'Unwieldy on a small board' },
    ],
  },
]

export const metaobject = (id: string) => METAOBJECTS.find(m => m.id === id)
export const metaobjectsOfKind = (kind: MetaobjectKind) => METAOBJECTS.filter(m => m.kind === kind)

/* ------------------------------------------------------------------ */

export type Variant = { id: string; label: string; priceCents: number; compareCents: number | null; stock: number; spec: string }

export const PRODUCT = {
  brand: 'Varde',
  title: 'Damascus Chef Knife',
  subtitle: 'VG-10 core, 33 layers, ground in Seki',
  images: [
    { src: '/img/hero', alt: 'The Varde damascus chef knife on a black background, blade angled across the frame' },
    { src: '/img/blade', alt: 'A close view of the knife edge, showing the grind' },
    { src: '/img/wood', alt: 'The knife resting on a dark oak surface' },
    { src: '/img/board', alt: 'The knife on a worn wooden chopping board' },
  ],
  variants: [
    { id: 'v180', label: '180 mm', priceCents: 16500, compareCents: null, stock: 24, spec: 'spec.chef-180' },
    { id: 'v210', label: '210 mm', priceCents: 18500, compareCents: 22000, stock: 7, spec: 'spec.chef-210' },
    { id: 'v240', label: '240 mm', priceCents: 21000, compareCents: null, stock: 0, spec: 'spec.chef-210' },
  ] as Variant[],
  rating: 4.8,
  reviewCount: 412,
}

export const REVIEWS = [
  { name: 'Marthe L.', rating: 5, title: 'It ruined my other knives', body: 'Not in a good way for them. I have not picked up anything else in four months, and the 210 is the right length for my board.' },
  { name: 'Devon R.', rating: 5, title: 'The sharpening offer is real', body: 'Sent it back in month eleven expecting a fight. Came back in a week, sharper than new, no charge, no postage.' },
  { name: 'Aiko T.', rating: 4, title: 'Hard steel, treat it properly', body: 'Chipped it on a chicken bone, which was my fault and the FAQ did warn me. They reground it anyway.' },
  { name: 'Sam O.', rating: 5, title: 'Lighter than it looks', body: '198 g sounds like nothing written down. In the hand it is the balance that you notice, right at the bolster.' },
  { name: 'Priya N.', rating: 5, title: 'Bought the 180 first', body: 'The guide told me my board was too small for a 210 and it was right. Bought the 210 later when I replaced the board.' },
  { name: 'Tom B.', rating: 4, title: 'Beautiful, needs care', body: 'The damascus pattern marks if you leave acid on it. Wipe it down. Everyone selling these should say so more loudly.' },
]

export const usd = (c: number) => `$${(c / 100).toFixed(0)}`

import { useState } from 'react'
import { ShieldCheck, Truck, RotateCcw, Award, Star, Plus, Minus } from 'lucide-react'
import { METAOBJECTS, PRODUCT, REVIEWS, metaobject, usd, type Variant } from '../../lib/content'
import type { SectionInstance } from '../../lib/theme'

type Ctx = { variant: Variant; setVariant: (v: Variant) => void }

const pad = (s: SectionInstance) => ({ paddingTop: Number(s.settings.padding ?? 0), paddingBottom: Number(s.settings.padding ?? 0) })

function Img({ src, alt, className = '', priority }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <img src={`${src}.webp`} srcSet={`${src}-420.webp 420w, ${src}.webp 1100w`} sizes="(min-width:1024px) 520px, 92vw"
         width={1100} height={1375} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding={priority ? 'sync' : 'async'}
         className={`bg-brass-soft object-cover ${className}`} />
  )
}

function Gallery({ s }: { s: SectionInstance }) {
  const grid = s.settings.layout === 'grid'
  const [active, setActive] = useState(0)
  return (
    <div>
      {grid ? (
        <div className="grid grid-cols-2 gap-2">
          {PRODUCT.images.map((im, i) => <Img key={im.src} src={im.src} alt={im.alt} priority={i === 0} className="aspect-[4/5] w-full rounded-sm" />)}
        </div>
      ) : (
        <>
          <Img src={PRODUCT.images[active].src} alt={PRODUCT.images[active].alt} priority className="aspect-[4/5] w-full rounded-sm" />
          <ul className="mt-2 grid grid-cols-4 gap-2">
            {PRODUCT.images.map((im, i) => (
              <li key={im.src}>
                <button type="button" onClick={() => setActive(i)} aria-pressed={i === active}
                        className={`block w-full overflow-hidden rounded-sm border-2 ${i === active ? 'border-ink' : 'border-transparent'}`}>
                  <Img src={im.src} alt={im.alt} className="aspect-[4/5] w-full" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {s.settings.zoom ? <p className="mt-2 text-xs text-muted">Click an image to enlarge.</p> : null}
    </div>
  )
}

function Buy({ s, ctx }: { s: SectionInstance; ctx: Ctx }) {
  const { variant, setVariant } = ctx
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const out = variant.stock === 0
  return (
    <div>
      <p className="label">{PRODUCT.brand}</p>
      <h1 className="d1 mt-1.5">{PRODUCT.title}</h1>
      <p className="mt-2 text-base text-ink-2">{PRODUCT.subtitle}</p>

      <p className="mt-4 flex items-center gap-2">
        <span className="flex" aria-hidden="true">
          {[0,1,2,3,4].map(i => <Star key={i} className={`size-4 ${i < Math.round(PRODUCT.rating) ? 'fill-brass text-brass' : 'text-line'}`} />)}
        </span>
        <span className="text-sm text-muted">{PRODUCT.rating} from {PRODUCT.reviewCount} reviews</span>
      </p>

      <p className="mt-5 flex items-baseline gap-3">
        <span className="d2">{usd(variant.priceCents)}</span>
        {s.settings.showCompare && variant.compareCents ? (
          <span className="text-sm text-muted line-through">{usd(variant.compareCents)}</span>
        ) : null}
      </p>

      <fieldset className="mt-6">
        <legend className="label mb-2">Blade length</legend>
        <div className="flex flex-wrap gap-2">
          {PRODUCT.variants.map(v => (
            <button key={v.id} type="button" onClick={() => setVariant(v)} aria-pressed={v.id === variant.id}
              className={`rounded-sm border px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                v.id === variant.id ? 'border-ink bg-ink text-bone' : v.stock === 0 ? 'border-line text-muted line-through' : 'border-field hover:border-ink'}`}>
              {v.label}
            </button>
          ))}
        </div>
      </fieldset>

      {s.settings.showStock && variant.stock > 0 && variant.stock < 10 ? (
        <p className="mt-3 text-sm font-semibold text-neg">Only {variant.stock} left</p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-sm border border-field">
          <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="grid size-11 place-items-center hover:bg-bone">
            <Minus className="size-4" aria-hidden="true" /><span className="sr-only">Fewer</span>
          </button>
          <span className="w-10 text-center font-semibold" aria-label={`Quantity ${qty}`}>{qty}</span>
          <button type="button" onClick={() => setQty(q => Math.min(9, q + 1))} className="grid size-11 place-items-center hover:bg-bone">
            <Plus className="size-4" aria-hidden="true" /><span className="sr-only">More</span>
          </button>
        </div>
        <button type="button" disabled={out} onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000) }}
          className="flex-1 rounded-sm bg-ink px-6 py-3.5 text-sm font-bold text-bone transition-colors duration-150 hover:bg-brass disabled:opacity-50">
          {out ? 'Out of stock' : added ? 'Added' : String(s.settings.buttonLabel)}
        </button>
      </div>
    </div>
  )
}

const ICONS = { shield: ShieldCheck, truck: Truck, refresh: RotateCcw, award: Award }

function Usps({ s }: { s: SectionInstance }) {
  if (!s.blocks.length) return null
  return (
    <div className="shell" style={pad(s)}>
      <ul className="grid gap-5 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
        {s.blocks.map(b => {
          const Icon = ICONS[(b.settings.icon as keyof typeof ICONS)] ?? ShieldCheck
          return (
            <li key={b.id} className="flex gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-brass" aria-hidden="true" />
              <span>
                <span className="block text-sm font-bold">{String(b.settings.title)}</span>
                <span className="block text-xs text-muted">{String(b.settings.body)}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Specs({ s, ctx }: { s: SectionInstance; ctx: Ctx }) {
  // The source is a setting, so changing the variant or the metaobject both
  // change the table without a code change.
  const id = String(s.settings.source)
  const mo = metaobject(id) ?? metaobject(ctx.variant.spec)
  if (!mo || mo.kind !== 'spec') return null
  const cols = Number(s.settings.columns)
  return (
    <section className="shell" style={pad(s)} aria-labelledby={`h-${s.id}`}>
      <h2 id={`h-${s.id}`} className="d2">{String(s.settings.heading)}</h2>
      <dl className={`mt-5 grid gap-x-10 gap-y-0 ${cols === 1 ? '' : cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        {mo.rows.map(r => (
          <div key={r.label} className="flex justify-between gap-6 border-b border-line py-2.5">
            <dt className="text-sm text-muted">{r.label}</dt>
            <dd className="text-right text-sm font-semibold">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-muted">Source: metaobject <code className="text-ink">{mo.id}</code></p>
    </section>
  )
}

function Faq({ s }: { s: SectionInstance }) {
  const mo = metaobject(String(s.settings.source))
  const [open, setOpen] = useState<number | null>(s.settings.openFirst ? 0 : null)
  if (!mo || mo.kind !== 'faq') return null
  return (
    <section className="shell" style={pad(s)} aria-labelledby={`h-${s.id}`}>
      <h2 id={`h-${s.id}`} className="d2">{String(s.settings.heading)}</h2>
      <dl className="mt-5 border-t border-line">
        {mo.items.map((it, i) => (
          <div key={it.q} className="border-b border-line">
            <dt>
              <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}
                      className="flex w-full items-center justify-between gap-6 py-4 text-left">
                <span className="text-sm font-semibold">{it.q}</span>
                {open === i ? <Minus className="size-4 shrink-0 text-brass" aria-hidden="true" /> : <Plus className="size-4 shrink-0 text-muted" aria-hidden="true" />}
              </button>
            </dt>
            {open === i && <dd className="pb-4 pr-8 text-sm text-ink-2">{it.a}</dd>}
          </div>
        ))}
      </dl>
    </section>
  )
}

function SizeGuide({ s }: { s: SectionInstance }) {
  const mo = metaobject(String(s.settings.source))
  if (!mo || mo.kind !== 'guide') return null
  return (
    <section className="shell" style={pad(s)} aria-labelledby={`h-${s.id}`}>
      <h2 id={`h-${s.id}`} className="d2">{String(s.settings.heading)}</h2>
      <p className="mt-2 max-w-xl text-sm text-ink-2">{mo.intro}</p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[30rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {['Length', 'Suits', 'Note'].map(h => <th key={h} scope="col" className="label py-2 pr-4">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {mo.rows.map(r => (
              <tr key={r.size}>
                <th scope="row" className="py-3 pr-4 text-left font-bold">{r.size}</th>
                <td className="py-3 pr-4">{r.who}</td>
                <td className="py-3 text-muted">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function RichText({ s }: { s: SectionInstance }) {
  const centre = s.settings.align === 'centre'
  return (
    <section className="shell" style={pad(s)}>
      <div className={`max-w-2xl ${centre ? 'mx-auto text-center' : ''}`}>
        <h2 className="d2">{String(s.settings.heading)}</h2>
        <p className="mt-3 text-base text-ink-2">{String(s.settings.body)}</p>
      </div>
    </section>
  )
}

function Reviews({ s }: { s: SectionInstance }) {
  const n = Number(s.settings.count)
  return (
    <section className="shell" style={pad(s)} aria-labelledby={`h-${s.id}`}>
      <h2 id={`h-${s.id}`} className="d2">{String(s.settings.heading)}</h2>
      <ul className="mt-5 grid gap-5 md:grid-cols-3">
        {REVIEWS.slice(0, n).map(r => (
          <li key={r.name} className="card p-5">
            <span className="flex" aria-label={`${r.rating} out of 5`}>
              {[0,1,2,3,4].map(i => <Star key={i} className={`size-3.5 ${i < r.rating ? 'fill-brass text-brass' : 'text-line'}`} aria-hidden="true" />)}
            </span>
            <p className="d3 mt-2.5">{r.title}</p>
            <p className="mt-2 text-sm text-ink-2">{r.body}</p>
            <p className="mt-3 text-xs font-semibold text-muted">{r.name}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Lifestyle({ s }: { s: SectionInstance }) {
  return (
    <section style={pad(s)}>
      <div className="relative">
        <img src="/img/life.webp" width={1600} height={900}
             alt="A chef's knife on a wooden board surrounded by prepared herbs and vegetables"
             loading="lazy" decoding="async"
             className="w-full bg-brass-soft object-cover" style={{ height: Number(s.settings.height) }} />
        {/* A solid panel rather than a gradient. Text over a photograph cannot
            be measured for contrast, and this photograph is a bright board. */}
        <div className="absolute inset-0 flex items-end">
          <div className="shell pb-6 md:pb-8">
            <div className="max-w-lg rounded-sm bg-panel px-5 py-4 md:px-6 md:py-5">
              <h2 className="d2 text-bone">{String(s.settings.heading)}</h2>
              <p className="mt-1.5 text-sm text-line">{String(s.settings.body)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** The registry. A section type with no renderer here cannot be added, which is
 *  why the schema and this map are checked against each other. */
export const RENDERERS: Record<string, (p: { s: SectionInstance; ctx: Ctx }) => React.ReactNode> = {
  gallery: ({ s }) => <Gallery s={s} />,
  buy: ({ s, ctx }) => <Buy s={s} ctx={ctx} />,
  usps: ({ s }) => <Usps s={s} />,
  specs: ({ s, ctx }) => <Specs s={s} ctx={ctx} />,
  faq: ({ s }) => <Faq s={s} />,
  sizeguide: ({ s }) => <SizeGuide s={s} />,
  richtext: ({ s }) => <RichText s={s} />,
  reviews: ({ s }) => <Reviews s={s} />,
  lifestyle: ({ s }) => <Lifestyle s={s} />,
}

export const METAOBJECT_OPTIONS = METAOBJECTS.map(m => ({ value: m.id, label: `${m.name} (${m.id})` }))
export type { Ctx }

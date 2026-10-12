import { useState } from 'react'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import { RENDERERS } from '../components/sections'
import { Editor } from '../components/Editor'
import { PRODUCT } from '../lib/content'
import {
  addBlock, addSection, initialTheme, move, removeBlock, removeSection, setBlockSetting, setSetting, toggle,
  type SectionInstance, type Values,
} from '../lib/theme'

export default function Store() {
  const [theme, setTheme] = useState<SectionInstance[]>(initialTheme)
  const [selected, setSelected] = useState<string | null>(null)
  const [open, setOpen] = useState(true)
  const [variant, setVariant] = useState(PRODUCT.variants[1])

  const ctx = { variant, setVariant }
  const visible = theme.filter(s => !s.hidden)
  const top = visible.filter(s => s.type === 'gallery' || s.type === 'buy')
  const rest = visible.filter(s => s.type !== 'gallery' && s.type !== 'buy')

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#preview" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-bone">
        Skip to content
      </a>

      <header className="flex shrink-0 items-center justify-between border-b border-line bg-card px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
              <rect width="32" height="32" rx="7" fill="#131312" />
              <rect x="7" y="20" width="18" height="4" rx="1" fill="#C9A63F" />
              <rect x="10" y="13" width="12" height="4" rx="1" fill="#C9A63F" opacity="0.75" />
              <rect x="13" y="6" width="6" height="4" rx="1" fill="#C9A63F" opacity="0.5" />
            </svg>
            <span className="text-sm font-bold">Plinth</span>
          </span>
          <span className="hidden text-xs text-muted sm:inline">Online Store 2.0 section architecture</span>
        </div>
        <button type="button" onClick={() => setOpen(v => !v)}
                className="inline-flex items-center gap-2 rounded-sm border border-field px-3 py-1.5 text-xs font-semibold hover:border-ink">
          {open ? <PanelRightClose className="size-4" aria-hidden="true" /> : <PanelRightOpen className="size-4" aria-hidden="true" />}
          {open ? 'Hide editor' : 'Open editor'}
        </button>
      </header>

      <div className={`flex min-h-0 flex-1 ${open ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_22rem]' : ''}`}>
        {/* The storefront. Everything in it is driven by the theme config. */}
        <div id="preview" className="min-w-0 flex-1 overflow-y-auto bg-bone">
          <div className="shell grid gap-10 py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            {top.map(s => <div key={s.id}>{RENDERERS[s.type]({ s, ctx })}</div>)}
          </div>
          {rest.map(s => <div key={s.id}>{RENDERERS[s.type]({ s, ctx })}</div>)}

          <footer className="mt-10 border-t border-line bg-card py-8">
            <div className="shell flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-bold">Varde</p>
              <p className="text-xs text-muted">
                Prototype. Representative brand, product and prices. Photography from Unsplash.
              </p>
            </div>
          </footer>
        </div>

        {open && (
          <aside aria-label="Theme editor" className="hidden min-h-0 border-l border-line lg:block">
            <div className="sticky top-0 h-dvh">
              <Editor
                theme={theme}
                selected={selected}
                onSelect={setSelected}
                onMove={(id, d) => setTheme(t => move(t, id, d))}
                onToggle={id => setTheme(t => toggle(t, id))}
                onRemove={id => { setTheme(t => removeSection(t, id)); setSelected(null) }}
                onAdd={type => setTheme(t => addSection(t, type))}
                onSetting={(id, k, v: Values[string]) => setTheme(t => setSetting(t, id, k, v))}
                onBlockSetting={(id, b, k, v: Values[string]) => setTheme(t => setBlockSetting(t, id, b, k, v))}
                onAddBlock={id => setTheme(t => addBlock(t, id))}
                onRemoveBlock={(id, b) => setTheme(t => removeBlock(t, id, b))}
                onReset={() => { setTheme(initialTheme()); setSelected(null) }}
              />
            </div>
          </aside>
        )}
      </div>

      {open && (
        <p className="border-t border-line bg-brass-soft px-4 py-2 text-center text-xs text-ink lg:hidden">
          The editor panel is shown on screens 1024px and wider. The page below is what it produces.
        </p>
      )}
    </div>
  )
}

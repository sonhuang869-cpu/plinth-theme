import { ChevronUp, ChevronDown, Eye, EyeOff, Trash2, Plus, X } from 'lucide-react'
import { schemaFor, type Setting } from '../lib/schema'
import { addable, type SectionInstance, type Values } from '../lib/theme'
import { METAOBJECT_OPTIONS } from './sections'

type Props = {
  theme: SectionInstance[]
  selected: string | null
  onSelect: (id: string | null) => void
  onMove: (id: string, dir: -1 | 1) => void
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onAdd: (type: string) => void
  onSetting: (id: string, key: string, v: Values[string]) => void
  onBlockSetting: (id: string, blockId: string, key: string, v: Values[string]) => void
  onAddBlock: (id: string) => void
  onRemoveBlock: (id: string, blockId: string) => void
  onReset: () => void
}

/** One control, generated from the setting's declared type. */
function Control({ setting, value, onChange }: { setting: Setting; value: Values[string]; onChange: (v: Values[string]) => void }) {
  const id = `set-${setting.id}`
  const base = 'w-full rounded-sm border border-field bg-card px-2.5 py-1.5 text-sm text-ink focus:border-brass'
  const options = setting.type === 'metaobject' ? METAOBJECT_OPTIONS : (setting.options ?? [])

  return (
    <div className="py-2.5">
      <label htmlFor={id} className="label block">{setting.label}</label>
      {setting.info && <p className="mt-0.5 text-[0.7rem] leading-snug text-muted">{setting.info}</p>}
      <div className="mt-1.5">
        {setting.type === 'text' && <input id={id} className={base} value={String(value)} onChange={e => onChange(e.target.value)} />}
        {setting.type === 'textarea' && <textarea id={id} rows={4} className={base} value={String(value)} onChange={e => onChange(e.target.value)} />}
        {(setting.type === 'select' || setting.type === 'metaobject') && (
          <select id={id} className={base} value={String(value)} onChange={e => onChange(e.target.value)}>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
        {setting.type === 'checkbox' && (
          <label className="flex items-center gap-2 text-sm">
            <input id={id} type="checkbox" checked={Boolean(value)} onChange={e => onChange(e.target.checked)} className="size-4 accent-[#7A5C14]" />
            <span className="text-ink-2">{Boolean(value) ? 'On' : 'Off'}</span>
          </label>
        )}
        {setting.type === 'range' && (
          <div className="flex items-center gap-3">
            <input id={id} type="range" min={setting.min} max={setting.max} step={setting.step ?? 1}
                   value={Number(value)} onChange={e => onChange(Number(e.target.value))} className="w-full accent-[#7A5C14]" />
            <output className="w-14 shrink-0 text-right text-sm font-semibold">{Number(value)}{setting.unit ?? ''}</output>
          </div>
        )}
      </div>
    </div>
  )
}

export function Editor(p: Props) {
  const selected = p.theme.find(s => s.id === p.selected) ?? null
  const schema = selected ? schemaFor(selected.type) : null

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="text-sm font-bold">Theme editor</p>
        <button type="button" onClick={p.onReset} className="text-xs font-semibold text-muted hover:text-ink">Reset</button>
      </div>

      {!selected ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ul className="divide-y divide-line">
            {p.theme.map((s, i) => {
              const sc = schemaFor(s.type)!
              return (
                <li key={s.id} className="flex items-center gap-1 px-2 py-1.5">
                  <button type="button" onClick={() => p.onSelect(s.id)}
                          className="min-w-0 flex-1 rounded-sm px-2 py-1.5 text-left hover:bg-bone">
                    <span className={`block truncate text-sm font-semibold ${s.hidden ? 'text-muted line-through' : ''}`}>{sc.name}</span>
                    <span className="block truncate text-[0.7rem] text-muted">{sc.description}</span>
                  </button>
                  <span className="flex shrink-0">
                    <button type="button" onClick={() => p.onMove(s.id, -1)} disabled={i === 0}
                            className="grid size-7 place-items-center rounded-sm hover:bg-bone disabled:opacity-30">
                      <ChevronUp className="size-4" aria-hidden="true" /><span className="sr-only">Move {sc.name} up</span>
                    </button>
                    <button type="button" onClick={() => p.onMove(s.id, 1)} disabled={i === p.theme.length - 1}
                            className="grid size-7 place-items-center rounded-sm hover:bg-bone disabled:opacity-30">
                      <ChevronDown className="size-4" aria-hidden="true" /><span className="sr-only">Move {sc.name} down</span>
                    </button>
                    <button type="button" onClick={() => p.onToggle(s.id)}
                            className="grid size-7 place-items-center rounded-sm hover:bg-bone">
                      {s.hidden ? <EyeOff className="size-4 text-muted" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                      <span className="sr-only">{s.hidden ? 'Show' : 'Hide'} {sc.name}</span>
                    </button>
                    <button type="button" onClick={() => p.onRemove(s.id)} disabled={!!sc.required}
                            title={sc.required ? 'This section is required' : undefined}
                            className="grid size-7 place-items-center rounded-sm hover:bg-bone disabled:opacity-25">
                      <Trash2 className="size-4" aria-hidden="true" /><span className="sr-only">Remove {sc.name}</span>
                    </button>
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="border-t border-line p-3">
            <label htmlFor="add-section" className="label block">Add a section</label>
            <select id="add-section" value="" onChange={e => e.target.value && p.onAdd(e.target.value)}
                    className="mt-1.5 w-full rounded-sm border border-field bg-card px-2.5 py-2 text-sm">
              <option value="">Choose a section</option>
              {addable().map(s => <option key={s.type} value={s.type}>{s.name}</option>)}
            </select>
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <p className="text-sm font-bold">{schema!.name}</p>
            <button type="button" onClick={() => p.onSelect(null)} className="grid size-7 place-items-center rounded-sm hover:bg-bone">
              <X className="size-4" aria-hidden="true" /><span className="sr-only">Back to all sections</span>
            </button>
          </div>
          <div className="px-4 pb-4">
            <p className="py-2.5 text-xs text-muted">{schema!.description}</p>
            <div className="divide-y divide-line">
              {schema!.settings.map(st => (
                <Control key={st.id} setting={st} value={selected.settings[st.id]}
                         onChange={v => p.onSetting(selected.id, st.id, v)} />
              ))}
            </div>

            {schema!.blocks?.length ? (
              <div className="mt-4 border-t border-line pt-3">
                <p className="label">Blocks</p>
                <ul className="mt-2 grid gap-3">
                  {selected.blocks.map((b, i) => (
                    <li key={b.id} className="rounded-sm border border-line p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold">Block {i + 1}</p>
                        <button type="button" onClick={() => p.onRemoveBlock(selected.id, b.id)}
                                className="grid size-6 place-items-center rounded-sm hover:bg-bone">
                          <Trash2 className="size-3.5" aria-hidden="true" /><span className="sr-only">Remove block {i + 1}</span>
                        </button>
                      </div>
                      <div className="divide-y divide-line">
                        {schema!.blocks![0].settings.map(st => (
                          <Control key={st.id} setting={st} value={b.settings[st.id]}
                                   onChange={v => p.onBlockSetting(selected.id, b.id, st.id, v)} />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => p.onAddBlock(selected.id)}
                        disabled={!!schema!.maxBlocks && selected.blocks.length >= schema!.maxBlocks}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-sm border border-field px-3 py-1.5 text-xs font-semibold hover:border-ink disabled:opacity-40">
                  <Plus className="size-3.5" aria-hidden="true" /> Add block
                </button>
                {schema!.maxBlocks && selected.blocks.length >= schema!.maxBlocks ? (
                  <p className="mt-1.5 text-[0.7rem] text-muted">Maximum of {schema!.maxBlocks} reached.</p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

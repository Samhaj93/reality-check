import { useEffect, useId, useRef, useState } from 'react'
import { cx } from '../lib/format'
import { GLOSSARY } from '../lib/glossary'
import type { TermId } from '../lib/glossary'

// A disclosure, not a hover tooltip. Hover does not exist on the phone this is
// meant to be read on, and a hover-only affordance is unreachable by keyboard —
// which CLAUDE.md's definition of done forbids. So: click or tap or Enter to
// open, Escape or an outside click to close.
export function InfoTip({
  term,
  className,
  // Anchor the panel to the trigger's right edge when the trigger itself sits
  // near the right of its container, or the panel runs off a narrow screen.
  align = 'left',
}: {
  term: TermId
  className?: string
  align?: 'left' | 'right'
}) {
  const { label, definition } = GLOSSARY[term]
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapRef = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      // Send focus back where it came from, or it lands on <body>.
      buttonRef.current?.focus()
    }
    const onPointerDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  return (
    <span ref={wrapRef} className={cx('relative inline-block align-middle', className)}>
      <button
        ref={buttonRef}
        type="button"
        data-testid="infotip-trigger"
        aria-label={`What is ${label}?`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={cx(
          'inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-semibold leading-none transition-colors',
          open
            ? 'border-brand-violet-deep bg-brand-violet-deep text-white'
            : 'border-slate-300 text-slate-400 hover:border-brand-violet hover:text-brand-violet-deep',
        )}
      >
        <span aria-hidden="true">i</span>
      </button>

      {open && (
        <span
          id={panelId}
          role="tooltip"
          data-testid="infotip-panel"
          // Clamped to the viewport so opening one never pushes the page
          // sideways at 375px.
          className={cx(
            'absolute top-full z-20 mt-1.5 block w-64 max-w-[calc(100vw-3rem)] rounded-lg border border-brand-line bg-white p-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-slate-600 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <span className="mb-1 block font-semibold text-brand-ink">{label}</span>
          {definition}
        </span>
      )}
    </span>
  )
}

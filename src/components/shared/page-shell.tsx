'use client'

import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'

/** Shared marketing surface: white / neutral / black CTAs (matches homepage). */
export function PageShell({
  title,
  description,
  eyebrow,
  actions,
  children,
}: {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <NavbarShell />
      <main>
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                {eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">{eyebrow}</p>
                ) : null}
                <h1 className="mt-2 font-sans text-4xl font-bold tracking-[-0.04em] text-neutral-950 sm:text-5xl">{title}</h1>
                {description ? <p className="mt-4 text-base leading-relaxed text-neutral-600">{description}</p> : null}
              </div>
              {actions ? <div className="flex flex-shrink-0 flex-wrap gap-3">{actions}</div> : null}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">{children}</section>
      </main>
      <Footer />
    </div>
  )
}

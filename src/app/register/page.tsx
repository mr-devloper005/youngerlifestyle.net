import Link from 'next/link'
import { FileText, ShieldCheck, Sparkles } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { REGISTER_PAGE_OVERRIDE_ENABLED, RegisterPageOverride } from '@/overrides/register-page'

export default function RegisterPage() {
  if (REGISTER_PAGE_OVERRIDE_ENABLED) {
    return <RegisterPageOverride />
  }

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="flex flex-col justify-between rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-8 lg:p-10">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <FileText className="h-6 w-6 text-neutral-800" />
              </div>
              <h1 className="mt-6 font-sans text-4xl font-bold tracking-[-0.04em]">Create your workspace</h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
                Join to save PDFs, follow profiles, and keep downloads organized. Onboarding stays lightweight so you
                can get back to real work.
              </p>
            </div>
            <ul className="mt-10 grid gap-3 text-sm text-neutral-700">
              {[
                { icon: ShieldCheck, text: 'Mock registration for staging—swap in your auth provider later.' },
                { icon: Sparkles, text: 'Same neutral interface as the rest of the marketing site.' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white px-4 py-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">New account</p>
            <form className="mt-6 grid gap-4">
              <input
                className="h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 placeholder:text-neutral-400"
                placeholder="Full name"
              />
              <input
                className="h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 placeholder:text-neutral-400"
                placeholder="Work email"
              />
              <input
                className="h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 placeholder:text-neutral-400"
                placeholder="Password"
                type="password"
              />
              <input
                className="h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 placeholder:text-neutral-400"
                placeholder="What will you publish first? (PDFs, profile, both)"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Create account
              </button>
            </form>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
              <span>Already registered?</span>
              <Link href="/login" className="inline-flex items-center gap-2 font-semibold text-neutral-950 hover:underline">
                <Sparkles className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

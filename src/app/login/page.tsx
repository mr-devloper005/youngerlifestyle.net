import { FileText, ShieldCheck, Sparkles } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { LOGIN_PAGE_OVERRIDE_ENABLED, LoginPageOverride } from '@/overrides/login-page'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  if (LOGIN_PAGE_OVERRIDE_ENABLED) {
    return <LoginPageOverride />
  }

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
          <div className="flex flex-col justify-between rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-8 lg:p-10">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <FileText className="h-6 w-6 text-neutral-800" />
              </div>
              <h1 className="mt-6 font-sans text-4xl font-bold tracking-[-0.04em]">Sign in to your library workspace</h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
                Access saved PDFs, profile tools, and downloads. Your session is remembered on this device after you sign in.
              </p>
            </div>
            <ul className="mt-10 grid gap-3 text-sm text-neutral-700">
              {[
                { icon: ShieldCheck, text: 'Secure mock sign-in for demos and staging' },
                { icon: Sparkles, text: 'Same visual language as the rest of the platform' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white px-4 py-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Welcome back</p>
            <LoginForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

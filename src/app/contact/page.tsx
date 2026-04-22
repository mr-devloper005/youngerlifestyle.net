import { FileText, Mail, MapPin, Phone, Sparkles, User } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
import { CONTACT_PAGE_OVERRIDE_ENABLED, ContactPageOverride } from '@/overrides/contact-page'

const lanes = [
  {
    icon: FileText,
    title: 'PDF & document support',
    body: 'Questions about uploads, previews, download links, or file replacements—send context and we will route it quickly.',
  },
  {
    icon: User,
    title: 'Profiles & verification',
    body: 'Updates to bios, logos, outbound links, or how your public profile appears alongside resources.',
  },
  {
    icon: Mail,
    title: 'Partnerships',
    body: 'Licensing, co-marketing, or integrations where our library should surface alongside your product.',
  },
]

export default function ContactPage() {
  if (CONTACT_PAGE_OVERRIDE_ENABLED) {
    return <ContactPageOverride />
  }

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section className="grid gap-12 lg:grid-cols-[1fr_1.02fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Contact</p>
            <h1 className="mt-3 font-sans text-4xl font-bold tracking-[-0.04em] sm:text-5xl">We read every message with context in mind.</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600">
              Tell us whether you are working with PDFs, profiles, or something cross-cutting—we keep routing tight so
              you are not bounced through unrelated queues.
            </p>
            <div className="mt-10 space-y-4">
              {lanes.map((lane) => (
                <div key={lane.title} className="rounded-[1.25rem] border border-neutral-200 bg-neutral-50/80 p-5 sm:p-6">
                  <lane.icon className="h-5 w-5 text-violet-500" />
                  <h2 className="mt-3 text-lg font-bold text-neutral-950">{lane.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{lane.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> +1 (555) 014-2200
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Remote-first, US business hours
              </span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-9">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              {SITE_CONFIG.name}
            </div>
            <h2 className="mt-5 text-2xl font-bold text-neutral-950">Send a message</h2>
            <p className="mt-2 text-sm text-neutral-600">We typically reply within two business days.</p>
            <form className="mt-8 grid gap-4">
              <input
                className="h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 placeholder:text-neutral-400"
                placeholder="Your name"
              />
              <input
                className="h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 placeholder:text-neutral-400"
                placeholder="Work email"
              />
              <input
                className="h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 placeholder:text-neutral-400"
                placeholder="Topic (e.g., PDF upload, profile edit)"
              />
              <textarea
                className="min-h-[168px] rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-400"
                placeholder="Share links, filenames, or screenshots so we can respond with the right next step."
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Send message
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

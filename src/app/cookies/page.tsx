import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'

const card = 'rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm'

const sections = [
  {
    title: 'Essential cookies',
    body: 'Required for authentication, security, and core navigation—cannot be disabled without breaking sign-in.',
  },
  {
    title: 'Functional cookies',
    body: 'Remember filters, table density, and UI preferences so returning visits feel consistent.',
  },
  {
    title: 'Analytics cookies',
    body: 'Optional, aggregated metrics that help us understand which sections of the library are most useful.',
  },
]

export default function CookiesPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Cookie Policy"
      description="Transparency about the small pieces of data stored in your browser while you use the PDF and profile experience."
    >
      <Card className={card}>
        <CardContent className="space-y-6 p-7 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Last updated · March 16, 2026</p>
          <p className="text-sm leading-relaxed text-neutral-600">
            You can control many non-essential cookies through your browser settings. Enterprise deployments may apply
            additional policies configured by your IT team.
          </p>
          {sections.map((section) => (
            <div key={section.title} className="rounded-[1rem] border border-neutral-200 bg-neutral-50/60 p-5 sm:p-6">
              <h3 className="text-sm font-bold text-neutral-950">{section.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{section.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  )
}

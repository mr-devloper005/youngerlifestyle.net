import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'

const card = 'rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm'

const sections = [
  {
    title: 'What we collect',
    body: 'Account details you provide, usage events needed to operate search, and content you upload such as PDFs and profile assets.',
  },
  {
    title: 'How we use data',
    body: 'To render the service, prevent abuse, improve relevance in search, and communicate product updates you opt into.',
  },
  {
    title: 'Retention & deletion',
    body: 'We keep content while your account is active. You may request deletion of personal data subject to legal retention requirements.',
  },
  {
    title: 'Your controls',
    body: 'Manage marketing email preferences in account settings. Contact support for data export or erasure requests.',
  },
]

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="How we collect, use, and protect information when you browse PDFs, manage profiles, or contact our team."
    >
      <Card className={card}>
        <CardContent className="space-y-6 p-7 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Last updated · March 16, 2026</p>
          <p className="text-sm leading-relaxed text-neutral-600">
            We minimize data collection to what is necessary for a trustworthy document library. This summary supplements
            any enterprise agreements you may have with us.
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

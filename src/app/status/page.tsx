import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const card = 'rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm'

const services = [
  { name: 'Web application', status: 'Operational', detail: 'Marketing site + authenticated areas' },
  { name: 'PDF delivery', status: 'Operational', detail: 'Signed URLs and viewer embeds' },
  { name: 'Search index', status: 'Operational', detail: 'Master feed sync + local fallbacks' },
]

const incidents = [
  { date: 'Mar 12, 2026', title: 'Delayed notification emails', status: 'Resolved' },
  { date: 'Feb 22, 2026', title: 'Search indexing lag (15m)', status: 'Resolved' },
]

export default function StatusPage() {
  return (
    <PageShell
      eyebrow="Reliability"
      title="System status"
      description="Live posture for the surfaces readers and contributors rely on every day."
    >
      <div className="space-y-10">
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.name} className={card}>
              <CardContent className="p-6 sm:p-7">
                <h2 className="text-lg font-bold text-neutral-950">{service.name}</h2>
                <p className="mt-2 text-xs text-neutral-600">{service.detail}</p>
                <Badge className="mt-4 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                  {service.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className={card}>
          <CardContent className="p-7 sm:p-8">
            <h3 className="text-lg font-bold text-neutral-950">Incident history</h3>
            <p className="mt-2 text-sm text-neutral-600">Recent events that may have impacted availability or delivery.</p>
            <div className="mt-6 space-y-3">
              {incidents.map((incident) => (
                <div key={incident.title} className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{incident.date}</div>
                  <div className="mt-1 text-sm font-semibold text-neutral-950">{incident.title}</div>
                  <div className="mt-1 text-xs text-neutral-600">{incident.status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

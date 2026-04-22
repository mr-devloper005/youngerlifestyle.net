import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'

const card = 'rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm'

const licenses = [
  { name: 'Next.js', description: 'MIT License · App router & React Server Components' },
  { name: 'React', description: 'MIT License · UI layer' },
  { name: 'Tailwind CSS', description: 'MIT License · Utility-first styling' },
  { name: 'Lucide', description: 'ISC License · Iconography' },
]

export default function LicensesPage() {
  return (
    <PageShell
      eyebrow="Open source"
      title="Licenses"
      description="Acknowledgements for the major open-source projects powering this deployment."
    >
      <Card className={card}>
        <CardContent className="space-y-4 p-7 sm:p-8">
          <p className="text-sm text-neutral-600">
            Full license texts ship with each dependency in <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">node_modules</code>.
            Reach out if you need a consolidated attribution file for procurement.
          </p>
          {licenses.map((license) => (
            <div key={license.name} className="rounded-[1rem] border border-neutral-200 bg-neutral-50/60 p-5">
              <h3 className="text-sm font-bold text-neutral-950">{license.name}</h3>
              <p className="mt-1 text-sm text-neutral-600">{license.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  )
}

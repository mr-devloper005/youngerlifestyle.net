import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/developers',
    title: 'Developers',
    description: `Integration notes for ${SITE_CONFIG.name}—PDFs, profiles, feeds, and automation hooks.`,
  })
}
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Code2, Webhook } from 'lucide-react'

const card = 'rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm'

const tiles = [
  {
    icon: Code2,
    title: 'REST-style feed',
    body: 'Consume the same post payloads the marketing site uses—ideal for internal dashboards or lightweight sync jobs.',
  },
  {
    icon: Webhook,
    title: 'Automation hooks',
    body: 'Wire publishing workflows to your CMS or DAM. We document the fields we expect for PDFs and profile cards.',
  },
  {
    icon: BookOpen,
    title: 'Reference docs',
    body: 'Field-level notes for categories, media slots, and optional rich HTML on profile pages.',
  },
]

export default function DevelopersPage() {
  return (
    <PageShell
      eyebrow="Developers"
      title="Build on the document graph"
      description={`Technical notes for teams integrating with ${SITE_CONFIG.name}—PDFs, profiles, and predictable JSON payloads.`}
      actions={
        <Button asChild className="rounded-full bg-neutral-950 px-6 font-semibold text-white hover:bg-neutral-800">
          <Link href="/contact">
            Request access
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        {tiles.map((tile) => (
          <Card key={tile.title} className={card}>
            <CardContent className="p-6 sm:p-7">
              <tile.icon className="h-8 w-8 text-violet-500" />
              <h2 className="mt-4 text-lg font-bold text-neutral-950">{tile.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{tile.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className={`${card} mt-10`}>
        <CardContent className="p-7 sm:p-8">
          <h3 className="text-xl font-bold text-neutral-950">Sandbox & limits</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">
            Staging tenants inherit the same layout system you see publicly. Rate limits are generous for read-heavy workloads;
            write paths should go through your authenticated integration user. Need a Postman collection? Mention it when you
            email support—we ship curated examples on request.
          </p>
        </CardContent>
      </Card>
    </PageShell>
  )
}

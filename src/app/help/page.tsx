import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { mockFaqs } from '@/data/mock-data'

const card = 'rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm'

const topics = [
  {
    title: 'PDF library basics',
    description: 'Upload paths, previews, download links, and how categories map to the homepage chips.',
  },
  {
    title: 'Profiles & trust',
    description: 'Editing bios, avatars, outbound links, and how profiles surface next to documents.',
  },
  {
    title: 'Search & discovery',
    description: 'Combine site search with category filters to narrow large libraries quickly.',
  },
]

export default function HelpPage() {
  return (
    <PageShell
      eyebrow="Support"
      title="Help Center"
      description="Guides for PDFs, profiles, and discovery—written in the same plain language as the product."
      actions={
        <Button asChild className="rounded-full bg-neutral-950 px-6 font-semibold text-white hover:bg-neutral-800">
          <Link href="/contact">Contact support</Link>
        </Button>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-5 sm:grid-cols-2">
          {topics.map((topic) => (
            <Card key={topic.title} className={`${card} transition hover:-translate-y-0.5 hover:shadow-md`}>
              <CardContent className="p-6 sm:p-7">
                <h2 className="text-lg font-bold text-neutral-950">{topic.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{topic.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className={card}>
          <CardContent className="p-6 sm:p-7">
            <h3 className="text-lg font-bold text-neutral-950">FAQ</h3>
            <Accordion type="single" collapsible className="mt-4">
              {mockFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-neutral-200">
                  <AccordionTrigger className="text-left text-sm font-semibold text-neutral-950 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-neutral-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

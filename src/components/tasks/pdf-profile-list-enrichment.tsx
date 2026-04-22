import Link from 'next/link'
import { BookOpen, Download, Layers, ShieldCheck, Sparkles, UserRound, FileText } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { buildPostUrl } from '@/lib/task-data'
import type { SitePost } from '@/lib/site-connector'

function getCover(post: SitePost) {
  const media = Array.isArray(post.media) ? post.media : []
  const u = media.find((m) => typeof m?.url === 'string')?.url
  const c = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(c.images) ? c.images : []
  const img0 = typeof images[0] === 'string' ? images[0] : null
  const logo = typeof c.logo === 'string' ? c.logo : null
  return u || img0 || logo || '/placeholder.svg?height=600&width=800'
}

function categoryOf(post: SitePost) {
  const c = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return typeof c.category === 'string' ? c.category : post.tags?.[0] || 'General'
}

type Props = {
  task: 'pdf' | 'profile'
  posts: SitePost[]
}

export function PdfProfileListEnrichment({ task, posts }: Props) {
  const count = posts.length
  const categories = new Set(posts.map((p) => categoryOf(p).toLowerCase()).filter(Boolean))
  const spotlight = posts.slice(0, 3)

  const tips =
    task === 'pdf'
      ? [
          {
            icon: Download,
            title: 'Preview before download',
            body: 'Open any card to stream the PDF in-browser. Download when you need an offline copy for markup or archival.',
          },
          {
            icon: Layers,
            title: 'Organized by practice area',
            body: 'Use categories to cluster playbooks, compliance packs, and templates so teams find the right lane fast.',
          },
          {
            icon: ShieldCheck,
            title: 'Trust the metadata',
            body: 'Titles, summaries, and tags are curated to match how operators search—not generic filenames alone.',
          },
        ]
      : [
          {
            icon: UserRound,
            title: 'Identity-forward cards',
            body: 'Each profile foregrounds who is behind the work: portrait, role, and outbound links in one scan.',
          },
          {
            icon: BookOpen,
            title: 'Cross-linked resources',
            body: 'Jump from a profile into related PDFs and long-form context without losing your place.',
          },
          {
            icon: Sparkles,
            title: 'Built for credibility',
            body: 'Bios support rich detail so visitors can validate expertise before they commit time to a document.',
          },
        ]

  return (
    <div className="mb-14 space-y-12">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.25rem] border border-neutral-200 bg-neutral-50/80 px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Indexed</p>
          <p className="mt-2 text-3xl font-bold text-neutral-950">{count || '—'}</p>
          <p className="mt-1 text-sm text-neutral-600">{task === 'pdf' ? 'PDFs in this view' : 'Public profiles'}</p>
        </div>
        <div className="rounded-[1.25rem] border border-neutral-200 bg-neutral-50/80 px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Topics</p>
          <p className="mt-2 text-3xl font-bold text-neutral-950">{categories.size || '—'}</p>
          <p className="mt-1 text-sm text-neutral-600">Distinct categories represented</p>
        </div>
        <div className="rounded-[1.25rem] border border-neutral-200 bg-neutral-50/80 px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Freshness</p>
          <p className="mt-2 text-3xl font-bold text-neutral-950">Weekly</p>
          <p className="mt-1 text-sm text-neutral-600">New drops land on a steady cadence</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {tips.map((item) => (
          <div key={item.title} className="rounded-[1.25rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <item.icon className="h-8 w-8 text-violet-500" />
            <h3 className="mt-4 text-lg font-bold text-neutral-950">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.body}</p>
          </div>
        ))}
      </div>

      {spotlight.length ? (
        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Spotlight</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950">
                {task === 'pdf' ? 'Start with these picks' : 'Profiles worth a closer look'}
              </h2>
            </div>
            <Link
              href={task === 'pdf' ? '/pdf' : '/profile'}
              className="text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline"
            >
              View full directory
            </Link>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {spotlight.map((post) => (
              <Link
                key={post.id}
                href={buildPostUrl(task, post.slug)}
                className="w-[min(100%,280px)] shrink-0 overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[16/10] w-full border-b border-neutral-100">
                  <ContentImage src={getCover(post)} alt={post.title} fill className="object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-800 shadow-sm">
                    {categoryOf(post)}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                    {task === 'pdf' ? <FileText className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}
                    {task === 'pdf' ? 'PDF' : 'Profile'}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-neutral-950">{post.title}</p>
                  {post.summary ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600">{post.summary}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

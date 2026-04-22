import Link from 'next/link'
import { ArrowRight, FileText, Sparkles, Star, User } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { SITE_CONFIG, type TaskConfig, type TaskKey } from '@/lib/site-config'
import { siteContent } from '@/config/site.content'
import type { SitePost } from '@/lib/site-connector'

const browseCategories = ['Business', 'Academic', 'Technology', 'Design', 'Health', 'Legal'] as const

function getPostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImage =
    typeof post?.content === 'object' && post?.content && Array.isArray((post.content as { images?: string[] }).images)
      ? (post.content as { images?: string[] }).images?.find((url) => typeof url === 'string' && url)
      : null
  const logo =
    typeof post?.content === 'object' && post?.content && typeof (post.content as { logo?: string }).logo === 'string'
      ? (post.content as { logo?: string }).logo
      : null
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

function getTaskHref(task: TaskKey, slug: string) {
  const route = SITE_CONFIG.tasks.find((item) => item.key === task)?.route || `/${task}`
  return `${route}/${slug}`
}

function postTask(post: SitePost): unknown {
  return (post as unknown as { task?: unknown }).task
}

function resolveTaskKey(value: unknown, fallback: TaskKey): TaskKey {
  if (value === 'listing' || value === 'classified' || value === 'article' || value === 'image' || value === 'profile' || value === 'sbm' || value === 'pdf')
    return value
  return fallback
}

function getPostMeta(post?: SitePost | null) {
  if (!post || typeof post.content !== 'object' || !post.content) return { category: '' }
  const content = post.content as Record<string, unknown>
  return {
    category: typeof content.category === 'string' ? content.category : typeof post.tags?.[0] === 'string' ? post.tags[0] : '',
  }
}

type PdfProfileHomeProps = {
  pdfPosts: SitePost[]
  profilePosts: SitePost[]
  primaryTask?: TaskConfig
}

export function PdfProfileHome({ pdfPosts, profilePosts, primaryTask }: PdfProfileHomeProps) {
  const lead = pdfPosts[0] || profilePosts[0]
  const carousel = pdfPosts.length ? pdfPosts.slice(0, 4) : profilePosts.slice(0, 4)
  const leadTask: TaskKey = pdfPosts[0] ? resolveTaskKey(postTask(pdfPosts[0]), 'pdf') : 'profile'
  const pdfRow = pdfPosts.slice(0, 8)
  const profileRow = profilePosts.slice(0, 6)

  return (
    <main className="bg-white text-neutral-950">
      <section className="border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-stretch gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                {siteContent.hero.badge}
              </span>
              <h1 className="mt-6 max-w-xl font-sans text-4xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-[3.25rem]">
                {siteContent.hero.title[0]} {siteContent.hero.title[1]}
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-600">{siteContent.hero.description}</p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href={siteContent.hero.primaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
                >
                  {siteContent.hero.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={siteContent.hero.secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
                >
                  {siteContent.hero.secondaryCta.label}
                </Link>
              </div>
            </div>

            <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-neutral-50 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:min-h-[480px]">
              {lead ? (
                <>
                  <Link href={getTaskHref(leadTask, lead.slug)} className="relative flex min-h-[320px] flex-1">
                    <ContentImage src={getPostImage(lead)} alt={lead.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm">New</span>
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">Top rated</span>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Featured</p>
                      <h2 className="mt-2 max-w-lg text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">{lead.title}</h2>
                      <p className="mt-2 line-clamp-2 max-w-lg text-sm leading-relaxed text-white/85">{lead.summary || 'Open the resource to preview, download, or connect with the author.'}</p>
                    </div>
                  </Link>
                  <div className="flex gap-2 border-t border-white/10 bg-black/40 p-3 backdrop-blur-md">
                    {carousel.map((post) => {
                      const t = resolveTaskKey(postTask(post), pdfPosts.length ? 'pdf' : 'profile')
                      return (
                        <Link
                          key={post.id}
                          href={getTaskHref(t, post.slug)}
                          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/20 ring-2 ring-transparent transition hover:ring-white/60"
                        >
                          <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                        </Link>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
                  <FileText className="h-12 w-12 text-neutral-400" />
                  <p className="max-w-xs text-sm text-neutral-600">Publish PDFs and profiles to populate this spotlight.</p>
                  <Link href="/pdf" className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
                    Browse PDF library
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-100 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Browse by focus</p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {browseCategories.map((cat, i) => (
              <Link
                key={cat}
                href={`/pdf${i === 0 ? '' : `?tag=${encodeURIComponent(cat.toLowerCase())}`}`}
                className={
                  i === 0
                    ? 'shrink-0 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white'
                    : 'shrink-0 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50'
                }
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="divide-y divide-neutral-200 rounded-[1.5rem] border border-neutral-200 bg-neutral-50/50 px-2 sm:px-4">
          <details className="group px-2 py-5 sm:px-4" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-neutral-950 [&::-webkit-details-marker]:hidden">
              <span className="flex items-baseline gap-3">
                <span className="text-sm text-neutral-400">01</span>
                <span>How PDF resources work</span>
              </span>
              <span className="text-neutral-400 transition group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-4 max-w-2xl pl-10 text-sm leading-relaxed text-neutral-600">
              Downloadable documents stay organized by category, with clear previews and metadata so teams can find the right file without digging through unrelated content.
            </p>
          </details>
          <details className="group px-2 py-5 sm:px-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-neutral-950 [&::-webkit-details-marker]:hidden">
              <span className="flex items-baseline gap-3">
                <span className="text-sm text-neutral-400">02</span>
                <span>Professional profiles</span>
              </span>
              <span className="text-neutral-400 transition group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-4 max-w-2xl pl-10 text-sm leading-relaxed text-neutral-600">
              Every profile highlights expertise, credentials, and related PDFs so visitors can trust who published each resource.
            </p>
          </details>
        </div>
      </section>

      <section className="bg-neutral-50/80 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Library</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-neutral-950">Recently added PDFs</h2>
            </div>
            <Link href="/pdf" className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
              View all
            </Link>
          </div>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(pdfRow.length ? pdfRow : [null]).map((post, idx) =>
              post ? (
                <Link
                  key={post.id}
                  href={getTaskHref(resolveTaskKey(postTask(post), 'pdf'), post.slug)}
                  className="w-[240px] shrink-0 overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-36 w-full">
                    <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-medium text-neutral-600">Resource</span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-neutral-950">{post.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600">{post.summary || 'PDF document'}</p>
                  </div>
                </Link>
              ) : (
                <div
                  key={`placeholder-${idx}`}
                  className="flex w-[240px] shrink-0 flex-col justify-between rounded-[1.25rem] border border-dashed border-neutral-300 bg-white p-5"
                >
                  <FileText className="h-8 w-8 text-neutral-300" />
                  <p className="text-sm text-neutral-600">Add PDFs to see them listed here.</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">People</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-neutral-950">Featured profiles</h2>
          </div>
          <Link href="/profile" className="text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline">
            See all profiles
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(profileRow.length ? profileRow : [null, null]).map((post, i) =>
            post ? (
              <Link
                key={post.id}
                href={getTaskHref(resolveTaskKey(postTask(post), 'profile'), post.slug)}
                className="group overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="flex items-start justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">{getPostMeta(post).category || 'Profile'}</p>
                    <h3 className="mt-2 text-lg font-bold text-neutral-950">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{post.summary || 'Professional profile and published work.'}</p>
                  </div>
                  <User className="mt-1 h-5 w-5 shrink-0 text-neutral-400" />
                </div>
              </Link>
            ) : (
              <div key={`p-${i}`} className="flex min-h-[200px] flex-col justify-center rounded-[1.5rem] border border-dashed border-neutral-300 bg-neutral-50/50 p-6 text-center">
                <p className="text-sm text-neutral-600">Profile cards appear when contributors are published.</p>
              </div>
            ),
          )}
        </div>

        {primaryTask ? (
          <div className="mt-14 flex justify-center">
            <Link
              href={primaryTask.route}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
            >
              Open {primaryTask.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  )
}

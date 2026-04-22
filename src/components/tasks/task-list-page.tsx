import Link from 'next/link'
import { ArrowRight, Building2, FileText, Image as ImageIcon, LayoutGrid, Tag, User } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { taskIntroCopy } from '@/config/site.content'
import { TASK_LIST_PAGE_OVERRIDE_ENABLED, TaskListPageOverride } from '@/overrides/task-list-page'
import { PdfProfileListEnrichment } from '@/components/tasks/pdf-profile-list-enrichment'

const taskIcons: Record<TaskKey, any> = {
  listing: Building2,
  article: FileText,
  image: ImageIcon,
  profile: User,
  classified: Tag,
  sbm: LayoutGrid,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

/** Unified marketing surface (matches homepage: white, neutral text, black CTAs). */
const ui = {
  muted: 'text-neutral-600',
  panel:
    'rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-8',
  soft: 'rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-6 sm:p-8',
  input: 'mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-950',
  button:
    'inline-flex h-11 w-full items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white hover:bg-neutral-800 sm:w-auto sm:px-8',
  linkGhost:
    'inline-flex h-11 items-center justify-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-900 hover:bg-neutral-50',
}

const taskHeroLine: Partial<Record<TaskKey, string>> = {
  pdf: 'Filter by topic, preview covers, and download the documents your team actually uses—without visual noise.',
  profile: 'Meet the people and teams behind the work: portraits, bios, and outbound links in one calm layout.',
  article: 'Long-form reading with generous spacing—skim topics, filter, then settle into a story.',
  listing: 'Structured discovery for services and brands with metadata that answers questions before the click.',
  classified: 'Short, timely posts when you need a fast scan for offers, roles, and announcements.',
  image: 'Visual-first browsing for galleries and media-led posts in a clean grid.',
  sbm: 'Saved links and collections with lighter cards so references stay easy to scan.',
  social: 'Community signals and quick updates in a compact, readable feed.',
  org: 'Organizations and teams with identity-forward cards and clear hierarchy.',
  comment: 'Discussion-first posts that stay connected to reading elsewhere on the site.',
}

function heroSubtitle(task: TaskKey) {
  return (
    taskHeroLine[task] ||
    'Browse the latest entries, refine by category, and open any item for a focused detail view.'
  )
}

export async function TaskListPage({ task, category }: { task: TaskKey; category?: string }) {
  if (TASK_LIST_PAGE_OVERRIDE_ENABLED) {
    return await TaskListPageOverride({ task, category })
  }

  const taskConfig = getTaskConfig(task)
  const posts = await fetchTaskPosts(task, 30)
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const intro = taskIntroCopy[task]
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || '/posts'}/${post.slug}`,
    name: post.title,
  }))
  const Icon = taskIcons[task] || LayoutGrid

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        {task === 'listing' ? (
          <SchemaJsonLd
            data={[
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Business Directory Listings',
                itemListElement: schemaItems,
              },
              {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                name: SITE_CONFIG.name,
                url: `${baseUrl}/listings`,
                areaServed: 'Worldwide',
              },
            ]}
          />
        ) : null}
        {task === 'article' || task === 'classified' ? (
          <SchemaJsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
              url: `${baseUrl}${taskConfig?.route || ''}`,
              hasPart: schemaItems,
            }}
          />
        ) : null}

        <section className="mb-14 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
              <Icon className="h-3.5 w-3.5 text-violet-500" />
              {taskConfig?.label || task}
            </div>
            <h1 className="mt-5 font-sans text-4xl font-bold tracking-[-0.04em] text-neutral-950 sm:text-5xl lg:text-[3rem] leading-[1.08]">
              {taskConfig?.description || 'Browse posts'}
            </h1>
            <p className={`mt-5 max-w-xl text-base leading-relaxed ${ui.muted}`}>{heroSubtitle(task)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800">
                Explore latest
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/search" className={ui.linkGhost}>
                Open search
              </Link>
            </div>
          </div>
          <form className={`grid gap-5 self-stretch ${ui.soft}`} action={taskConfig?.route || '#'}>
            <div>
              <label className={`text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500`}>Category</label>
              <select name="category" defaultValue={normalizedCategory} className={ui.input}>
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className={ui.button}>
              Apply filters
            </button>
            <p className={`text-xs leading-relaxed ${ui.muted}`}>
              Narrow the grid below, then open any card for the full detail view.
            </p>
          </form>
        </section>

        {intro ? (
          <section className={`mb-14 ${ui.panel}`}>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className={`mt-4 text-sm leading-relaxed ${ui.muted}`}>
                {paragraph}
              </p>
            ))}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              {intro.links.map((link) => (
                <Link key={link.href} href={link.href} className="text-neutral-950 underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {task === 'pdf' || task === 'profile' ? <PdfProfileListEnrichment task={task} posts={posts} /> : null}

        <section>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Library</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950">
                {task === 'pdf' ? 'All PDFs' : task === 'profile' ? 'All profiles' : 'Latest in this section'}
              </h2>
            </div>
          </div>
          <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
        </section>
      </main>
      <Footer />
    </div>
  )
}

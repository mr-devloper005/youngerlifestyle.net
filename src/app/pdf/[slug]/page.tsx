import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, FileText, Info, Link2, ListChecks, Share2, Tag } from "lucide-react";

import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { ContentImage } from "@/components/shared/content-image";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";

export const revalidate = 3;

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function excerptFromContent(content: Record<string, unknown>, summary: string | null | undefined, max = 520) {
  const body = typeof content.body === "string" ? content.body : "";
  const ex = typeof content.excerpt === "string" ? content.excerpt : "";
  const raw = (body || ex || summary || "").trim();
  if (!raw) return "";
  const plain = /<[a-z]/i.test(raw) ? stripTags(raw) : raw;
  return plain.length > max ? `${plain.slice(0, max).trim()}…` : plain;
}

function profileCover(post: SitePost) {
  const media = Array.isArray(post.media) ? post.media : [];
  const u = media.find((m) => typeof m?.url === "string")?.url;
  const c = post.content && typeof post.content === "object" ? (post.content as Record<string, unknown>) : {};
  const images = Array.isArray(c.images) ? c.images : [];
  const img0 = typeof images[0] === "string" ? images[0] : null;
  const logo = typeof c.logo === "string" ? c.logo : null;
  return u || img0 || logo || "/placeholder.svg?height=400&width=400";
}

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("pdf", 50);
  if (!posts.length) {
    return [{ slug: "placeholder" }];
  }
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("pdf", resolvedParams.slug);
    return post ? await buildPostMetadata("pdf", post) : await buildTaskMetadata("pdf");
  } catch (error) {
    console.warn("PDF metadata lookup failed", error);
    return await buildTaskMetadata("pdf");
  }
}

export default async function PdfDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let post = null;
  try {
    post = await fetchTaskPostBySlug("pdf", resolvedParams.slug);
  } catch (error) {
    console.warn("PDF detail lookup failed", error);
  }
  if (!post) {
    notFound();
  }

  const content = post.content && typeof post.content === "object" ? post.content : {};
  const contentAny = content as Record<string, unknown>;
  const fileUrl =
    (typeof contentAny.fileUrl === "string" && contentAny.fileUrl) ||
    (typeof contentAny.pdfUrl === "string" && contentAny.pdfUrl) ||
    "";

  if (!fileUrl || !/^https?:\/\//i.test(fileUrl)) {
    notFound();
  }

  const viewerUrl = `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`;
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const category = typeof contentAny.category === "string" ? contentAny.category : "";
  const fileSize = typeof contentAny.fileSize === "string" ? contentAny.fileSize : "";
  const pages = typeof contentAny.pages === "string" || typeof contentAny.pages === "number" ? String(contentAny.pages) : "";
  const author = typeof contentAny.author === "string" ? contentAny.author : "";
  const highlights = Array.isArray(contentAny.highlights)
    ? (contentAny.highlights as unknown[]).filter((h): h is string => typeof h === "string" && h.trim().length > 0)
    : [];
  const longExcerpt = excerptFromContent(contentAny, post.summary);
  const tags = Array.isArray(post.tags) ? post.tags : [];

  const related = (await fetchTaskPosts("pdf", 8))
    .filter((item) => item.slug !== post.slug)
    .filter((item) => {
      if (!category) return true;
      const itemContent = item.content && typeof item.content === "object" ? item.content : {};
      const itemCategory =
        typeof (itemContent as Record<string, unknown>).category === "string"
          ? (itemContent as Record<string, unknown>).category
          : "";
      return itemCategory === category;
    })
    .slice(0, 3);

  const publishers = (await fetchTaskPosts("profile", 4)).slice(0, 3);

  const published =
    typeof post.publishedAt === "string"
      ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : null;

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "PDFs", item: `${baseUrl}/pdf` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${baseUrl}/pdf/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <SchemaJsonLd data={breadcrumbData} />

        <div className="mb-8">
          <Link href="/pdf" className="text-sm font-medium text-neutral-600 hover:text-neutral-950">
            ← Back to PDF library
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(280px,320px)] lg:items-start">
          <div className="min-w-0 space-y-8">
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                  PDF
                </span>
                {category ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-800">
                    <Tag className="h-3.5 w-3.5 text-violet-500" />
                    {category}
                  </span>
                ) : null}
                {published ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
                    <Calendar className="h-3.5 w-3.5" />
                    {published}
                  </span>
                ) : null}
              </div>
              <h1 className="font-sans text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-[2.5rem] leading-tight">
                {post.title}
              </h1>
              {post.summary ? <p className="max-w-3xl text-base leading-relaxed text-neutral-600">{post.summary}</p> : null}
              {(author || fileSize || pages) ? (
                <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-600">
                  {author ? (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Attributed to</dt>
                      <dd className="mt-0.5 font-medium text-neutral-950">{author}</dd>
                    </div>
                  ) : null}
                  {fileSize ? (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Size</dt>
                      <dd className="mt-0.5 font-medium text-neutral-950">{fileSize}</dd>
                    </div>
                  ) : null}
                  {pages ? (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Pages</dt>
                      <dd className="mt-0.5 font-medium text-neutral-950">{pages}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
              {tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Link
                      key={t}
                      href={`/search?q=${encodeURIComponent(t)}&master=1`}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-white"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              ) : null}
            </header>

            <div className="overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-neutral-50 shadow-sm">
              <iframe src={viewerUrl} title={post.title} className="h-[min(78vh,820px)] w-full bg-white" />
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Download original
              </a>
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              >
                Open in new tab
              </a>
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              >
                Find similar
              </Link>
            </div>

            {highlights.length ? (
              <section className="rounded-[1.25rem] border border-neutral-200 bg-neutral-50/80 p-6 sm:p-8">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-950">
                  <ListChecks className="h-5 w-5 text-violet-500" />
                  What you will get from this file
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-700">
                  {highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-950" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {longExcerpt ? (
              <section className="rounded-[1.25rem] border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-950">
                  <Info className="h-5 w-5 text-violet-500" />
                  About this document
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">{longExcerpt}</p>
              </section>
            ) : null}

            {related.length ? (
              <section className="border-t border-neutral-200 pt-10">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Related PDFs</p>
                    <h2 className="mt-1 text-2xl font-bold text-neutral-950">Same lane, different angle</h2>
                  </div>
                  <Link href="/pdf" className="text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline">
                    View all PDFs
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((item) => (
                    <TaskPostCard key={item.id} post={item} href={buildPostUrl("pdf", item.slug)} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-[1.25rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Use & sharing</p>
              <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                <li className="flex gap-2">
                  <Share2 className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  Share this page URL for reviews—downloads stay on the canonical file link.
                </li>
                <li className="flex gap-2">
                  <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  Cite the on-site title and retrieval date when referencing externally.
                </li>
                <li className="flex gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  Prefer the in-browser viewer for quick scans; download for print or archival.
                </li>
              </ul>
            </div>

            {publishers.length ? (
              <div className="rounded-[1.25rem] border border-neutral-200 bg-neutral-50/90 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">People behind the library</p>
                <h3 className="mt-2 text-lg font-bold text-neutral-950">Featured profiles</h3>
                <ul className="mt-4 space-y-4">
                  {publishers.map((p) => (
                    <li key={p.id}>
                      <Link href={buildPostUrl("profile", p.slug)} className="group flex gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                          <ContentImage src={profileCover(p)} alt={p.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-950 group-hover:underline">{p.title}</p>
                          {p.summary ? <p className="line-clamp-2 text-xs text-neutral-600">{p.summary}</p> : null}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/profile" className="mt-4 inline-block text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline">
                  Browse all profiles →
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

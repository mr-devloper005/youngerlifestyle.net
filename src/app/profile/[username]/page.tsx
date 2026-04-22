import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, FileText, Globe, Mail, MapPin, Phone, Sparkles, Tag, UserRound } from "lucide-react";
import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { ContentImage } from "@/components/shared/content-image";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Button } from "@/components/ui/button";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostUrl } from "@/lib/task-data";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG } from "@/lib/site-config";

export const revalidate = 3;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeRichHtml = (html: string) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\shref\s*=\s*(['"])javascript:.*?\1/gi, ' href="#"');

const formatRichHtml = (raw?: string | null, fallback = "Profile details will appear here once available.") => {
  const source = typeof raw === "string" ? raw.trim() : "";
  if (!source) return `<p>${escapeHtml(fallback)}</p>`;
  if (/<[a-z][\s\S]*>/i.test(source)) return sanitizeRichHtml(source);
  return source
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\n/g, " ").trim())}</p>`)
    .join("");
};

function pdfThumb(post: { media?: { url: string }[]; content?: Record<string, unknown> | null }) {
  const media = Array.isArray(post.media) ? post.media : [];
  const u = media.find((m) => typeof m?.url === "string")?.url;
  const c = post.content && typeof post.content === "object" ? post.content : {};
  const images = Array.isArray(c.images) ? c.images : [];
  const img0 = typeof images[0] === "string" ? images[0] : null;
  return u || img0 || "/placeholder.svg?height=600&width=800";
}

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("profile", 50);
  if (!posts.length) {
    return [{ username: "placeholder" }];
  }
  return posts.map((post) => ({ username: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
    return post ? await buildPostMetadata("profile", post) : await buildTaskMetadata("profile");
  } catch (error) {
    console.warn("Profile metadata lookup failed", error);
    return await buildTaskMetadata("profile");
  }
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
  if (!post) {
    notFound();
  }
  const content = (post.content || {}) as Record<string, unknown>;
  const logoUrl = typeof content.logo === "string" ? content.logo : undefined;
  const brandName =
    (content.brandName as string | undefined) ||
    (content.companyName as string | undefined) ||
    (content.name as string | undefined) ||
    post.title;
  const website = content.website as string | undefined;
  const domain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : undefined;
  const email = typeof content.email === "string" ? content.email : undefined;
  const phone = typeof content.phone === "string" ? content.phone : undefined;
  const address = typeof content.address === "string" ? content.address : undefined;
  const location = typeof content.location === "string" ? content.location : undefined;
  const role = typeof content.role === "string" ? content.role : undefined;
  const description =
    (content.description as string | undefined) ||
    post.summary ||
    "Profile details will appear here once available.";
  const descriptionHtml = formatRichHtml(description);
  const suggestedArticles = await fetchTaskPosts("article", 6);
  const libraryPdfs = (await fetchTaskPosts("pdf", 8)).slice(0, 4);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");

  const highlights = Array.isArray(content.highlights)
    ? (content.highlights as unknown[]).filter((h): h is string => typeof h === "string" && h.trim().length > 0)
    : [];

  const published =
    typeof post.publishedAt === "string"
      ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : null;
  const updated =
    typeof post.updatedAt === "string"
      ? new Date(post.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : null;

  const tags = Array.isArray(post.tags) ? post.tags : [];

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Profiles", item: `${baseUrl}/profile` },
      { "@type": "ListItem", position: 3, name: brandName, item: `${baseUrl}/profile/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <NavbarShell />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-12">
        <SchemaJsonLd data={breadcrumbData} />

        <div className="mb-6">
          <Link href="/profile" className="text-sm font-medium text-neutral-600 hover:text-neutral-950">
            ← All profiles
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(280px,320px)] lg:items-start">
          <div className="min-w-0 space-y-10">
            <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:p-10">
              <div className="grid gap-10 md:grid-cols-[200px_1fr] md:items-start">
                <div className="flex justify-center md:justify-start">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 shadow-inner md:h-44 md:w-44">
                    {logoUrl ? (
                      <ContentImage src={logoUrl} alt={post.title} fill className="object-cover" sizes="176px" intrinsicWidth={176} intrinsicHeight={176} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-neutral-400">
                        {post.title.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                      Profile
                    </span>
                    {role ? (
                      <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-900">{role}</span>
                    ) : null}
                  </div>
                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">{brandName}</h1>
                  {domain ? (
                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-neutral-600">
                      <Globe className="h-4 w-4" />
                      {domain}
                    </p>
                  ) : null}
                  {tags.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <Link
                          key={t}
                          href={`/search?q=${encodeURIComponent(t)}&master=1`}
                          className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700 hover:border-neutral-300 hover:bg-white"
                        >
                          <Tag className="h-3 w-3 text-violet-500" />
                          {t}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                  <article
                    className="article-content prose prose-neutral mt-8 max-w-2xl text-base leading-relaxed text-neutral-700 prose-p:my-4 prose-a:text-neutral-950 prose-a:underline prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                  />
                  {website ? (
                    <div className="mt-8">
                      <Button asChild size="lg" className="rounded-full bg-neutral-950 px-8 text-base font-semibold text-white hover:bg-neutral-800">
                        <Link href={website} target="_blank" rel="noopener noreferrer">
                          Visit official site
                        </Link>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            {highlights.length ? (
              <section className="rounded-[1.25rem] border border-neutral-200 bg-neutral-50/80 p-6 sm:p-8">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-950">
                  <Sparkles className="h-5 w-5 text-violet-500" />
                  Focus areas
                </div>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {highlights.map((h) => (
                    <li key={h} className="flex gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
                      <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {libraryPdfs.length ? (
              <section>
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Document library</p>
                    <h2 className="mt-1 text-2xl font-bold text-neutral-950">Recent PDFs on the platform</h2>
                    <p className="mt-2 max-w-2xl text-sm text-neutral-600">
                      Explore resources published around the same time—ideal when you want comparable templates or research packs.
                    </p>
                  </div>
                  <Link href="/pdf" className="text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline">
                    Open PDF hub
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {libraryPdfs.map((doc) => (
                    <Link
                      key={doc.id}
                      href={buildPostUrl("pdf", doc.slug)}
                      className="group flex gap-4 overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
                        <ContentImage src={pdfThumb(doc)} alt={doc.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">PDF</p>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-neutral-950 group-hover:underline">{doc.title}</p>
                        {doc.summary ? <p className="mt-1 line-clamp-2 text-xs text-neutral-600">{doc.summary}</p> : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {suggestedArticles.length ? (
              <section>
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Editorial</p>
                    <h2 className="mt-1 text-2xl font-bold text-neutral-950">Stories from the network</h2>
                  </div>
                  <Link href="/articles" className="text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline">
                    View articles
                  </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {suggestedArticles.slice(0, 3).map((article) => (
                    <TaskPostCard key={article.id} post={article} href={buildPostUrl("article", article.slug)} compact />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-[1.25rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">At a glance</p>
              <dl className="mt-4 space-y-4 text-sm">
                {(published || updated) && (
                  <div>
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      <Calendar className="h-3.5 w-3.5" />
                      Activity
                    </dt>
                    <dd className="mt-1 space-y-1 text-neutral-700">
                      {published ? <p>Published {published}</p> : null}
                      {updated ? <p>Updated {updated}</p> : null}
                    </dd>
                  </div>
                )}
                {email ? (
                  <div>
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </dt>
                    <dd className="mt-1">
                      <a href={`mailto:${email}`} className="font-medium text-neutral-950 underline-offset-2 hover:underline">
                        {email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {phone ? (
                  <div>
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      <Phone className="h-3.5 w-3.5" />
                      Phone
                    </dt>
                    <dd className="mt-1 font-medium text-neutral-950">{phone}</dd>
                  </div>
                ) : null}
                {(location || address) && (
                  <div>
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </dt>
                    <dd className="mt-1 text-neutral-700">
                      {location ? <p>{location}</p> : null}
                      {address ? <p className="text-xs text-neutral-600">{address}</p> : null}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-[1.25rem] border border-neutral-200 bg-neutral-50/90 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Next steps</p>
              <ul className="mt-3 space-y-3 text-sm text-neutral-600">
                <li className="flex gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  Pair this profile with PDFs you publish so readers see authorship context.
                </li>
                <li className="flex gap-2">
                  <Globe className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  Keep outbound links current—broken destinations erode trust faster than stale bios.
                </li>
              </ul>
              <Link href="/contact" className="mt-4 inline-block text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline">
                Request a profile update →
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

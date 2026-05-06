import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, FileText, Globe, Mail, Sparkles, UserRound, Users } from "lucide-react";
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

// Generate consistent follower count based on username
const generateFollowerCount = (username: string): number => {
  // Create a hash from username to ensure consistency
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    const char = username.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Use absolute hash to generate number between 5-19
  return Math.abs(hash % 15) + 5;
};

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
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  
  // Generate follower count
  const followerCount = generateFollowerCount(resolvedParams.username);

  const highlights = Array.isArray(content.highlights)
    ? (content.highlights as unknown[]).filter((h): h is string => typeof h === "string" && h.trim().length > 0)
    : [];

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

        {/* Profile Header Card */}
        <div className="mb-8 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {/* Header with brand name */}
          <div className="border-b border-neutral-200 px-6 py-4">
            <h1 className="text-xl font-bold text-neutral-950">{brandName?.toUpperCase() || 'PROFILE'}</h1>
          </div>
          
          {/* Profile info section */}
          <div className="p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Profile picture */}
              <div className="flex-shrink-0">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-neutral-200 bg-neutral-50">
                  {logoUrl ? (
                    <ContentImage src={logoUrl} alt={post.title} fill className="object-cover" sizes="96px" intrinsicWidth={96} intrinsicHeight={96} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-neutral-400">
                      {post.title.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Profile details */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-neutral-950">{brandName}</h2>
                {role && (
                  <p className="mt-1 text-sm text-neutral-600">{role}</p>
                )}
                
                {/* Follower/Following counts */}
                <div className="mt-4 flex justify-center gap-8 sm:justify-start">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-950">{followerCount}</div>
                    <div className="text-xs text-neutral-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-950">0</div>
                    <div className="text-xs text-neutral-600">Following</div>
                  </div>
                </div>
              </div>
              
              {/* Follow button */}
              <div className="flex-shrink-0">
                <Button asChild className="rounded-full bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
                  <Link href="/login">
                    Follow
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-8">
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-8">
              <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
                Profile
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Tab Content */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <article
                  className="prose prose-neutral max-w-none text-sm text-neutral-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact info */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <h4 className="text-sm font-semibold text-neutral-950 mb-4">Contact Information</h4>
                <div className="space-y-3">
                  {email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-neutral-400" />
                      <a href={`mailto:${email}`} className="text-neutral-700 hover:text-neutral-950">
                        {email}
                      </a>
                    </div>
                  )}
                  {website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-neutral-400" />
                      <a href={website} target="_blank" rel="noopener noreferrer" className="text-neutral-700 hover:text-neutral-950">
                        Visit website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional sections - keep existing functionality */}
        {highlights.length ? (
          <section className="mt-8 rounded-[1.25rem] border border-neutral-200 bg-neutral-50/80 p-6 sm:p-8">
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

        
        {suggestedArticles.length ? (
          <section className="mt-8">
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
      </main>
      <Footer />
    </div>
  );
}

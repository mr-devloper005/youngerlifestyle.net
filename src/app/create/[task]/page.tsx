"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { SITE_CONFIG, type TaskKey } from "@/lib/site-config";
import { addLocalPost } from "@/lib/local-posts";

type Field = {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "url"
    | "number"
    | "tags"
    | "images"
    | "highlights"
    | "category"
    | "file";
  placeholder?: string;
  required?: boolean;
};

const FORM_CONFIG: Record<TaskKey, { title: string; description: string; fields: Field[] }> = {
  listing: {
    title: "Create Business Listing",
    description: "Add a local-only listing with business details.",
    fields: [
      { key: "title", label: "Listing title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Full description", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "address", label: "Address", type: "text" },
      { key: "website", label: "Website URL", type: "url" },
      { key: "email", label: "Business email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "logo", label: "Logo URL", type: "url" },
      { key: "images", label: "Gallery images", type: "images" },
      { key: "highlights", label: "Highlights", type: "highlights" },
    ],
  },
  classified: {
    title: "Create Classified",
    description: "Add a local-only classified ad.",
    fields: [
      { key: "title", label: "Ad title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Ad details", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "address", label: "Address", type: "text" },
      { key: "website", label: "Website URL", type: "url" },
      { key: "email", label: "Business email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "images", label: "Images", type: "images" },
      { key: "highlights", label: "Highlights", type: "highlights" },
    ],
  },
  article: {
    title: "Create Article",
    description: "Write a local-only article post.",
    fields: [
      { key: "title", label: "Article title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Article content (HTML allowed)", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "images", label: "Cover images", type: "images" },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  image: {
    title: "Create Image Share",
    description: "Share image-only content locally.",
    fields: [
      { key: "title", label: "Image title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Caption", type: "textarea" },
      { key: "category", label: "Category", type: "category" },
      { key: "images", label: "Images", type: "images", required: true },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  profile: {
    title: "Create Profile",
    description: "Create a local-only business profile.",
    fields: [
      { key: "brandName", label: "Brand name", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "About the brand", type: "textarea" },
      { key: "website", label: "Website URL", type: "url", required: true },
      { key: "logo", label: "Logo URL", type: "url", required: true },
    ],
  },
  social: {
    title: "Create Social Post",
    description: "Publish a local-only social update.",
    fields: [
      { key: "title", label: "Post title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Post content", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category" },
      { key: "images", label: "Images", type: "images" },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  sbm: {
    title: "Create Bookmark",
    description: "Submit a local-only social bookmark.",
    fields: [
      { key: "title", label: "Bookmark title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Why it’s useful", type: "textarea" },
      { key: "website", label: "Target URL", type: "url", required: true },
      { key: "category", label: "Category", type: "category" },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  pdf: {
    title: "Create PDF Entry",
    description: "Add a local-only PDF resource.",
    fields: [
      { key: "title", label: "PDF title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "fileUrl", label: "PDF file URL", type: "file", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "images", label: "Cover image", type: "images" },
    ],
  },
  org: {
    title: "Create Organization",
    description: "Create a local-only organization profile.",
    fields: [
      { key: "brandName", label: "Organization name", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "About the organization", type: "textarea" },
      { key: "website", label: "Website URL", type: "url" },
      { key: "logo", label: "Logo URL", type: "url" },
    ],
  },
  comment: {
    title: "Create Blog Comment",
    description: "Store a local-only blog comment entry.",
    fields: [
      { key: "title", label: "Comment title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Comment body", type: "textarea", required: true },
      { key: "website", label: "Target post URL", type: "url", required: true },
      { key: "category", label: "Category", type: "category" },
    ],
  },
};

export default function CreateTaskPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const taskKey = params?.task as TaskKey;

  const taskConfig = useMemo(
    () => SITE_CONFIG.tasks.find((task) => task.key === taskKey && task.enabled),
    [taskKey]
  );
  const formConfig = FORM_CONFIG[taskKey];

  const [values, setValues] = useState<Record<string, string>>({});
  const [uploadingPdf, setUploadingPdf] = useState(false);

  if (!taskConfig || !formConfig) {
    return (
      <div className="min-h-screen bg-white text-neutral-950">
        <NavbarShell />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="font-sans text-2xl font-bold tracking-[-0.02em] text-neutral-950 sm:text-3xl">
            Task not available
          </h1>
          <p className="mt-3 text-neutral-600">
            This task is not enabled for the current site.
          </p>
          <Button
            className="mt-8 rounded-full bg-neutral-950 px-6 text-white hover:bg-neutral-800"
            asChild
          >
            <Link href="/">Back home</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const updateValue = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in before creating content.",
      });
      router.push("/login");
      return;
    }

    const missing = formConfig.fields.filter((field) => field.required && !values[field.key]);
    if (missing.length) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields before saving.",
      });
      return;
    }

    const title = values.title || values.brandName || "Untitled";
    const summary = values.summary || "";
    const contentType = taskConfig.contentType || taskKey;

    const content: Record<string, unknown> = {
      type: contentType,
    };

    if (values.category) content.category = values.category;
    if (values.description) content.description = values.description;
    if (values.website) content.website = values.website;
    if (values.email) content.email = values.email;
    if (values.phone) content.phone = values.phone;
    if (values.address) content.address = values.address;
    if (values.location) content.location = values.location;
    if (values.logo) content.logo = values.logo;
    if (values.fileUrl) content.fileUrl = values.fileUrl;
    if (values.brandName) content.brandName = values.brandName;

    const highlights = values.highlights
      ? values.highlights.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
    if (highlights.length) content.highlights = highlights;

    const tags = values.tags
      ? values.tags.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const images = values.images
      ? values.images.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const post = addLocalPost({
      task: taskKey,
      title,
      summary,
      authorName: user.name,
      tags,
      content,
      media: images.map((url) => ({ url, type: "IMAGE" })),
      publishedAt: new Date().toISOString(),
    });

    toast({
      title: "Saved locally",
      description: "This post is stored only in your browser.",
    });

    router.push(`/local/${taskKey}/${post.slug}`);
  };

  const fieldClass =
    "rounded-xl border border-neutral-200 bg-white text-neutral-950 placeholder:text-neutral-400 focus-visible:border-violet-300 focus-visible:ring-2 focus-visible:ring-violet-500/20";

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <NavbarShell />
      <main>
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <Link
                  href="/"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-sm transition hover:bg-neutral-50"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Create
                  </p>
                  <h1 className="mt-2 font-sans text-3xl font-bold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
                    {formConfig.title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600">
                    {formConfig.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-8">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-800"
                >
                  {taskConfig.label}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-neutral-200 bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-600"
                >
                  Local-only
                </Badge>
              </div>

              <div className="mt-6 grid gap-6">
                {formConfig.fields.map((field) => (
                  <div key={field.key} className="grid gap-2">
                    <Label className="text-sm font-medium text-neutral-800">
                      {field.label}{" "}
                      {field.required ? <span className="text-red-600">*</span> : null}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        rows={4}
                        placeholder={field.placeholder}
                        value={values[field.key] || ""}
                        onChange={(event) => updateValue(field.key, event.target.value)}
                        className={fieldClass}
                      />
                    ) : field.type === "category" ? (
                      <select
                        value={values[field.key] || ""}
                        onChange={(event) => updateValue(field.key, event.target.value)}
                        className={`h-11 px-3 text-sm text-neutral-950 ${fieldClass} focus-visible:outline-none`}
                      >
                        <option value="">Select category</option>
                        {CATEGORY_OPTIONS.map((option) => (
                          <option key={option.slug} value={option.slug}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "file" ? (
                      <div className="grid gap-3">
                        <Input
                          type="file"
                          accept="application/pdf"
                          className={`h-11 cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white ${fieldClass}`}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            if (file.type !== "application/pdf") {
                              toast({
                                title: "Invalid file",
                                description: "Please upload a PDF file.",
                              });
                              return;
                            }
                            const reader = new FileReader();
                            setUploadingPdf(true);
                            reader.onload = () => {
                              const result = typeof reader.result === "string" ? reader.result : "";
                              updateValue(field.key, result);
                              setUploadingPdf(false);
                              toast({
                                title: "PDF uploaded",
                                description: "File is stored locally.",
                              });
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                        <Input
                          type="text"
                          placeholder="Or paste a PDF URL"
                          value={values[field.key] || ""}
                          onChange={(event) => updateValue(field.key, event.target.value)}
                          className={`h-11 ${fieldClass}`}
                        />
                        {uploadingPdf ? (
                          <p className="text-xs text-neutral-500">Uploading PDF…</p>
                        ) : null}
                      </div>
                    ) : (
                      <Input
                        type={field.type === "number" ? "number" : "text"}
                        placeholder={
                          field.type === "images" || field.type === "tags" || field.type === "highlights"
                            ? "Separate values with commas"
                            : field.placeholder
                        }
                        value={values[field.key] || ""}
                        onChange={(event) => updateValue(field.key, event.target.value)}
                        className={`h-11 ${fieldClass}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={handleSubmit}
                  className="rounded-full bg-neutral-950 px-6 text-white hover:bg-neutral-800"
                >
                  <Save className="h-4 w-4" />
                  Save locally
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="rounded-full border-neutral-200 bg-white px-6 text-neutral-900 shadow-sm hover:bg-neutral-50"
                >
                  <Link href={taskConfig.route}>
                    View {taskConfig.label}
                    <Plus className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

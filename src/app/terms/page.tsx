import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG } from "@/lib/site-config";

const card = "rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm";

const sections = [
  {
    title: "Acceptable use",
    body: "Do not misuse uploads to distribute malware, impersonate others, or host illegal material. We may suspend access while incidents are reviewed.",
  },
  {
    title: "Accounts & access",
    body: "You are responsible for safeguarding credentials. Notify us promptly if you suspect unauthorized access to your workspace.",
  },
  {
    title: "Content & licensing",
    body: "You retain rights to PDFs and profile materials you submit. You grant us a limited license to host, display, and distribute that content solely to operate the service.",
  },
  {
    title: "Disclaimers",
    body: "Resources are provided as-is. We do not guarantee uninterrupted availability and may change features with reasonable notice where practical.",
  },
];

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      description={`The rules that govern use of ${SITE_CONFIG.name}, including PDF hosting, public profiles, and discovery tools.`}
    >
      <Card className={card}>
        <CardContent className="space-y-6 p-7 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Last updated · March 16, 2026</p>
          <p className="text-sm leading-relaxed text-neutral-600">
            By accessing the site you agree to these terms. If you are using {SITE_CONFIG.name} on behalf of a company,
            you confirm that you have authority to bind that organization.
          </p>
          {sections.map((section) => (
            <div key={section.title} className="rounded-[1rem] border border-neutral-200 bg-neutral-50/60 p-5 sm:p-6">
              <h3 className="text-sm font-bold text-neutral-950">{section.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{section.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}

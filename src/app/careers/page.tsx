import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";

const card = "rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm";

const roles = [
  { title: "Product Designer", location: "Remote", type: "Full-time", level: "Mid" },
  { title: "Frontend Engineer", location: "New York, NY", type: "Full-time", level: "Senior" },
  { title: "Content Operations", location: "Remote", type: "Contract", level: "Mid" },
];

const benefits = [
  "Async-friendly workflows with weekly design critiques",
  "Hardware stipend and home-office budget",
  "Access to the full PDF + profile staging environment",
  "Transparent leveling and lightweight performance cycles",
];

export default function CareersPage() {
  return (
    <PageShell
      eyebrow="Careers"
      title="Build the modern document hub"
      description={`Help us shape ${SITE_CONFIG.name}—a calm place for PDFs and the people who publish them.`}
      actions={
        <Button asChild className="rounded-full bg-neutral-950 px-6 font-semibold text-white hover:bg-neutral-800">
          <Link href="/contact">Start a conversation</Link>
        </Button>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          {roles.map((role) => (
            <Card key={role.title} className={card}>
              <CardContent className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full border border-neutral-200 bg-neutral-50 text-neutral-800">{role.level}</Badge>
                  <Badge variant="outline" className="rounded-full border-neutral-200 text-neutral-700">
                    {role.type}
                  </Badge>
                </div>
                <h2 className="mt-3 text-lg font-bold text-neutral-950">{role.title}</h2>
                <p className="mt-1 text-sm text-neutral-600">{role.location}</p>
                <Button variant="outline" className="mt-5 rounded-full border-neutral-200 font-semibold" asChild>
                  <Link href="/contact">View role</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className={card}>
          <CardContent className="p-7 sm:p-8">
            <h3 className="text-xl font-bold text-neutral-950">Why join now</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              We are a small team obsessed with typography, trustworthy metadata, and flows that respect expert users.
              If you like shipping polished marketing surfaces and resilient content systems, you will feel at home.
            </p>
            <div className="mt-6 space-y-2 text-sm text-neutral-700">
              {benefits.map((benefit) => (
                <div key={benefit} className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                  {benefit}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

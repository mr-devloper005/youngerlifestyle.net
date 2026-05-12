import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";

const card = "rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm";

const values = [
  {
    title: "Documents first",
    description: "We treat PDFs as first-class objects—clear previews, honest metadata, and predictable downloads.",
  },
  {
    title: "Clear organization",
    description: "Documents stay organized by category with clear previews and metadata so teams can find what they need quickly.",
  },
  {
    title: "Calm by default",
    description: "No cluttered marketplace chrome—just white space, strong type, and navigation that stays out of your way.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title={`About ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is a focused library for PDFs—built for teams who outgrew generic portals and noisy feeds.`}
      actions={
        <>
            <Button asChild className="rounded-full bg-neutral-950 px-6 font-semibold text-white hover:bg-neutral-800">
            <Link href="/contact">Contact us</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className={card}>
          <CardContent className="space-y-5 p-7 sm:p-8">
            <Badge className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
              Our story
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
              One surface for files and the humans behind them.
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              We built this platform for operators, educators, and founders who need a credible place to host documents
              without mixing in unrelated product lanes.
            </p>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {values.map((value) => (
            <Card key={value.title} className={card}>
              <CardContent className="p-6 sm:p-7">
                <h3 className="text-lg font-bold text-neutral-950">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </PageShell>
  );
}

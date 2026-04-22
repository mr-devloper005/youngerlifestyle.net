import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockTeamMembers } from "@/data/mock-data";
import { SITE_CONFIG } from "@/lib/site-config";

const card = "rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm";

const highlights = [
  { label: "PDFs indexed", value: "480+" },
  { label: "Active profiles", value: "120+" },
  { label: "Monthly opens", value: "24k" },
];

const values = [
  {
    title: "Documents first",
    description: "We treat PDFs as first-class objects—clear previews, honest metadata, and predictable downloads.",
  },
  {
    title: "People in the loop",
    description: "Profiles explain who published each resource so teams can trust the source, not just the file name.",
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
      description={`${SITE_CONFIG.name} is a focused library for PDFs and professional profiles—built for teams who outgrew generic portals and noisy feeds.`}
      actions={
        <>
          <Button variant="outline" asChild className="rounded-full border-neutral-200 bg-white px-6 font-semibold text-neutral-900 hover:bg-neutral-50">
            <Link href="/team">Meet the team</Link>
          </Button>
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
              and introduce the people responsible for them—without mixing in unrelated product lanes.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-[1rem] border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-2xl font-bold text-neutral-950">{item.value}</div>
                  <div className="mt-1 text-xs font-medium text-neutral-500">{item.label}</div>
                </div>
              ))}
            </div>
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

      <div className="mt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Leadership</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">People behind the product</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {mockTeamMembers.map((member) => (
            <Card key={member.id} className={`${card} transition hover:-translate-y-0.5 hover:shadow-md`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-neutral-200">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-neutral-950">{member.name}</p>
                    <p className="text-xs text-neutral-500">{member.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{member.bio}</p>
                <p className="mt-3 text-xs text-neutral-500">{member.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

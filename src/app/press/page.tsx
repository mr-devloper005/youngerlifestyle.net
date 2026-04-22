'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { mockPressAssets, mockPressCoverage } from '@/data/mock-data'

const card = 'rounded-[1.25rem] border border-neutral-200 bg-white shadow-sm'

export default function PressPage() {
  const { toast } = useToast()
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null)
  const activeAsset = mockPressAssets.find((asset) => asset.id === activeAssetId)

  return (
    <PageShell
      eyebrow="Media"
      title="Press room"
      description="Brand assets, product imagery, and recent coverage—aligned with the neutral marketing system."
    >
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className={card}>
          <CardContent className="space-y-4 p-7 sm:p-8">
            <h2 className="text-xl font-bold text-neutral-950">Press kit</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Download logos, UI captures, and short product blurbs. Everything is tuned for light backgrounds to match
              the public site.
            </p>
            <div className="grid gap-3">
              {mockPressAssets.map((asset) => (
                <div key={asset.id} className="rounded-[1rem] border border-neutral-200 bg-neutral-50/70 px-4 py-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-neutral-950">{asset.title}</p>
                      <p className="text-xs text-neutral-600">{asset.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full border border-neutral-200 bg-white text-neutral-700">{asset.fileType}</Badge>
                      <Button size="sm" variant="outline" className="rounded-full border-neutral-200" onClick={() => setActiveAssetId(asset.id)}>
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800"
                        onClick={() =>
                          toast({
                            title: 'Download started',
                            description: `${asset.title} is downloading.`,
                          })
                        }
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {mockPressCoverage.map((item) => (
            <Card key={item.id} className={`${card} transition hover:-translate-y-0.5 hover:shadow-md`}>
              <CardContent className="p-6 sm:p-7">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{item.outlet}</div>
                <p className="mt-2 text-sm font-medium text-neutral-950">{item.headline}</p>
                <p className="mt-2 text-xs text-neutral-500">{item.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(activeAsset)} onOpenChange={() => setActiveAssetId(null)}>
        <DialogContent className="max-w-3xl border-neutral-200">
          <DialogHeader>
            <DialogTitle className="text-neutral-950">{activeAsset?.title}</DialogTitle>
          </DialogHeader>
          {activeAsset?.previewUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
              <Image src={activeAsset.previewUrl} alt={activeAsset.title} fill className="object-cover" />
            </div>
          )}
          <p className="text-sm text-neutral-600">{activeAsset?.description}</p>
          <DialogFooter>
            <Button variant="outline" className="rounded-full border-neutral-200" onClick={() => setActiveAssetId(null)}>
              Close
            </Button>
            <Button
              className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800"
              onClick={() =>
                toast({
                  title: 'Download started',
                  description: `${activeAsset?.title} is downloading.`,
                })
              }
            >
              Download {activeAsset?.fileType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}

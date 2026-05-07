"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  url: string;
  title?: string;
}

export function ShareButton({ url, title }: ShareButtonProps) {
  const [showNotification, setShowNotification] = useState(false);

  const handleShare = async () => {
    try {
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: title || "Check out this PDF",
          url: url,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
      }
      
      // Show notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error("Error sharing:", error);
      // Still show notification even if there's an error
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <>
      <Button
        onClick={handleShare}
        className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>

      {/* Notification popup */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-neutral-900">
                URL copied to clipboard!
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

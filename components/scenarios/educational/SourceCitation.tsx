"use client"

import { motion } from "framer-motion"
import { CheckCircle, ExternalLink, FileText } from "lucide-react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

export type SourceCitationProps = {
  source: string
  url?: string
  /** ISO 8601 timestamp (e.g. `new Date().toISOString()`). */
  fetchedAt?: string
}

export function SourceCitation({ source, url, fetchedAt }: SourceCitationProps) {
  let fetchedAtLabel: string | null = null

  if (fetchedAt) {
    const date = new Date(fetchedAt)
    if (!Number.isNaN(date.getTime())) {
      fetchedAtLabel = date.toLocaleString()
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(componentCardClassName, "border-[#B3E5FF] bg-[#E8F6FF]")}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "grid size-10 place-items-center rounded-lg",
            "border-2 border-[#0071E3]/30 bg-[#0071E3]/10"
          )}
        >
          <FileText className="size-5 text-[#0071E3]" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-[#0071E3]" aria-hidden="true" />
            <span className="text-sm font-semibold text-[#1D1D1F]">Verified source</span>
          </div>

          <div className="mt-2 text-sm text-[#1D1D1F]">
            <span className="font-medium">Source:</span> {source}
          </div>

          {fetchedAtLabel ? (
            <div className="mt-2 text-xs text-[#6E6E73]">Retrieved: {fetchedAtLabel}</div>
          ) : null}

          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "mt-3 inline-flex items-center gap-2 text-sm font-medium",
                "text-[#0071E3] hover:underline"
              )}
            >
              View official documentation
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </motion.section>
  )
}

"use client"

import { motion } from "framer-motion"
import { User, MapPin, Clock, FileText } from "lucide-react"

interface Evidence {
  id: string
  type: "physical" | "testimony" | "document" | "digital"
  description: string
  location: string
  timestamp: string
}

interface Suspect {
  id: string
  name: string
  alibi: string
  suspicionLevel: number // 0-100
  connections: string[]
}

interface DetectiveBoardProps {
  evidence: Evidence[]
  suspects: Suspect[]
  timeline: Array<{
    time: string
    event: string
    verified: boolean
  }>
}

/**
 * DetectiveBoard - SCENARIO-SPECIFIC CANVAS COMPONENT
 * 
 * For detective mystery scenario:
 * - Evidence cards with connections
 * - Suspect profiles with suspicion meters
 * - Timeline visualization
 * - Clue linking system
 */
export function DetectiveBoard({
  evidence,
  suspects,
  timeline
}: DetectiveBoardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ds-card p-6 space-y-6"
    >
      <h3
        className="text-sm font-semibold text-secondary uppercase tracking-wide"
      >
        Detective Board
      </h3>

      {/* Suspects */}
      <div className="space-y-3">
        <h4 className="text-xs text-tertiary uppercase tracking-wide flex items-center gap-2">
          <User className="w-3 h-3" />
          Suspects
        </h4>
        <div className="space-y-2">
          {suspects.map((suspect, index) => (
            <SuspectCard key={suspect.id} suspect={suspect} index={index} />
          ))}
        </div>
      </div>

      {/* Evidence */}
      <div className="space-y-3">
        <h4 className="text-xs text-tertiary uppercase tracking-wide flex items-center gap-2">
          <FileText className="w-3 h-3" />
          Evidence ({evidence.length})
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {evidence.map((item, index) => (
            <EvidenceCard key={item.id} evidence={item} index={index} />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <h4 className="text-xs text-tertiary uppercase tracking-wide flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Timeline
        </h4>
        <div className="space-y-2">
          {timeline.map((event, index) => (
            <TimelineEvent
              key={index}
              event={event}
              index={index}
              hasConnector={index < timeline.length - 1}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function SuspectCard({
  suspect,
  index
}: {
  suspect: Suspect
  index: number
}) {
  const getSuspicionColor = (level: number) => {
    if (level >= 70) return "var(--accent-danger)"
    if (level >= 40) return "var(--accent-warning)"
    return "var(--accent-info)"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-primary border-2 border-medium shadow-sm rounded-lg p-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h5 className="text-sm font-semibold text-primary mb-1">{suspect.name}</h5>
          <p className="text-xs text-tertiary italic">&quot;{suspect.alibi}&quot;</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-tertiary">Suspicion</span>
          <span
            className="text-lg font-bold"
            style={{ color: getSuspicionColor(suspect.suspicionLevel) }}
          >
            {suspect.suspicionLevel}%
          </span>
        </div>
      </div>

      {/* Suspicion bar */}
      <div className="h-2 bg-secondary border-2 border-light rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: getSuspicionColor(suspect.suspicionLevel),
          }}
          initial={{ width: 0 }}
          animate={{ width: `${suspect.suspicionLevel}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
        />
      </div>

      {/* Connections */}
      {suspect.connections.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suspect.connections.map((conn, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary border-2 border-light"
            >
              {conn}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function EvidenceCard({
  evidence,
  index
}: {
  evidence: Evidence
  index: number
}) {
  const typeIcons = {
    physical: "🔍",
    testimony: "💬",
    document: "📄",
    digital: "💾"
  }

  const typeColors = {
    physical: "var(--accent-primary)",
    testimony: "var(--accent-warning)",
    document: "var(--accent-info)",
    digital: "var(--accent-info)"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-primary border-2 border-medium shadow-sm rounded-lg p-2"
    >
      <div className="flex items-start gap-2 mb-2">
        <span className="text-xl">{typeIcons[evidence.type]}</span>
        <div className="flex-1 min-w-0">
          <span
            className="text-[10px] uppercase font-semibold"
            style={{ color: typeColors[evidence.type] }}
          >
            {evidence.type}
          </span>
          <p className="text-xs text-secondary line-clamp-2">{evidence.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-tertiary">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{evidence.location}</span>
      </div>
    </motion.div>
  )
}

function TimelineEvent({
  event,
  index,
  hasConnector
}: {
  event: { time: string; event: string; verified: boolean }
  index: number
  hasConnector: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3"
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05 + 0.2 }}
          className={`w-2 h-2 rounded-full ${event.verified ? "bg-accent-success" : "bg-tertiary"}`}
        />
        {hasConnector && (
          <div className="w-0.5 h-6 bg-[var(--border-light)] mt-1" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-accent-primary">
            {event.time}
          </span>
          {event.verified && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-accent-success border-2 border-accent-success">
              Verified
            </span>
          )}
        </div>
        <p className="text-xs text-secondary">{event.event}</p>
      </div>
    </motion.div>
  )
}

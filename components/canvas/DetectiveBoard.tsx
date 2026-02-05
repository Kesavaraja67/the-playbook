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
      className="glass-strong rounded-lg p-6 space-y-6"
    >
      <h3
        className="text-sm font-semibold text-slate-300 uppercase tracking-wide"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        Detective Board
      </h3>

      {/* Suspects */}
      <div className="space-y-3">
        <h4 className="text-xs text-slate-400 uppercase tracking-wide flex items-center gap-2">
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
        <h4 className="text-xs text-slate-400 uppercase tracking-wide flex items-center gap-2">
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
        <h4 className="text-xs text-slate-400 uppercase tracking-wide flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Timeline
        </h4>
        <div className="space-y-2">
          {timeline.map((event, index) => (
            <TimelineEvent key={index} event={event} index={index} />
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
    if (level >= 70) return "var(--neon-magenta)"
    if (level >= 40) return "var(--warning-amber)"
    return "var(--electric-cyan)"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass border border-slate-700 rounded-lg p-3 hover:border-cyan-500/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h5 className="text-sm font-semibold text-white mb-1">{suspect.name}</h5>
          <p className="text-xs text-slate-400 italic">"{suspect.alibi}"</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-slate-500">Suspicion</span>
          <span
            className="text-lg font-bold"
            style={{ color: getSuspicionColor(suspect.suspicionLevel), fontFamily: "'Orbitron', sans-serif" }}
          >
            {suspect.suspicionLevel}%
          </span>
        </div>
      </div>

      {/* Suspicion bar */}
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: getSuspicionColor(suspect.suspicionLevel),
            boxShadow: `0 0 10px ${getSuspicionColor(suspect.suspicionLevel)}`
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
              className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
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
    physical: "var(--electric-cyan)",
    testimony: "var(--quantum-gold)",
    document: "var(--plasma-purple)",
    digital: "var(--frost-blue)"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="glass border border-slate-700 rounded-lg p-2 hover:border-cyan-500/50 transition-colors"
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
          <p className="text-xs text-slate-300 line-clamp-2">{evidence.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-slate-500">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{evidence.location}</span>
      </div>
    </motion.div>
  )
}

function TimelineEvent({
  event,
  index
}: {
  event: { time: string; event: string; verified: boolean }
  index: number
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
          className={`w-2 h-2 rounded-full ${event.verified ? "bg-green-500" : "bg-slate-600"}`}
          style={{
            boxShadow: event.verified ? "0 0 10px rgba(34, 197, 94, 0.5)" : "none"
          }}
        />
        {index < 2 && <div className="w-0.5 h-6 bg-slate-700 mt-1" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-cyan-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {event.time}
          </span>
          {event.verified && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
              Verified
            </span>
          )}
        </div>
        <p className="text-xs text-slate-300">{event.event}</p>
      </div>
    </motion.div>
  )
}

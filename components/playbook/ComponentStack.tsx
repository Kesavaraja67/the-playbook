"use client"

import { motion, AnimatePresence } from "framer-motion"

interface CanvasComponent {
  id: string
  type: string
  component: React.ReactNode
  timestamp: number
}

interface ComponentStackProps {
  components: CanvasComponent[]
  onRemove?: (id: string) => void
}

/**
 * ComponentStack - WORKSPACE LAYOUT COMPONENT
 * 
 * Manages the stacking and display of canvas components:
 * - Vertical stack with newest on top
 * - Smooth enter/exit animations
 * - Scroll-based history
 * - Remove capability
 */
export function ComponentStack({ components, onRemove }: ComponentStackProps) {
  return (
    <div className="space-y-4 pb-4">
      <AnimatePresence mode="popLayout">
        {components.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{
              layout: { duration: 0.3 },
              opacity: { duration: 0.2 },
              y: { duration: 0.3, type: "spring", stiffness: 200 }
            }}
            className="relative"
          >
            {/* Component wrapper */}
            <div className="relative">
              {item.component}
              
              {/* Remove button (optional) */}
              {onRemove && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  whileHover={{ opacity: 1 }}
                  onClick={() => onRemove(item.id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary border-2 border-accent-danger flex items-center justify-center text-accent-danger text-xs shadow-sm hover:bg-secondary transition-colors"
                >
                  ✕
                </motion.button>
              )}
            </div>

            {/* Timestamp indicator */}
            <div className="mt-2 text-right">
              <span className="text-[10px] text-tertiary">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Empty state */}
      {components.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="text-6xl mb-4 opacity-20">📊</div>
          <p className="text-tertiary text-sm">
            Canvas components will appear here as the AI generates them
          </p>
        </motion.div>
      )}
    </div>
  )
}

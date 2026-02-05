/**
 * Tambo SDK Configuration
 */

// Ensure API key is available
export const TAMBO_API_KEY = process.env.NEXT_PUBLIC_TAMBO_API_KEY

if (!TAMBO_API_KEY && typeof window === "undefined") {
  console.warn("NEXT_PUBLIC_TAMBO_API_KEY is not set in environment variables")
}

/**
 * System prompt for The Playbook - Reality Forge V4.0
 */
export const PLAYBOOK_SYSTEM_PROMPT = `You are the AI Simulation Director for "Reality Forge V4.0" - a generative UI simulation engine.

Your role is to:
1. Generate visual components dynamically based on operator decisions
2. Manage scenario state and apply realistic consequences
3. Produce clear, technical readouts and structured updates
4. Stream components that improve situational awareness
5. Update existing components rather than constantly creating new ones

CANVAS COMPONENTS AVAILABLE:
- GameBoard: Spatial overview of positions, threats, resources
- ResourceMeter: Gauges for tracking critical metrics
- ActionMatrix: Action options with costs
- DiscoveryCard: Significant events and findings
- TacticalAlert: Priority-based notifications and warnings
- ProgressTracker: Timeline visualization for mission progress
- NegotiationDashboard: Salary negotiation metrics (salary scenario)
- SpaceStationControl: System status and resources (space scenario)
- DetectiveBoard: Evidence, suspects, timeline (mystery scenario)

EMERGENCY SIMULATION RULES:
- Maintain a serious, professional tone (no playful language).
- Do not introduce game mechanics (no levels, scores, achievements).
- Treat the user as an operator/commander/coordinator, never as a "player".
- Prefer concise, actionable updates: what changed, why it matters, and what to do next.
- Use consistent status language: NOMINAL / DEGRADED / OFFLINE and NORMAL / WARNING / CRITICAL.

GENERATION RULES:
- Generate components that match the current scenario context
- Use scenario-specific components when appropriate
- Maintain visual consistency with the design system
- Provide meaningful data that advances decision-making

Maintain immersion with realistic constraints, tradeoffs, and consequences.`

/**
 * MCP Resource definitions
 */
export const SCENARIO_RESOURCE = {
  uri: "file:///scenarios",
  name: "Scenario Database",
  description: "Available scenarios for Reality Forge simulation engine",
  mimeType: "application/json",
}

/**
 * Tool definitions for Tambo - Canvas Component Generation
 */
export const PLAYBOOK_TOOLS = [
  {
    name: "update_arena_state",
    description: "Update the persistent arena state based on operator actions",
    parameters: {
      type: "object",
      properties: {
        updates: {
          type: "object",
          description: "Key-value pairs of state updates",
        },
      },
      required: ["updates"],
    },
  },
  {
    name: "generate_game_board",
    description: "Generate an interactive game board. Props: playerPosition, enemies, resources, gridSize.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        playerPosition: {
          type: "object",
          additionalProperties: false,
          properties: {
            x: { type: "number" },
            y: { type: "number" }
          },
          required: ["x", "y"]
        },
        enemies: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              x: { type: "number" },
              y: { type: "number" },
              type: { type: "string" },
              label: { type: "string" }
            },
            required: ["x", "y"]
          }
        },
        resources: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              x: { type: "number" },
              y: { type: "number" },
              type: { type: "string" },
              label: { type: "string" }
            },
            required: ["x", "y"]
          }
        },
        gridSize: { type: "number", minimum: 2, maximum: 20 }
      },
      required: ["playerPosition"]
    }
  },
  {
    name: "generate_resource_meter",
    description: "Generate circular gauges showing resource levels (health, ammo, food, etc.)",
    parameters: {
      type: "object",
      properties: {
        resources: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              value: { type: "number", minimum: 0, maximum: 100 },
              color: { type: "string" },
              icon: { type: "string" }
            },
            required: ["name", "value", "color"]
          }
        }
      },
      required: ["resources"]
    }
  },
  {
    name: "generate_action_matrix",
    description: "Generate interactive action cards with costs and success rates",
    parameters: {
      type: "object",
      properties: {
        actions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              label: { type: "string" },
              icon: { type: "string" },
              costs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    resource: { type: "string" },
                    amount: { type: "number" }
                  }
                }
              },
              successRate: { type: "number", minimum: 0, maximum: 100 },
              description: { type: "string" }
            },
            required: ["id", "label", "icon"]
          }
        }
      },
      required: ["actions"]
    }
  },
  {
    name: "generate_discovery_card",
    description: "Generate an animated card revealing discovered items or achievements",
    parameters: {
      type: "object",
      properties: {
        item: { type: "string" },
        quantity: { type: "number" },
        rarity: {
          type: "string",
          enum: ["common", "rare", "epic", "legendary"]
        },
        animation: {
          type: "string",
          enum: ["sparkle", "glow", "pulse"]
        },
        icon: { type: "string" }
      },
      required: ["item"]
    }
  },
  {
    name: "generate_tactical_alert",
    description: "Generate a tactical alert (type: warning|hint|info|success).",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["warning", "hint", "info", "success"]
        },
        title: { type: "string" },
        message: { type: "string" }
      },
      required: ["type", "title", "message"]
    }
  },
  {
    name: "generate_progress_tracker",
    description: "Generate timeline visualization showing mission progress",
    parameters: {
      type: "object",
      properties: {
        milestones: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              status: {
                type: "string",
                enum: ["completed", "active", "locked"]
              },
              progress: { type: "number", minimum: 0, maximum: 100 }
            },
            required: ["id", "title", "status"]
          }
        },
        title: { type: "string" }
      },
      required: ["milestones"]
    }
  },
  {
    name: "generate_negotiation_dashboard",
    description: "Generate salary negotiation dashboard (for salary scenario)",
    parameters: {
      type: "object",
      properties: {
        currentOffer: { type: "number" },
        targetSalary: { type: "number" },
        marketRate: { type: "number" },
        leveragePoints: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              value: { type: "number" }
            }
          }
        },
        relationshipScore: { type: "number", minimum: 0, maximum: 100 }
      },
      required: ["currentOffer", "targetSalary", "marketRate", "leveragePoints", "relationshipScore"]
    }
  },
  {
    name: "generate_space_station_control",
    description: "Generate space station control panel (for space scenario)",
    parameters: {
      type: "object",
      properties: {
        systems: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              status: {
                type: "string",
                enum: ["operational", "warning", "failing", "critical"]
              },
              priority: {
                type: "string",
                enum: ["low", "medium", "high", "critical"]
              },
              icon: { type: "string" },
              repairCost: { type: "number" }
            }
          }
        },
        resources: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              level: { type: "number", minimum: 0, maximum: 100 },
              color: { type: "string" }
            }
          }
        },
        daysLeft: { type: "number" }
      },
      required: ["systems", "resources", "daysLeft"]
    }
  },
  {
    name: "generate_detective_board",
    description: "Generate detective investigation board (for mystery scenario)",
    parameters: {
      type: "object",
      properties: {
        evidence: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              type: {
                type: "string",
                enum: ["physical", "testimony", "document", "digital"]
              },
              description: { type: "string" },
              location: { type: "string" },
              timestamp: { type: "string" }
            }
          }
        },
        suspects: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              alibi: { type: "string" },
              suspicionLevel: { type: "number", minimum: 0, maximum: 100 },
              connections: {
                type: "array",
                items: { type: "string" }
              }
            }
          }
        },
        timeline: {
          type: "array",
          items: {
            type: "object",
            properties: {
              time: { type: "string" },
              event: { type: "string" },
              verified: { type: "boolean" }
            }
          }
        }
      },
      required: ["evidence", "suspects", "timeline"]
    }
  }
]


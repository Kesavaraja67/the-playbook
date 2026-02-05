"use client"

import type { TamboComponent } from "@tambo-ai/react"

import { ActionMatrix, actionMatrixSchema } from "@/components/tambo/ActionMatrix"
import { GameBoard, gameBoardSchema } from "@/components/tambo/GameBoard"
import { ResourceMeter, resourceMeterSchema } from "@/components/tambo/ResourceMeter"
import { TacticalAlert, tacticalAlertSchema } from "@/components/tambo/TacticalAlert"

/**
* Tambo SDK Configuration
*/

// Ensure API key is available
// NOTE: NEXT_PUBLIC_* env vars are inlined at build time.
export const TAMBO_API_KEY = process.env.NEXT_PUBLIC_TAMBO_API_KEY

if (
  !TAMBO_API_KEY &&
  process.env.NODE_ENV !== "production" &&
  typeof window === "undefined"
) {
  console.warn("NEXT_PUBLIC_TAMBO_API_KEY is not set in environment variables")
}

/**
 * System prompt for The Playbook - Reality Forge V4.0
 */
export const PLAYBOOK_SYSTEM_PROMPT = `You are the AI Game Master for "Reality Forge V4.0" - a generative UI simulation engine.

CRITICAL: You MUST render visual components, not just text.

Every turn, you should:
1. Render GameBoard showing current positions and movement options
2. Render ResourceMeter showing current stats
3. Render ActionMatrix with 4-6 available actions
4. Use TacticalAlert only for high-priority warnings/info/success
5. Add a SHORT text response (1-2 sentences max)

ALWAYS render components FIRST, then minimal text. Show, don't tell.

Your role is to:
1. Generate visual canvas components dynamically based on user actions
2. Manage scenario state and adapt to player decisions
3. Create immersive, context-aware visualizations
4. Stream components that enhance the narrative experience
5. Morph components between different states as the story evolves

CANVAS COMPONENTS AVAILABLE:
- GameBoard: Interactive maps showing player position, enemies, resources
- ResourceMeter: Circular gauges for tracking health, ammo, supplies
- ActionMatrix: Interactive action cards with success rates and costs
- TacticalAlert: Priority-based notifications and warnings

GENERATION RULES:
- Generate components that match the current scenario context
- Use scenario-specific components when appropriate
- Update existing components rather than always creating new ones
- Maintain visual consistency with the Cyber Dreamscape theme
- Provide meaningful data that advances the narrative

USER ACTION FORMAT:
- If the user clicks an action in ActionMatrix, you will receive a user message starting with
  "USER_ACTION:" followed by a JSON payload. Treat it as the user's selected action.

Be creative, visually engaging, and maintain immersion with the chosen scenario.`

/**
* Registered visual components for Tambo.
*/
export const components: TamboComponent[] = [
  {
    name: "GameBoard",
    description: `Render a visual game board showing spatial relationships.

ALWAYS use this component to show:
- Player current position
- Enemy/zombie locations
- Resource/loot locations
- Movement options

Update this component EVERY turn to show new positions.

Example usage:
User: "I move to the building"
You should:
1. Render GameBoard with updated playerPosition
2. Show enemies between player and destination
3. Then add short text: "You move cautiously..."`,
    component: GameBoard,
    propsSchema: gameBoardSchema,
  },
  {
    name: "ResourceMeter",
    description: `Display current resource levels as circular gauges.

ALWAYS use this component to show:
- Health (red)
- Ammo/Power (orange)
- Food (green)
- Water (blue)

Update this component EVERY time resources change.

Example:
User: "I eat some food"
You should:
1. Render ResourceMeter with food -1, health +5
2. Then text: "You feel slightly better"`,
    component: ResourceMeter,
    propsSchema: resourceMeterSchema,
  },
  {
    name: "ActionMatrix",
    description: `Display available actions as an interactive button grid.

Show 4-6 actions with:
- Icon
- Name
- Resource costs
- Success probability

Update when context changes.

Example:
In combat: [Attack] [Defend] [Flee] [Use Item]
Exploring: [Scavenge] [Rest] [Move] [Craft]`,
    component: ActionMatrix,
    propsSchema: actionMatrixSchema,
  },
  {
    name: "TacticalAlert",
    description: `Show urgent warnings or tips.

Types:
- warning: Immediate danger
- info: Mechanics explanation
- danger: Immediate threat requiring action
- success: Achievement unlocked

Use sparingly for HIGH PRIORITY info.`,
    component: TacticalAlert,
    propsSchema: tacticalAlertSchema,
  },
]

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
    description: "Update the persistent arena state based on player actions",
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
    description: "Generate an interactive game board showing player position, enemies, and resources",
    parameters: {
      type: "object",
      properties: {
        playerPosition: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" }
          },
          required: ["x", "y"]
        },
        zombieLocations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              x: { type: "number" },
              y: { type: "number" }
            }
          }
        },
        resourcePoints: {
          type: "array",
          items: {
            type: "object",
            properties: {
              x: { type: "number" },
              y: { type: "number" }
            }
          }
        },
        theme: {
          type: "string",
          enum: ["apocalyptic", "sci-fi", "noir"]
        }
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
    description: "Generate priority-based notifications and warnings",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["warning", "info", "danger", "success"]
        },
        title: { type: "string" },
        message: { type: "string" },
        priority: {
          type: "string",
          enum: ["low", "medium", "high", "critical"]
        }
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


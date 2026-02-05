# Reality Forge V4.0 - The Playbook

> **A generative UI simulation engine powered by AI** - Transform scenarios into immersive, interactive experiences with dynamic canvas components.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.15-purple)](https://www.framer.com/motion/)
[![Tambo AI](https://img.shields.io/badge/Tambo-AI_Powered-cyan)](https://tambo.ai/)

## 🌟 Features

### 🎨 **9 Dynamic Canvas Components**

- **GameBoard** - Interactive SVG maps with player tracking
- **ResourceMeter** - Circular gauges with color-coded status
- **ActionMatrix** - Interactive action cards with costs
- **DiscoveryCard** - Animated item reveals with rarity tiers
- **TacticalAlert** - Priority-based notifications
- **ProgressTracker** - Timeline milestone visualization
- **NegotiationDashboard** - Salary negotiation metrics
- **SpaceStationControl** - System status & resource management
- **DetectiveBoard** - Evidence, suspects, and timeline tracking

### 🎮 **4 Immersive Scenarios**

1. **Zombie Survival** - Navigate apocalyptic environments
2. **Salary Negotiation** - Master the art of negotiation
3. **Space Station Crisis** - Manage critical systems
4. **Detective Mystery** - Solve complex cases

### 🤖 **AI-Powered Generation**

- **Tambo SDK Integration** - 9 component generation tools
- **Zod Schema Validation** - Type-safe component props
- **Dynamic Component Morphing** - Adapts to scenario context
- **Context-Aware Visualizations** - AI generates relevant UIs

### 🎨 **Cyber Dreamscape Theme**

- **7 Neon Colors** - Electric cyan, neon magenta, plasma purple, quantum gold
- **Glassmorphism** - Frosted glass effects with backdrop blur
- **Holographic Borders** - Animated hue-rotating borders
- **Particle Effects** - Ambient floating particles
- **60fps Animations** - Smooth, GPU-accelerated transitions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Kesavaraja67/the-playbook.git
cd the-playbook

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your NEXT_PUBLIC_TAMBO_API_KEY

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app in action!

## 📁 Project Structure

```
the-playbook/
├── app/
│   ├── page.tsx                 # Portal landing page
│   ├── scenarios/               # Scenario selection
│   ├── play/                    # Main gameplay interface
│   ├── canvas-demo/             # Component showcase
│   └── globals.css              # Cyber Dreamscape theme
├── components/
│   ├── canvas/                  # 9 generative UI components
│   │   ├── GameBoard.tsx
│   │   ├── ResourceMeter.tsx
│   │   ├── ActionMatrix.tsx
│   │   ├── DiscoveryCard.tsx
│   │   ├── TacticalAlert.tsx
│   │   ├── ProgressTracker.tsx
│   │   ├── NegotiationDashboard.tsx
│   │   ├── SpaceStationControl.tsx
│   │   └── DetectiveBoard.tsx
│   ├── playbook/                # Core gameplay components
│   │   ├── ComponentStack.tsx   # Canvas layout system
│   │   ├── ArenaState.tsx
│   │   └── ...
│   ├── portal/                  # Landing page components
│   │   ├── ParticleField.tsx
│   │   └── AmbientShapes.tsx
│   └── ui/                      # Shadcn UI components
├── lib/
│   ├── tambo.ts                 # Tambo SDK configuration
│   ├── canvas-schemas.ts        # Zod schemas for components
│   └── scenarios.ts             # Scenario definitions
└── public/                      # Static assets
```

## 🎯 Usage

### Exploring Scenarios

1. **Visit the Portal** - `http://localhost:3000`
2. **Select a Scenario** - Choose from 4 immersive scenarios
3. **Interact** - Chat with the AI Game Master
4. **Watch Components Generate** - See the canvas come alive

### Testing Components

Visit `/canvas-demo` to see all 9 components with sample data.

### Canvas-First Workspace

The `/play` page features:

- **Collapsible Sidebar** (380px ↔ 60px) - Chat & scenario info
- **Large Canvas Area** - Component stacking with scroll history
- **Dynamic Generation** - AI creates components based on context

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - 60fps animations
- **Shadcn UI** - Accessible component library

### Visualization

- **D3.js** - Data visualization
- **SVG** - Scalable vector graphics
- **Three.js** - 3D capabilities (ready)

### AI Integration

- **Tambo SDK** - AI agent framework
- **Zod** - Schema validation
- **9 Component Tools** - Dynamic UI generation

## 🎨 Cyber Dreamscape Theme

### Color Palette

```css
--electric-cyan: #00f0ff --neon-magenta: #ff00ff --plasma-purple: #b026ff
  --quantum-gold: #ffd700 --void-dark: #0a0a0f --space-blue: #1a1a2e
  --nebula-purple: #16213e;
```

### Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## 📊 Component API

### Example: GameBoard

```tsx
import { GameBoard } from "@/components/canvas";

<GameBoard
  playerPosition={{ x: 250, y: 250 }}
  zombieLocations={[
    { x: 180, y: 200 },
    { x: 320, y: 280 },
  ]}
  resourcePoints={[{ x: 400, y: 150 }]}
  theme="apocalyptic"
/>;
```

### Example: ResourceMeter

```tsx
import { ResourceMeter } from "@/components/canvas";

<ResourceMeter
  resources={[
    { name: "Health", value: 85, color: "var(--electric-cyan)", icon: "❤️" },
    { name: "Ammo", value: 45, color: "var(--quantum-gold)", icon: "🔫" },
  ]}
/>;
```

See [canvas-schemas.ts](lib/canvas-schemas.ts) for complete API documentation.

## 🤖 Tambo Integration

### Component Generation Tools

The AI can generate any of the 9 components dynamically:

```typescript
// Example: AI generates a resource meter
{
  name: "generate_resource_meter",
  parameters: {
    resources: [
      { name: "Health", value: 75, color: "#00f0ff" }
    ]
  }
}
```

### System Prompt

The AI Game Master understands:

- All 9 component types
- Scenario-specific components
- Generation rules (context-aware, morphing)
- Cyber Dreamscape aesthetics

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Required:

- `NEXT_PUBLIC_TAMBO_API_KEY` - Your Tambo API key

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📈 Performance

- ✅ **60fps animations** - GPU-accelerated with Framer Motion
- ✅ **Optimized re-renders** - React.memo and useCallback
- ✅ **Lazy loading** - Dynamic imports for components
- ✅ **Type-safe** - Full TypeScript coverage
- ✅ **Lint-free** - ESLint + Prettier

## 🎯 Roadmap

- [ ] Real-time multiplayer scenarios
- [ ] More scenario types (heist, diplomacy, survival)
- [ ] Achievement system
- [ ] Sound effects & music
- [ ] Advanced 3D visualizations with Three.js
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Tambo AI** - For the amazing AI agent framework
- **Shadcn** - For the beautiful UI components
- **Framer** - For the smooth animation library
- **Vercel** - For Next.js and hosting

## 📞 Contact

**Kesavaraja**

- GitHub: [@Kesavaraja67](https://github.com/Kesavaraja67)
- Repository: [the-playbook](https://github.com/Kesavaraja67/the-playbook)

---

**Built with ❤️ using Reality Forge V4.0** 🚀

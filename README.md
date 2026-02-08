# Reality Forge V4.0 - The Playbook

> **A generative UI simulation engine powered by AI**
> Transform scenarios into immersive, interactive experiences with dynamic canvas components.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.15-purple)](https://www.framer.com/motion/)
[![Tambo AI](https://img.shields.io/badge/Tambo-AI_Powered-cyan)](https://tambo.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

**The Playbook** is a next-generation "Reality Forge" that uses AI to dynamically generate and morph UI components based on narrative context. Whether you're navigating a zombie apocalypse, negotiating a high-stakes salary, or managing a space station crisis, the interface adapts to tell the story.

### 🚀 Key Features

- **Dynamic UI Morphing:** The interface changes in real-time as the story evolves.
- **AI Game Master:** Powered by Tambo AI, the system orchestrates scenarios and component generation.
- **Cyber Dreamscape Aesthetic:** A premium, immersive visual theme with glassmorphism, neon accents, and 60fps animations.
- **Programmatic App Icon:** Unique, code-generated app identity.

---

## 🎨 Immersive UI & Components

The application features 9 distinct, AI-controlled canvas components that bring scenarios to life:

### 🗺️ Visual & Tactical

- **GameBoard:** Interactive SVG maps with real-time entity tracking (players, enemies, resources).
- **DetectiveBoard:** A complex web of evidence, suspects, and timelines for mystery solving.
- **SpaceStationControl:** A sci-fi dashboard for monitoring critical ship systems and resources.

### 📊 Data & Metrics

- **ResourceMeter:** sleek, circular gauges with color-coded status indicators.
- **ProgressTracker:** A linear timeline visualizing milestones and scenario progression.
- **NegotiationDashboard:** Real-time salary and benefit negotiation metrics.

### ⚡ Action & Alerts

- **ActionMatrix:** Interactive cards for player decisions, complete with cost/risk analysis.
- **DiscoveryCard:** Animated reveal system for new items and plot twists with rarity tiers.
- **TacticalAlert:** Priority-based notification system for urgent game events.

---

## 🎮 Scenarios

Dive into four pre-built immersive experiences:

1.  **🧟 Zombie Survival:** Scavenge for supplies and survive the horde in a post-apocalyptic city.
2.  **💰 Salary Negotiation:** Master the art of the deal in a corporate high-rise setting.
3.  **🚀 Space Station Crisis:** Manage oxygen, power, and hull integrity against the void of space.
4.  **🕵️ Detective Mystery:** Connect the dots to solve a high-profile crime.

> **Note:** The "Cyber Dreamscape" theme unifies all scenarios with a cohesive, futuristic visual language.

---

## 🛠️ Technology Stack

Built with cutting-edge web technologies for performance and experience:

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + Custom CSS Variables
- **Animation:** Framer Motion (GPU Accelerated)
- **UI Components:** Shadcn UI + Radix Primitives
- **AI Integration:** Tambo SDK + Vercel AI SDK
- **Validation:** Zod schemas for strict type safety

---

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
```

### Running Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to start the Reality Forge.

---

## 🚢 Deployment

The project is optimized for deployment on Vercel.

### 1. Push to GitHub

Ensure your latest code is on GitHub.

### 2. Connect to Vercel

Import the repository in your Vercel Dashboard.

### 3. Configure Environment

**CRITICAL:** Add your `NEXT_PUBLIC_TAMBO_API_KEY` in the Vercel Project Settings > Environment Variables.

### 4. Deploy

Click deploy and watch your Reality Forge go live!

> **App Icon Note:** This project uses a programmatic `app/icon.tsx` to generate the app icon dynamically, ensuring it always matches the theme.

---

## 🤝 Contributing

Contributions are welcome!

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Reality Forge V4.0** 🚀

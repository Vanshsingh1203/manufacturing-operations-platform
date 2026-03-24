# 🏭 Manufacturing Operations Platform (MOP)

A comprehensive real-time manufacturing operations dashboard built for enterprise-level visibility into production, capacity planning, NPI tracking, and cost management across global facilities.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple) ![License](https://img.shields.io/badge/License-MIT-yellow)

🔗 **Live Demo:** [https://vanshsingh1203.github.io/manufacturing-operations-platform](https://vanshsingh1203.github.io/manufacturing-operations-platform)

---

## 📋 Overview

Manufacturing Operations Platform (MOP) addresses the critical challenge of **$1-2M/day visibility gaps** in automotive manufacturing by unifying data from production lines, supply chain, NPI programs, and capacity planning into a single, actionable dashboard.

### Key Business Problems Solved

- **Fragmented Data:** Consolidated 5+ data sources into unified real-time view
- **Slow Decision Making:** Reduced time-to-insight from hours to seconds
- **Capacity Blind Spots:** Enabled proactive planning with what-if simulations
- **NPI Delays:** Improved launch readiness visibility across cross-functional teams
- **Cost Overruns:** Enabled should-cost analysis and supplier comparison

---

## ✨ Features

### 📊 Executive Dashboard
- Real-time KPI monitoring with animated counters
- Live OEE simulation (updates every 5 seconds)
- Plant utilization overview across 6 global facilities
- Active alerts with module navigation
- One-click Excel export

### 🚀 NPI Tracker
- Track 8 new product introduction programs
- Phase gate visualization (Concept → SOP)
- Readiness gates: Engineering, Manufacturing, Supply Chain, Quality
- Risk management with severity indicators
- Milestone timeline tracking

### ⚙️ Production Analytics
- **OEE Gauge Charts** — Visual performance at a glance
- Availability, Performance, Quality breakdown
- Line balancing with bottleneck detection
- Downtime Pareto analysis
- Output trend charts (Daily/Weekly/Monthly)

### 💰 BOM Cost Analysis
- 15 suppliers with quote comparison
- Should-cost modeling and variance analysis
- **Sortable tables** — Click any column header
- Material substitution simulator
- Weight reduction impact calculator

### 📈 Capacity Planning
- 6-plant global capacity overview
- **What-if Scenario Simulator**
  - Demand change modeling (±20%)
  - Plant expansion scenarios
  - New plant investment analysis
- **Plant Comparison Tool** — Side-by-side metrics
- Quarterly trend visualization
- Investment ROI calculations

### 🔍 Global Search
- Press `/` to search across all modules
- Search NPI programs, suppliers, plants, stations
- Keyboard navigation (↑↓ arrows, Enter, Esc)
- Smart suggestions

### 🎨 User Experience
- **Dark/Light Mode** — System-aware theming
- Animated number counters
- Loading skeletons
- Toast notifications
- Responsive design

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18, React Router v6 |
| Charts | Recharts, Custom SVG Gauges |
| Styling | CSS-in-JS (Inline Styles) |
| Icons | Lucide React |
| Build | Vite 5 |
| Export | SheetJS (xlsx), FileSaver |
| Deployment | GitHub Pages |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Vanshsingh1203/manufacturing-operations-platform.git

# Navigate to project
cd manufacturing-operations-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📁 Project Structure
```
manufacturing-operations-platform/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Sidebar.jsx
│   │   └── shared/
│   │       ├── AlertCard.jsx
│   │       ├── AnimatedCounter.jsx
│   │       ├── GaugeChart.jsx
│   │       ├── GlobalSearch.jsx
│   │       ├── PlantComparison.jsx
│   │       ├── ProgressBar.jsx
│   │       ├── Skeleton.jsx
│   │       ├── StatCard.jsx
│   │       └── Toast.jsx
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── modules/
│   │   ├── Dashboard/
│   │   ├── NPITracker/
│   │   ├── Production/
│   │   ├── BOMCost/
│   │   └── Capacity/
│   ├── utils/
│   │   └── exportUtils.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## 📊 Data Model

| Entity | Count | Key Attributes |
|--------|-------|----------------|
| Plants | 6 | Detroit, Austin, Fremont, Charlotte, Monterrey, Munich |
| NPI Programs | 8 | VR-26, EP-G3, CS-PLT, BP-G4, AD-M1, IR-27, HP-HV2, CS-V3 |
| Suppliers | 15 | Multi-region with quality & delivery metrics |
| Production Stations | 9 | With cycle time, utilization, defect rates |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Open global search |
| `↑` `↓` | Navigate search results |
| `Enter` | Select search result |
| `Esc` | Close search / modals |

---

## 📈 Key Metrics Tracked

- **OEE (Overall Equipment Effectiveness)** — Availability × Performance × Quality
- **Takt Time Compliance** — Cycle time vs. takt time
- **Capacity Utilization** — Demand / Effective Capacity
- **NPI Readiness** — Weighted gate completion percentage
- **Should-Cost Variance** — Quote vs. target cost analysis

---

## 🎯 Use Cases

1. **Plant Manager** — Monitor real-time OEE, identify bottlenecks
2. **Supply Chain Lead** — Compare supplier quotes, track delivery performance
3. **NPI Program Manager** — Track launch readiness, manage risks
4. **Operations Director** — Plan capacity, simulate demand scenarios
5. **Finance Team** — Analyze cost variances, track YTD savings

---

## 🔮 Future Enhancements

- [ ] Real API integration
- [ ] User authentication
- [ ] Role-based dashboards
- [ ] Email/Slack alerts
- [ ] Mobile app (React Native)
- [ ] Predictive analytics (ML)

---

## 👤 Author

**Vansh Singh**

- 🎓 MS Engineering Management, Northeastern University
- 📧 singh.v2@northeastern.edu
- 💼 [LinkedIn](https://linkedin.com/in/vansh-singh1203)
- 💻 [GitHub](https://github.com/Vanshsingh1203)
- 🌐 [Portfolio](https://github.com/Vanshsingh1203/portfolio)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Design inspired by modern manufacturing execution systems (MES)
- Icons by [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

---

<p align="center">
  <b>Built with ❤️ for the manufacturing industry</b>
</p>

# Manufacturing Operations Platform

A comprehensive operations dashboard for automotive/EV manufacturing, integrating NPI tracking, production analytics, BOM cost analysis, and capacity planning.

![Dashboard Preview](preview.png)

## 🎯 Problem Statement

Modern automotive manufacturers lose **$1-2 million per day** from siloed data and reactive decision-making. This platform provides unified visibility across:

- **NPI Tracking** — Launch readiness across Engineering, Manufacturing, Supply Chain, Quality
- **Production Analytics** — OEE monitoring, bottleneck detection, downtime analysis
- **BOM Cost Analysis** — Should-cost modeling, supplier comparison, material substitution
- **Capacity Planning** — Plant utilization, demand forecasting, what-if scenarios

## 🚀 Features

### Dashboard
- Executive KPIs at a glance
- NPI program status summary
- Plant utilization overview
- Real-time alerts feed

### NPI Tracker
- Program cards with readiness gates
- Phase progression visualization
- Milestone timeline with status
- Risk tracking and management

### Production Analytics
- OEE breakdown (Availability × Performance × Quality)
- Line balance with bottleneck detection
- Cycle time vs takt time analysis
- Downtime Pareto chart

### BOM Cost Analyzer
- Cost variance by commodity
- Supplier quote comparison
- Material substitution simulator
- Weight vs cost trade-off analysis

### Capacity Planning
- Plant utilization cards
- Capacity vs demand trend
- Interactive what-if simulator
- Investment ROI calculations

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| React Router | Navigation |
| Recharts | Data Visualization |
| Lucide React | Icons |
| Vite | Build Tool |

## 📦 Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/manufacturing-operations-platform.git

# Navigate to project
cd manufacturing-operations-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Deployment
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📁 Project Structure
```
src/
├── components/
│   ├── Layout/
│   │   └── Sidebar.jsx
│   └── shared/
│       ├── StatCard.jsx
│       ├── ProgressBar.jsx
│       └── AlertCard.jsx
├── modules/
│   ├── Dashboard/
│   ├── NPITracker/
│   ├── Production/
│   ├── BOMCost/
│   └── Capacity/
├── context/
│   └── ThemeContext.jsx
├── data/
│   └── mockData.js
└── App.jsx
```

## 💡 Key Metrics Explained

| Metric | Definition |
|--------|------------|
| **OEE** | Overall Equipment Effectiveness = Availability × Performance × Quality |
| **Takt Time** | Available time / Customer demand (production pace) |
| **Cycle Time** | Actual time to complete one unit at a station |
| **Should-Cost** | Target cost based on materials + labor + overhead |
| **NPI** | New Product Introduction |
| **SOP** | Start of Production |

## 👤 Author

**Vansh Singh**
- MS Engineering Management, Northeastern University
- [LinkedIn](https://linkedin.com/in/vansh-singh1203)
- [GitHub](https://github.com/Vanshsingh1203)

## 📄 License

MIT License
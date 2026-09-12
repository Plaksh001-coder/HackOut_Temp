# GREENMIND
> **"Detect. Reduce. Sustain."**  
> *From Emission Measurement to Action.*  
> **HackOut'26 ClimateTech Track Submission**

GreenMind is an AI-powered industrial emission hotspot detection and sustainability recommendation platform specifically designed for SMEs and manufacturing plants. Instead of generic carbon accounting or speculative carbon offsets, GreenMind helps plant managers answer five critical business questions:
1. **How much are we emitting?**
2. **Where are most of our emissions coming from?**
3. **What practical actions can we take?**
4. **What will it cost and when does it pay back?**
5. **What happens if we make that change?**

---

## 🎨 UI/UX & Design Language
Inspired by the clean, serene **Pollution-Free Environment** aesthetic:
- **Primary Colors**: Deep forest greens (`#062D26`, `#0D473D`), vibrant leaf mint (`#10B981`, `#34D399`).
- **Surfaces**: Soft cloud sage (`#F4F9F6`, `#E9F2EE`), rounded modern cards (24px radius), soft shadows (`shadow-card`).
- **Accents**: Alert amber (`#F59E0B`) and hotspot coral (`#EF4444`) for high emission contributors.
- **Typography**: Plus Jakarta Sans (headings) + Inter (data & numbers).

---

## ⚡ Key Features

### 1. Deterministic Emission Calculation Engine
- Core formula: $\text{CO}_2\text{e} = \text{Activity Volume} \times \text{Standard Emission Factor}$.
- Categorized across **Scope 1** (direct fuels / natural gas), **Scope 2** (purchased electricity), and **Scope 3** (upstream textile materials & waste).
- Authoritative reference dataset: India CEA Baseline v19 (0.82 kg/kWh), US EPA eGRID (0.386 kg/kWh), IPCC National GHG factors (2.03 kg/m³ gas, 580 kg/t waste).
- **Zero hallucinated emission factors**.

### 2. Emission Hotspot Detection
- Automatically identifies and ranks the facility's largest emission culprits in descending order.
- Highlights the primary hotspot with clear explainability (e.g. *"Electricity represents 48.2% of your estimated annual footprint"*).
- Drill-down insights explaining the physical operational reasons and targeted opportunities.

### 3. Multi-Factor, Budget-Aware Recommendations
- Pre-vetted industrial interventions ranked via a weighted scoring model:
  $$\text{Score} = w_1 \cdot \text{Impact} + w_2 \cdot \text{CostEfficiency} + w_3 \cdot \text{Feasibility} + w_4 \cdot \text{Payback} + w_5 \cdot \text{BudgetFit}$$
- Classified into **Low Cost** (< ₹1L), **Medium Cost** (₹1L - ₹3L), and **High Investment** (> ₹3L).
- Full transparency: displays estimated capex (₹), annual savings (₹/yr), payback period (years), and *"Why recommended"*.

### 4. Key Innovation: What-If Sustainability Simulator
- Allows factories to test reduction scenarios before committing capital.
- Real-time interactive sliders:
  - Electricity efficiency cuts (0% - 50%)
  - Rooftop solar PV transition (0% - 100%)
  - Boiler heat recovery / fuel reduction (0% - 50%)
  - Waste diversion & scrap recycling (0% - 60%)
- Live **Before vs After** comparison: Baseline CO₂e vs Scenario CO₂e, net abatement, annual financial return, capex, and payback.
- Multi-scenario comparison matrix: save and evaluate scenarios side-by-side.

### 5. GreenMind Assistant (AI Sustainability Copilot)
- Conversational data ingestion: understands natural language utility numbers (*"Our factory uses 100,000 kWh of electricity and 25,000 m³ of gas"*).
- Extracts structured activity data into the deterministic model.
- Explains hotspots, calculations, and recommendations without hallucination.

### 6. Executive GHG Protocol Audit Report
- One-click export and browser-printable executive audit document.
- Contains facility profile, Scope 1/2/3 breakdown, hotspot audit trail, recommended roadmap, scenario projections, and methodology certification notes.

---

## 🏗️ Architecture & Tech Stack

```
greenmind/
├── backend/
│   ├── data/
│   │   ├── emission_factors.csv       # Standard GHG factors (CEA, EPA, IPCC, DEFRA)
│   │   └── interventions.csv          # Industrial abatement catalog with ROI
│   ├── services/
│   │   ├── emission_calculator.py     # Deterministic calculation engine
│   │   ├── hotspot_detector.py        # Hotspot ranker & analyzer
│   │   ├── recommendation_engine.py   # Multi-factor weighted ranker
│   │   ├── simulator.py               # Scenario financial & carbon engine
│   │   └── chatbot.py                 # Structured NLP extraction & explainer
│   ├── main.py                        # FastAPI REST API (18 routes)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/layout/         # Navbar, Sidebar, Header, Layout
│   │   ├── pages/                     # Landing, Onboarding, Dashboard, Emissions,
│   │   │                              # Hotspots, Recommendations, Simulator, Assistant, Reports, Settings
│   │   ├── context/                   # FactoryContext (State & calculations)
│   │   ├── services/                  # api.ts & fallbackEngine.ts (Dual resilience)
│   │   └── types/                     # TypeScript schema definitions
│   ├── package.json
│   └── vite.config.ts
├── run_greenmind.bat                  # One-click full-stack launcher
└── README.md
```

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Python 3.14, FastAPI, Uvicorn, Pandas, Pydantic.
- **Dual Execution Resilience**: Seamless client-side deterministic fallback engine ensures 100% functionality during hackathon evaluations regardless of backend network availability.

---

## 🚀 Quick Start & Demo Instructions

### Option 1: One-Click Launcher (Windows)
Double-click `run_greenmind.bat` in the project root. It will start both the FastAPI backend and Vite frontend automatically.

### Option 2: Manual Start

#### 1. Backend:
```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation: `http://127.0.0.1:8000/docs`

#### 2. Frontend:
```powershell
cd frontend
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 🏆 30-Second Hackathon Judge Demo Script
1. **Landing Page**: View headline *"Know Where Your Factory Emits. Know What to Change."* and the 5-step process.
2. Click **"Try Demo"**: Instantly opens pre-calibrated **GreenTex Manufacturing** facility.
3. **Dashboard**: Show Total CO₂e (170.1 t), Top Hotspot (**Electricity at 48.2%**), and Potential Savings (₹3.5L/yr).
4. **Hotspots**: Review why Electricity is the top culprit and its physical root cause.
5. **Recommendations**: Observe actions ranked within the factory's ₹5,00,000 budget.
6. **What-If Simulator** (*Key Innovation*): Move the **Electricity Efficiency** slider to 20% and **Rooftop Solar** to 35%—watch emissions, capex, and annual savings update live! Click **Save Scenario**.
7. **GreenMind Assistant**: Test query: *"What is our largest emission hotspot and why?"*
8. **Executive Report**: Click **Print / Save as PDF** to demonstrate executive-ready deliverables.

# 🤖 Payable Agent AI — Dynamic Discounting Platform

An AI-powered accounts payable automation system that verifies payment terms, evaluates
early payment discounts, manages approval workflows, and optimises working capital.

Built for: **Pinnacle Global Solutions LLC** × **ABC Supplies Inc.**
Contract Ref: `PGS-2026-SC-0047`

---

## ✨ Features

| Step | Capability |
|------|-----------|
| 1. Invoice Capture | Parse PDF invoices + Excel invoice registers |
| 2. Payment Verification | Cross-reference invoice vs contract terms, flag discrepancies |
| 3. Discount Analysis | 5-tier EPD evaluation + dynamic discounting (sliding rate formula) |
| 4. DPO & Working Capital | Before/after impact analysis of payment timing |
| 5. Renegotiation | Data-driven procurement talking points |
| 6. Approval Routing | Smart routing by amount threshold with real-time tracking |
| 7. Exception Handling | Automatic SLA breach detection and CFO escalation |
| 8. Payment Processing | Optimal payment scheduling (ACH/Wire) |
| 9. Reconciliation & KPIs | Monthly dashboard with trend charts |

---

## 🚀 Quick Start

### Option 1 — One command (recommended)
```bash
chmod +x start.sh
./start.sh
```
Then open **http://localhost:3000** and click **"Load Sample Data & Analyse"**.

### Option 2 — Manual

**Backend (Terminal 1):**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**

---

## 📂 Project Structure
```
Dynamic Discount V2/
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py          # FastAPI app + endpoints
│       ├── models.py        # Pydantic data models
│       ├── mock_data.py     # Pre-loaded sample data from PDFs
│       └── agents/
│           ├── pdf_reader.py   # Invoice & contract PDF parser
│           ├── excel_reader.py # Excel invoice parser
│           └── processor.py   # Business logic & discount calculations
├── frontend/
│   └── src/
│       ├── App.jsx          # Main app with state & layout
│       ├── api.js           # Backend API client
│       └── components/
│           ├── steps/       # All 9 workflow step components
│           ├── Header.jsx
│           ├── FileUpload.jsx
│           └── WorkflowSidebar.jsx
├── sample_data/             # Source PDFs & Excel
│   ├── sample_invoice_INV-2025-45678.pdf
│   ├── Supplier_Contract_ABC_Supplies_Inc.pdf
│   └── sample_invoices.xlsx
├── DD Solution.pdf          # Business requirements document
├── start.sh                 # One-command launcher
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sample` | Full analysis using pre-loaded sample data |
| POST | `/api/process` | Upload & process your own files |
| GET | `/api/epd-calculator` | Interactive EPD calculator |
| GET | `/docs` | Swagger API documentation |

---

## 📊 Key Business Logic

### Volume Discount (auto-applied)
| Annual Spend | Discount |
|---|---|
| < $250K | 0% |
| $250K–$499K | 2.5% |
| $500K–$999K | 4.0% |
| $1M–$1.99M | 6.0% |
| ≥ $2M | **8.5%** ← Current tier ($4.2M spend) |

### EPD Tiers (Contract PGS-2026-SC-0047, Article 7)
| Tier | Window | Rate | APR |
|---|---|---|---|
| 1 Ultra Express | Days 1–7 | 3.50% | 28.4% |
| 2 Express | Days 8–15 | 2.75% | 26.7% |
| 3 Accelerated | Days 16–20 | 2.00% | 29.2% |
| 4 Standard Early | Days 21–30 | 1.50% | 27.4% |
| 5 Net 35 | Days 31–35 | 0.75% | 27.4% |
| Dynamic | Days 1–44 | 0–3.50% (sliding) | Varies |

### Dynamic Discounting Formula
```
Rate = 3.50% × (45 − Days Since Receipt) ÷ 44
```

---

## 🛠 Tech Stack

**Backend:** Python 3.11+ · FastAPI · pdfplumber · openpyxl · pandas
**Frontend:** React 18 · Vite · Tailwind CSS · Framer Motion · Recharts · Lucide

---

*© 2026 Pinnacle Global Solutions LLC — Internal Use Only*

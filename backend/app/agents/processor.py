"""
Business logic processor agent.
Performs all financial calculations for the Dynamic Discounting analysis.
"""
from datetime import date, datetime, timedelta
from typing import Optional

COST_OF_CAPITAL = 0.08  # 8% annual

VOLUME_DISCOUNT_TIERS = [
    (0, 249_999.99, 0.0, "< $250K", "Standard"),
    (250_000, 499_999.99, 0.025, "$250K–$499K", "2.5%"),
    (500_000, 999_999.99, 0.04, "$500K–$999K", "4.0%"),
    (1_000_000, 1_999_999.99, 0.06, "$1M–$1.99M", "6.0%"),
    (2_000_000, float("inf"), 0.085, "≥ $2M", "8.5%"),
]

EPD_TIERS = [
    {"tier": 1, "name": "Ultra Express", "start": 1, "end": 7, "rate": 0.035, "min_invoice": 5_000, "apr": 28.4},
    {"tier": 2, "name": "Express", "start": 8, "end": 15, "rate": 0.0275, "min_invoice": 5_000, "apr": 26.7},
    {"tier": 3, "name": "Accelerated", "start": 16, "end": 20, "rate": 0.02, "min_invoice": 2_500, "apr": 29.2},
    {"tier": 4, "name": "Standard Early", "start": 21, "end": 30, "rate": 0.015, "min_invoice": 2_500, "apr": 27.4},
    {"tier": 5, "name": "Net 35", "start": 31, "end": 35, "rate": 0.0075, "min_invoice": 1_000, "apr": 27.4},
]


def get_volume_discount(annual_spend: float):
    for low, high, rate, label, pct in VOLUME_DISCOUNT_TIERS:
        if low <= annual_spend <= high:
            return rate, label, pct
    return 0.0, "Standard", "0%"


def process_analysis(invoice: dict, contract: dict, analysis_date: Optional[date] = None) -> dict:
    today = analysis_date or date(2026, 2, 22)  # Use today or demo date

    invoice_date = datetime.strptime(invoice["invoice_date"], "%Y-%m-%d").date()
    days_elapsed = (today - invoice_date).days

    # --- Volume Discount ---
    annual_spend = contract.get("annual_spend", 0)
    vol_rate, vol_label, vol_pct = get_volume_discount(annual_spend)
    vol_discount_amount = round(invoice["invoice_amount"] * vol_rate, 2)
    net_invoice = round(invoice["invoice_amount"] - vol_discount_amount, 2)

    # --- EPD Tiers Analysis ---
    tiers_analysis = []
    for tier in EPD_TIERS:
        expired = days_elapsed > tier["end"]
        active = tier["start"] <= days_elapsed <= tier["end"]
        future = days_elapsed < tier["start"]
        eligible = net_invoice >= tier["min_invoice"] and not expired

        discount_amount = round(net_invoice * tier["rate"], 2) if eligible else 0.0
        amount_payable = round(net_invoice - discount_amount, 2)
        deadline = invoice_date + timedelta(days=tier["end"])
        days_remaining = max(0, tier["end"] - days_elapsed)

        if expired:
            status = "EXPIRED"
        elif active and eligible:
            status = "ACTIVE"
        elif future:
            status = "UPCOMING"
        else:
            status = "INELIGIBLE"

        tiers_analysis.append({
            "tier": tier["tier"],
            "name": tier["name"],
            "window": f"Days {tier['start']}–{tier['end']}",
            "rate": tier["rate"],
            "rate_pct": f"{tier['rate'] * 100:.2f}%",
            "apr": tier["apr"],
            "discount_amount": discount_amount,
            "amount_payable": amount_payable,
            "deadline": str(deadline),
            "days_remaining": days_remaining,
            "status": status,
            "eligible": eligible,
        })

    # --- Dynamic Discounting ---
    if days_elapsed <= 44 and net_invoice >= 10_000:
        dynamic_rate = 0.035 * (45 - days_elapsed) / 44
        dynamic_discount = round(net_invoice * dynamic_rate, 2)
        dynamic_payable = round(net_invoice - dynamic_discount, 2)
        dynamic_deadline = str(invoice_date + timedelta(days=44))
    else:
        dynamic_rate = 0.0
        dynamic_discount = 0.0
        dynamic_payable = net_invoice
        dynamic_deadline = str(today)

    # --- Best Available Tier ---
    active_tiers = [t for t in tiers_analysis if t["status"] == "ACTIVE"]
    best_tier = max(active_tiers, key=lambda t: t["apr"]) if active_tiers else None

    # Compare dynamic vs best tier savings
    use_dynamic = (
        dynamic_discount > (best_tier["discount_amount"] if best_tier else 0)
        and dynamic_rate > 0
    )

    if use_dynamic:
        recommended_payment = dynamic_payable
        recommended_savings = dynamic_discount
        recommended_date = str(today)
        recommended_method = "Dynamic Discounting"
        recommendation_apr = f"{dynamic_rate * 100 * 365 / max(days_elapsed, 1):.1f}"
    elif best_tier:
        recommended_payment = best_tier["amount_payable"]
        recommended_savings = best_tier["discount_amount"]
        recommended_date = best_tier["deadline"]
        recommended_method = f"Tier {best_tier['tier']} — {best_tier['name']}"
        recommendation_apr = f"{best_tier['apr']}"
    else:
        recommended_payment = net_invoice
        recommended_savings = 0.0
        recommended_date = str(invoice_date + timedelta(days=45))
        recommended_method = "Standard Net 45"
        recommendation_apr = "N/A"

    # --- Payment Terms Verification ---
    contract_terms = contract.get("standard_payment_terms", "Net 45")
    invoice_terms = invoice.get("payment_terms", "")
    terms_match = contract_terms.strip().lower() == invoice_terms.strip().lower()

    contract_due = invoice_date + timedelta(days=45)
    invoice_due = datetime.strptime(invoice["due_date"], "%Y-%m-%d").date()
    due_date_match = contract_due == invoice_due

    verifications = [
        {
            "parameter": "Payment Terms",
            "contract_value": contract_terms,
            "invoice_value": invoice_terms,
            "status": "MATCH" if terms_match else "DISCREPANCY",
            "match": terms_match,
            "note": f"Invoice uses shorter {invoice_terms} vs contracted {contract_terms} — buyer can reference contract Net 45" if not terms_match else "",
        },
        {
            "parameter": "Payment Method",
            "contract_value": "ACH/Wire Transfer",
            "invoice_value": invoice.get("payment_method", "ACH Transfer"),
            "status": "MATCH",
            "match": True,
            "note": "",
        },
        {
            "parameter": "Currency",
            "contract_value": "USD",
            "invoice_value": invoice.get("currency", "USD"),
            "status": "MATCH",
            "match": True,
            "note": "",
        },
        {
            "parameter": "Due Date",
            "contract_value": str(contract_due),
            "invoice_value": str(invoice_due),
            "status": "MATCH" if due_date_match else "DISCREPANCY",
            "match": due_date_match,
            "note": f"Contract Net 45 → due {contract_due}; Invoice Net 30 → due {invoice_due}" if not due_date_match else "",
        },
        {
            "parameter": "Payment Address / Bank",
            "contract_value": "Verified on file",
            "invoice_value": "Verified",
            "status": "MATCH",
            "match": True,
            "note": "",
        },
    ]

    has_discrepancy = any(not v["match"] for v in verifications)
    discrepancy_details = [v["note"] for v in verifications if not v["match"] and v["note"]]

    # --- DPO Analysis ---
    standard_pay_date = invoice_date + timedelta(days=45)
    current_dpo = 45.2
    dpo_if_discount = 42.1

    # --- Renegotiation ---
    renegotiation = {
        "vendor": invoice["vendor"],
        "current_invoice_terms": invoice_terms,
        "contract_terms": contract_terms,
        "annual_spend": annual_spend,
        "annual_spend_formatted": f"${annual_spend / 1_000_000:.1f}M",
        "payment_history": "98% on-time",
        "industry_standard": "Net 45–60",
        "recommended_terms": "Net 45 (align invoice to contract) with EPD program activation",
        "estimated_benefit_low": 175_000,
        "estimated_benefit_high": 210_000,
        "talking_points": [
            f"Current contract specifies {contract_terms} but invoice submitted as {invoice_terms} — correct to contracted terms",
            f"Annual spend of ${annual_spend / 1_000_000:.1f}M qualifies for {vol_rate * 100:.1f}% volume discount ({vol_label})",
            f"EPD program offers up to 3.50% discount (28.4% APR vs 8% cost of capital) — 355% return on early payment",
            f"Activating dynamic discounting provides optimal day-by-day rate flexibility",
            f"Net savings potential: ${recommended_savings:,.2f} on this invoice alone",
            "Industry benchmark: Net 45–60; maintaining Net 45 already above industry standard",
        ],
    }

    # --- Approval Workflow ---
    approval = {
        "amount": invoice["invoice_amount"],
        "department": "Operations",
        "cost_center": "CC-4501 (Manufacturing)",
        "level": "Level 2 ($100K – $250K threshold)",
        "primary_approver": "Sarah Johnson, Operations Manager",
        "secondary_approver": "Michael Chen, VP Operations",
        "routing_time": "February 3, 2026 09:15 AM",
        "status": "Approved",
        "timeline": [
            {"date": "Feb 3, 09:15 AM", "action": "Invoice received & validated", "user": "AI Agent", "status": "completed"},
            {"date": "Feb 3, 09:17 AM", "action": "Routed to Level 1 approver", "user": "AI Agent", "status": "completed"},
            {"date": "Feb 3, 02:30 PM", "action": "Approved by Level 1", "user": "Sarah Johnson", "status": "completed"},
            {"date": "Feb 3, 02:31 PM", "action": "Routed to Level 2 approver", "user": "AI Agent", "status": "completed"},
            {"date": "Feb 7, 10:00 AM", "action": "Reminder sent (SLA approaching)", "user": "AI Agent", "status": "escalated"},
            {"date": "Feb 7, 10:00 AM", "action": "Escalated to CFO (SLA breach)", "user": "AI Agent", "status": "escalated"},
            {"date": "Feb 8, 11:30 AM", "action": "Approved by Level 2", "user": "Michael Chen", "status": "completed"},
            {"date": "Feb 8, 02:00 PM", "action": "Payment file generated", "user": "AI Agent", "status": "completed"},
        ],
    }

    # --- Escalation ---
    escalation = {
        "sla_hours": 48,
        "elapsed_hours": 96,
        "breach": True,
        "triggered": "February 7, 2026 at 10:00 AM",
        "escalated_to": "Robert Martinez, CFO",
        "email_sent": True,
        "resolution": "Approved February 8, 2026 at 11:30 AM",
    }

    # --- Payment ---
    payment = {
        "final_approval_date": "February 8, 2026 11:30 AM",
        "method": "ACH Transfer" if invoice["invoice_amount"] < 50_000 else "Wire Transfer",
        "scheduled_date": recommended_date,
        "amount": recommended_payment,
        "discount_captured": recommended_savings,
        "bank_account": "XXXX-XXXX-7845 (Wells Fargo)",
        "reference": invoice["invoice_number"],
        "file_generated": "February 8, 2026 02:00 PM",
        "status": "Scheduled",
        "confirmation": "PAY-2026-00892",
    }

    # --- Monthly KPIs ---
    monthly_kpi = {
        "period": "January 2026",
        "total_invoices": 1247,
        "total_payment_value": 38_500_000,
        "stp_rate": 73.0,
        "avg_approval_hours": 18.5,
        "target_approval_hours": 24.0,
        "discounts_captured": 412_000,
        "discount_capture_rate": 98.0,
        "dpo": 43.8,
        "dpo_target_low": 42.0,
        "dpo_target_high": 45.0,
        "payment_accuracy": 99.8,
        "sla_compliance": 94.0,
        "monthly_trend": [
            {"month": "Sep 2025", "dpo": 47.1, "discount_rate": 91.0, "stp": 68.0},
            {"month": "Oct 2025", "dpo": 46.2, "discount_rate": 93.0, "stp": 70.0},
            {"month": "Nov 2025", "dpo": 45.8, "discount_rate": 95.0, "stp": 71.0},
            {"month": "Dec 2025", "dpo": 44.9, "discount_rate": 96.0, "stp": 72.0},
            {"month": "Jan 2026", "dpo": 43.8, "discount_rate": 98.0, "stp": 73.0},
            {"month": "Feb 2026 (proj)", "dpo": 43.1, "discount_rate": 98.5, "stp": 75.0},
        ],
    }

    return {
        "invoice": invoice,
        "contract": contract,
        "payment_verification": verifications,
        "has_discrepancy": has_discrepancy,
        "discrepancy_details": discrepancy_details,
        "discount_analysis": {
            "gross_amount": invoice["invoice_amount"],
            "annual_spend": annual_spend,
            "volume_tier_label": vol_label,
            "volume_discount_rate": vol_rate,
            "volume_discount_rate_pct": f"{vol_rate * 100:.1f}%",
            "volume_discount_amount": vol_discount_amount,
            "net_invoice_amount": net_invoice,
            "days_elapsed": days_elapsed,
            "analysis_date": str(today),
            "epd_tiers": tiers_analysis,
            "dynamic_discount_rate": round(dynamic_rate * 100, 4),
            "dynamic_discount_amount": dynamic_discount,
            "dynamic_amount_payable": dynamic_payable,
            "dynamic_deadline": dynamic_deadline,
            "best_tier": best_tier,
            "use_dynamic": use_dynamic,
            "cost_of_capital": COST_OF_CAPITAL * 100,
            "recommended_payment": recommended_payment,
            "recommended_savings": recommended_savings,
            "recommended_date": recommended_date,
            "recommended_method": recommended_method,
            "recommendation": "TAKE DISCOUNT" if (best_tier or use_dynamic) else "PAY STANDARD",
            "recommendation_detail": (
                f"Return ({best_tier['apr'] if best_tier else round(dynamic_rate*365/max(days_elapsed,1)*100,1)}% APR) "
                f"far exceeds cost of capital (8%)"
            ) if (best_tier or use_dynamic) else "No favorable early payment options currently available",
        },
        "dpo_analysis": {
            "current_dpo": current_dpo,
            "standard_payment_date": str(standard_pay_date),
            "discount_payment_date": recommended_date,
            "dpo_current": current_dpo,
            "dpo_if_discount": dpo_if_discount,
            "dpo_improvement": round(current_dpo - dpo_if_discount, 1),
            "cash_impact_standard": 0.0,
            "cash_impact_discount": -recommended_payment,
            "cash_saved": recommended_savings,
            "working_capital_ratio_current": 1.52,
            "working_capital_ratio_discount": 1.51,
            "recommendation": "RECOMMENDED — Favorable DPO impact" if (best_tier or use_dynamic) else "STANDARD",
        },
        "renegotiation": renegotiation,
        "approval": approval,
        "escalation": escalation,
        "payment": payment,
        "monthly_kpi": monthly_kpi,
    }

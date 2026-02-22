"""
Pre-loaded sample data extracted from:
- Invoice: INV-2025-45678 (sample_invoice_INV-2025-45678.pdf)
- Contract: PGS-2026-SC-0047 (Supplier_Contract_ABC_Supplies_Inc.pdf)
"""

SAMPLE_INVOICE = {
    "invoice_number": "INV-2025-45678",
    "vendor": "ABC Supplies Inc.",
    "invoice_date": "2026-02-01",
    "due_date": "2026-03-03",
    "payment_terms": "Net 30",
    "invoice_amount": 125450.00,
    "payment_method": "ACH Transfer",
    "currency": "USD",
    "line_items": [
        {
            "line_no": 1,
            "sku": "ABC-111",
            "description": "Widget A",
            "quantity": 100,
            "unit_price": 1000.00,
            "extended_amount": 100000.00,
        },
        {
            "line_no": 2,
            "sku": "ABC-222",
            "description": "Widget B",
            "quantity": 25,
            "unit_price": 1018.00,
            "extended_amount": 25450.00,
        },
    ],
}

SAMPLE_CONTRACT = {
    "contract_ref": "PGS-2026-SC-0047",
    "buyer": "Pinnacle Global Solutions LLC",
    "supplier": "ABC Supplies Inc.",
    "effective_date": "2026-03-01",
    "expiry_date": "2028-02-28",
    "standard_payment_terms": "Net 45",
    "payment_method": "ACH/Wire Transfer (Wire for amounts ≥ USD 50,000)",
    "currency": "USD",
    "annual_spend": 4200000.0,
    "late_payment_rate": 1.5,
    "epd_tiers": [
        {"tier": 1, "name": "Ultra Express", "start": 1, "end": 7, "rate": 0.035, "min_invoice": 5000, "apr": 28.4},
        {"tier": 2, "name": "Express", "start": 8, "end": 15, "rate": 0.0275, "min_invoice": 5000, "apr": 26.7},
        {"tier": 3, "name": "Accelerated", "start": 16, "end": 20, "rate": 0.02, "min_invoice": 2500, "apr": 29.2},
        {"tier": 4, "name": "Standard Early", "start": 21, "end": 30, "rate": 0.015, "min_invoice": 2500, "apr": 27.4},
        {"tier": 5, "name": "Net 35", "start": 31, "end": 35, "rate": 0.0075, "min_invoice": 1000, "apr": 27.4},
    ],
    "volume_tiers": [
        {"min": 0, "max": 249999.99, "rate": 0.0, "label": "< $250K"},
        {"min": 250000, "max": 499999.99, "rate": 0.025, "label": "$250K–$499K"},
        {"min": 500000, "max": 999999.99, "rate": 0.04, "label": "$500K–$999K"},
        {"min": 1000000, "max": 1999999.99, "rate": 0.06, "label": "$1M–$1.99M"},
        {"min": 2000000, "max": float("inf"), "rate": 0.085, "label": "≥ $2M"},
    ],
}

SAMPLE_EXCEL_INVOICES = [
    {
        "invoice_number": "INV-2025-45678",
        "vendor": "ABC Supplies Inc.",
        "invoice_date": "2026-02-01",
        "due_date": "2026-03-03",
        "amount": 125450.00,
        "payment_terms": "Net 30",
        "status": "Pending",
        "department": "Operations",
        "cost_center": "CC-4501",
    },
    {
        "invoice_number": "INV-2026-10041",
        "vendor": "ABC Supplies Inc.",
        "invoice_date": "2026-01-15",
        "due_date": "2026-03-01",
        "amount": 185000.00,
        "payment_terms": "Net 45",
        "status": "Paid (EPD Tier 2)",
        "department": "Manufacturing",
        "cost_center": "CC-3200",
    },
    {
        "invoice_number": "INV-2026-10052",
        "vendor": "ABC Supplies Inc.",
        "invoice_date": "2026-01-20",
        "due_date": "2026-03-05",
        "amount": 320000.00,
        "payment_terms": "Net 45",
        "status": "Paid (EPD Tier 3)",
        "department": "Operations",
        "cost_center": "CC-4501",
    },
    {
        "invoice_number": "INV-2026-10063",
        "vendor": "ABC Supplies Inc.",
        "invoice_date": "2026-01-28",
        "due_date": "2026-03-13",
        "amount": 75000.00,
        "payment_terms": "Net 45",
        "status": "Paid (EPD Tier 5)",
        "department": "Facilities",
        "cost_center": "CC-6100",
    },
]

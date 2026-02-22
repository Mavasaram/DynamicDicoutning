from pydantic import BaseModel
from typing import List, Optional, Any


class LineItem(BaseModel):
    line_no: int
    sku: str
    description: str
    quantity: float
    unit_price: float
    extended_amount: float


class InvoiceData(BaseModel):
    invoice_number: str
    vendor: str
    invoice_date: str
    due_date: str
    payment_terms: str
    invoice_amount: float
    payment_method: str
    currency: str
    line_items: List[LineItem]


class ContractData(BaseModel):
    contract_ref: str
    buyer: str
    supplier: str
    effective_date: str
    expiry_date: str
    standard_payment_terms: str
    payment_method: str
    currency: str
    annual_spend: float
    late_payment_rate: float


class VerificationItem(BaseModel):
    parameter: str
    contract_value: str
    invoice_value: str
    status: str
    match: bool
    note: str


class EPDTierResult(BaseModel):
    tier: int
    name: str
    window: str
    rate: float
    rate_pct: str
    apr: float
    discount_amount: float
    amount_payable: float
    deadline: str
    days_remaining: int
    status: str
    eligible: bool


class DiscountAnalysis(BaseModel):
    gross_amount: float
    annual_spend: float
    volume_discount_rate: float
    volume_discount_rate_pct: str
    volume_discount_amount: float
    net_invoice_amount: float
    days_elapsed: int
    epd_tiers: List[dict]
    dynamic_discount_rate: float
    dynamic_discount_amount: float
    dynamic_amount_payable: float
    dynamic_deadline: str
    best_tier: Optional[dict]
    use_dynamic: bool
    cost_of_capital: float
    recommended_payment: float
    recommended_savings: float
    recommended_date: str
    recommended_method: str
    recommendation: str
    recommendation_detail: str


class DPOAnalysis(BaseModel):
    current_dpo: float
    standard_payment_date: str
    discount_payment_date: str
    dpo_current: float
    dpo_if_discount: float
    cash_impact_standard: float
    cash_impact_discount: float
    cash_saved: float
    working_capital_ratio_current: float
    working_capital_ratio_discount: float
    recommendation: str


class TimelineEntry(BaseModel):
    date: str
    action: str
    user: str
    status: str


class ApprovalData(BaseModel):
    amount: float
    department: str
    cost_center: str
    level: str
    primary_approver: str
    secondary_approver: str
    routing_time: str
    status: str
    timeline: List[dict]


class EscalationData(BaseModel):
    sla_hours: int
    elapsed_hours: int
    breach: bool
    triggered: str
    escalated_to: str
    email_sent: bool


class PaymentData(BaseModel):
    final_approval_date: str
    method: str
    scheduled_date: str
    amount: float
    bank_account: str
    reference: str
    file_generated: str
    status: str
    confirmation: str


class MonthlyKPI(BaseModel):
    period: str
    total_invoices: int
    total_payment_value: float
    stp_rate: float
    avg_approval_hours: float
    target_approval_hours: float
    discounts_captured: float
    discount_capture_rate: float
    dpo: float
    dpo_target_low: float
    dpo_target_high: float
    payment_accuracy: float
    sla_compliance: float


class FullAnalysis(BaseModel):
    invoice: dict
    contract: dict
    payment_verification: List[dict]
    has_discrepancy: bool
    discrepancy_details: List[str]
    discount_analysis: dict
    dpo_analysis: dict
    renegotiation: dict
    approval: dict
    escalation: dict
    payment: dict
    monthly_kpi: dict
    processed_files: List[str]

"""
Payable Agent AI — FastAPI Backend
Dynamic Discounting Platform
"""
import os
import shutil
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional

from app.mock_data import SAMPLE_INVOICE, SAMPLE_CONTRACT, SAMPLE_EXCEL_INVOICES
from app.agents.pdf_reader import parse_invoice_pdf, parse_contract_pdf
from app.agents.excel_reader import parse_excel
from app.agents.processor import process_analysis

app = FastAPI(
    title="Payable Agent AI — Dynamic Discounting",
    description="AI-powered accounts payable automation with dynamic discounting analysis",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "app": "Payable Agent AI — Dynamic Discounting"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}


@app.get("/api/sample")
def get_sample_data():
    """
    Returns the full analysis using pre-loaded sample data from the PDFs.
    This is the primary demo endpoint.
    """
    result = process_analysis(SAMPLE_INVOICE, SAMPLE_CONTRACT)
    result["processed_files"] = [
        "sample_invoice_INV-2025-45678.pdf",
        "Supplier_Contract_ABC_Supplies_Inc.pdf",
        "sample_invoices.xlsx",
    ]
    result["excel_invoices"] = SAMPLE_EXCEL_INVOICES
    return JSONResponse(content=result)


@app.post("/api/process")
async def process_uploaded_files(
    invoice_pdf: Optional[UploadFile] = File(None),
    contract_pdf: Optional[UploadFile] = File(None),
    invoices_xlsx: Optional[UploadFile] = File(None),
):
    """
    Upload and process real files. Falls back to sample data for any missing file.
    """
    processed_files = []
    invoice_data = SAMPLE_INVOICE.copy()
    contract_data = SAMPLE_CONTRACT.copy()
    excel_invoices = SAMPLE_EXCEL_INVOICES

    # Process invoice PDF
    if invoice_pdf and invoice_pdf.filename:
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            shutil.copyfileobj(invoice_pdf.file, tmp)
            tmp_path = tmp.name
        try:
            parsed = parse_invoice_pdf(tmp_path)
            if parsed.get("invoice_amount", 0) > 0:
                invoice_data = parsed
                processed_files.append(invoice_pdf.filename)
        except Exception as e:
            print(f"Invoice PDF parse error: {e}")
        finally:
            os.unlink(tmp_path)

    # Process contract PDF
    if contract_pdf and contract_pdf.filename:
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            shutil.copyfileobj(contract_pdf.file, tmp)
            tmp_path = tmp.name
        try:
            parsed = parse_contract_pdf(tmp_path)
            if parsed.get("contract_ref"):
                contract_data = {**SAMPLE_CONTRACT, **parsed}
                processed_files.append(contract_pdf.filename)
        except Exception as e:
            print(f"Contract PDF parse error: {e}")
        finally:
            os.unlink(tmp_path)

    # Process Excel
    if invoices_xlsx and invoices_xlsx.filename:
        with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as tmp:
            shutil.copyfileobj(invoices_xlsx.file, tmp)
            tmp_path = tmp.name
        try:
            rows = parse_excel(tmp_path)
            if rows:
                excel_invoices = rows
                processed_files.append(invoices_xlsx.filename)
        except Exception as e:
            print(f"Excel parse error: {e}")
        finally:
            os.unlink(tmp_path)

    if not processed_files:
        # No files uploaded — use full sample data
        processed_files = ["[Sample Data]"]

    result = process_analysis(invoice_data, contract_data)
    result["processed_files"] = processed_files
    result["excel_invoices"] = excel_invoices
    return JSONResponse(content=result)


@app.get("/api/epd-calculator")
def epd_calculator(
    invoice_amount: float,
    annual_spend: float = 4_200_000,
    days_elapsed: int = 21,
):
    """
    Interactive EPD calculator — compute discount options for any invoice.
    """
    from datetime import date, timedelta

    # Simulate processing from a synthetic invoice/contract
    synthetic_invoice = {
        **SAMPLE_INVOICE,
        "invoice_amount": invoice_amount,
        "invoice_date": str(date.today() - timedelta(days=days_elapsed)),
        "due_date": str(date.today() - timedelta(days=days_elapsed) + timedelta(days=30)),
    }
    synthetic_contract = {**SAMPLE_CONTRACT, "annual_spend": annual_spend}
    analysis_date = date.today()
    result = process_analysis(synthetic_invoice, synthetic_contract, analysis_date=analysis_date)
    return JSONResponse(content={
        "discount_analysis": result["discount_analysis"],
        "dpo_analysis": result["dpo_analysis"],
    })

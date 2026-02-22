"""
Excel Reader Agent — parses .xlsx invoice files into structured rows.
"""
import openpyxl
from typing import List, Optional


_FIELD_MAP = {
    "invoice number": "invoice_number",
    "invoice no": "invoice_number",
    "vendor": "vendor",
    "supplier": "vendor",
    "invoice date": "invoice_date",
    "due date": "due_date",
    "amount": "amount",
    "invoice amount": "amount",
    "payment terms": "payment_terms",
    "terms": "payment_terms",
    "status": "status",
    "department": "department",
    "dept": "department",
    "cost center": "cost_center",
    "cc": "cost_center",
}


def _normalise_header(val) -> Optional[str]:
    if val is None:
        return None
    return str(val).strip().lower()


def parse_excel(xlsx_path: str) -> List[dict]:
    """
    Parse the first sheet of an .xlsx file.
    Returns a list of row dicts with normalised keys.
    """
    wb = openpyxl.load_workbook(xlsx_path, read_only=True, data_only=True)
    ws = wb.active

    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return []

    # Build header map
    raw_headers = [_normalise_header(h) for h in rows[0]]
    col_map = {}  # col_index → normalised field name
    for idx, h in enumerate(raw_headers):
        if h and h in _FIELD_MAP:
            col_map[idx] = _FIELD_MAP[h]

    results = []
    for row in rows[1:]:
        if all(v is None for v in row):
            continue  # skip blank rows
        record = {}
        for idx, val in enumerate(row):
            key = col_map.get(idx)
            if key:
                if hasattr(val, "strftime"):
                    record[key] = val.strftime("%Y-%m-%d")
                elif isinstance(val, float) and val == int(val):
                    record[key] = val
                else:
                    record[key] = val
        if record:
            results.append(record)

    wb.close()
    return results

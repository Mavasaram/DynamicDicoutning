import axios from 'axios'

const BASE = '/api'

export async function fetchSampleAnalysis() {
  try {
    // Works locally when FastAPI backend is running (via Vite proxy)
    const { data } = await axios.get(`${BASE}/sample`, { timeout: 4000 })
    return data
  } catch {
    // Fallback: static pre-computed JSON bundled with the frontend (works on Vercel)
    const { data } = await axios.get('/sample_data.json')
    return data
  }
}

export async function uploadAndProcess(invoicePdf, contractPdf, invoicesXlsx) {
  const form = new FormData()
  if (invoicePdf)   form.append('invoice_pdf', invoicePdf)
  if (contractPdf)  form.append('contract_pdf', contractPdf)
  if (invoicesXlsx) form.append('invoices_xlsx', invoicesXlsx)
  const { data } = await axios.post(`${BASE}/process`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

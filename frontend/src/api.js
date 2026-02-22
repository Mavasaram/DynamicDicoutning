import axios from 'axios'

const BASE = '/api'

export async function fetchSampleAnalysis() {
  // Always load from the static pre-computed JSON on production (Vercel).
  // On localhost the Vite proxy forwards /api → FastAPI; on Vercel that path
  // hits the HTML rewrite (200 OK with HTML), so we skip it entirely and go
  // straight to the bundled fallback which is always reliable.
  try {
    const { data } = await axios.get(`${BASE}/sample`, { timeout: 3000 })
    // If Vercel's catch-all rewrite returned the HTML shell instead of JSON,
    // data will be a string — treat that as a miss and use the static file.
    if (typeof data !== 'object' || data === null || !data.invoice) {
      throw new Error('non-json response')
    }
    return data
  } catch {
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

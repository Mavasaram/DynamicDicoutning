import axios from 'axios'

const BASE = '/api'

export async function fetchSampleAnalysis() {
  const { data } = await axios.get(`${BASE}/sample`)
  return data
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

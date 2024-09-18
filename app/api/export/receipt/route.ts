import type { Clinic } from '@/gen/proto/v1/clinic_pb'
import type { Patient } from '@/gen/proto/v1/patient_pb'
import type { PaymentHistory } from '@/gen/proto/v1/payment_pb'
import { clinicList } from '@/server/clinic'
import { detailPatient } from '@/server/patient'
import { detailPayment } from '@/server/payment'
import chromium from '@sparticuz/chromium'
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

const chromiumPack =
  'https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar'

const preparePdf = async (
  type: string,
  payment: PaymentHistory,
  patient: Patient,
  clinic: Clinic,
) => {
  const html = `
  <!DOCTYPE html>
  <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>領収証</title>
      <link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Noto Sans JP', sans-serif;
        }
      </style>
    </head>
    <body style="padding: 32px;">
      <h1 style="text-align: center;">領収証</h1>
      <!-- receipt no -->
      <div style="display: flex; width: 100%">
        <div style="margin: auto"></div>
        <label>No</label>
          <div style="min-width: 15%; border-bottom: solid 1px; margin-left: 8px;">${payment.paymentDatetime}-${payment.id}</div>
      </div>
      <!-- end receipt no -->
      
      <!-- receipt date -->
      <div style="display: flex; width: 100%; margin-top: 8px;">
        <div style="margin: auto"></div>
        <label>発行日</label>
          <div style="min-width: 15%; border-bottom: solid 1px; margin-left: 8px;">${payment.paymentDatetime}</div>
      </div>
      <!-- end receipt date -->
      
      <!-- address -->
      <div style="display: flex; width: 100%; margin-top: 8px;">
        
          <div style="text-align: right; width: 70%; border-bottom: double 4pt;">
          ${patient.firstName} ${patient.lastName}様
          </div>
          <div style="margin: auto"></div>
      </div>
      <!-- end address -->
      
      <!-- total price -->
      <table style=" margin-top: 32px; width: 70%; border: none; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 2px solid black; width: 10rem; background: #80808038">領収金額</th>
                  <td style="border: 2px solid black; text-align: center">¥${(payment.totalAmount * 1.08).toLocaleString()}</td>
              <tr>
          </thead>
          <tbody>
            <tr>
                <td></td>
                  <td>
                    <div style="width: 100%; margin-top: 8px; border-bottom: solid 1px;">但し</div>
                  </td>
              </tr>
              <tr>
                <td></td>
                  <td>
                    <div style="width: 100%; margin-top: 8px; margin-bottom: 32px;">上記金額正に領収いたしました</div>
                  </td>
              </tr>
              
              <tr>
                <th style="border: 1px solid black; width: 10rem; background: #80808038">小計</th>
                  <td style="border: 1px solid black; text-align: center">¥${payment.totalAmount.toLocaleString()}</td>
              <tr>
              
              <tr>
                <th style="border: 1px solid black; width: 10rem; background: #80808038">消費税</th>
                  <td style="border: 1px solid black; text-align: center">¥${(payment.totalAmount * 0.08).toLocaleString()}</td>
              <tr>
          <tbody>
      </table>
      <!-- end total price -->
    
      
      <!-- footer -->
      <div style="width: 100%; margin-top: 32px; display: flex;">
      <div style="width: 80%">
        <div style=" line-height: 2;">${clinic.name}</div>
    
        <div style="font-size: 11pt; line-height: 2;">〒902-0063</div>
        <div style="font-size: 11pt; line-height: 2;">
        沖縄県那覇市三原1丁目26番1号メゾンみはら1階</div>
        <div style="font-size: 11pt; line-height: 2;">院長　仲田力次</div>
        
        <div style="font-size: 11pt; line-height: 2;">TEL 098-996-4444</div>
        </div>
      </div>
      <!-- end footer -->
    </body>
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        // This function will be called when the document is ready
        window.print(); // Call window.print() to trigger the print dialog
    });
    </script>
  </html>
  `

  if (type == 'html') {
    return html
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    // See https://www.npmjs.com/package/@sparticuz/chromium#running-locally--headlessheadful-mode for local executable path
    executablePath: await chromium.executablePath(chromiumPack),
    headless: true,
  })
  // Open a new page.
  const page = await browser.newPage()

  // Set the content of the page that will be exported as PDF.
  // This can also be done by navigating to a specific URL using page.goto(url).
  await page.setContent(html)

  // Generate the PDF.
  const pdf = await page.pdf({
    format: 'A4',
    margin: {
      top: '30mm',
    },
  })

  await browser.close()
  return pdf
}
export async function POST(req: Request) {
  const { orderId } = await req.json()

  const payment = await detailPayment(orderId)
  const patient = await detailPatient(Number(payment.payment?.patientNo))
  const clinics = await clinicList('', 1, 100)
  const clinic = clinics.clinics.findLast(
    (i) => i.id == payment.payment?.clinicId,
  )

  const encodedFileName = encodeURIComponent('領収書.pdf')

  const pdf = await preparePdf('pdf', payment.payment!, patient!, clinic!)
  // Create a NextResponse object with the PDF content
  const response = new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodedFileName}`,
    },
  })

  return response
}

export async function GET(req: Request) {
  const url = new URL(req.url)

  // Get query parameters from the URL
  const orderId = url.searchParams.get('orderId')

  const payment = await detailPayment(Number(orderId))
  const patient = await detailPatient(Number(payment.payment?.patientNo))
  const clinics = await clinicList('', 1, 100)
  const clinic = clinics.clinics.findLast(
    (i) => i.id == payment.payment?.clinicId,
  )

  const html = await preparePdf('html', payment.payment!, patient!, clinic!)
  // Create a NextResponse object with the PDF content
  const response = new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  })

  return response
}

import type { Clinic } from '@/gen/proto/v1/clinic_pb'
import type { Patient } from '@/gen/proto/v1/patient_pb'
import type { DetailReception, Reception } from '@/gen/proto/v1/reception_pb'
import { clinicList } from '@/server/clinic'
import { patientReceptionList, receptionDetail } from '@/server/reception'
import { calculateAge } from '@/utils/chunks'
import chromium from '@sparticuz/chromium'
import { format } from 'date-fns'
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

const chromiumPack =
  'https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar'

const preparePdf = async (
  type: string,
  reception: DetailReception,
  patient: Patient,
  clinic: Clinic,
  receptionList: Reception[],
) => {
  const html = `
  <!DOCTYPE html>
  <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>紹介・情報提供書</title>
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
      <h1 style="text-align: center;">紹介・情報提供書</h1>
      <!-- address info -->
      <div style="width: 100%; margin-top: 32px; display: flex;">
        <div style="width: 70%">
          <div style=" line-height: 2;">${clinic.name}</div>
      
          <div style="font-size: 11pt; line-height: 2;">〒902-0063</div>
          <div style="font-size: 11pt; line-height: 2;">
          沖縄県那覇市三原1丁目26番1号メゾンみはら1階</div>
          <div style="font-size: 11pt; line-height: 2;">院長　仲田力次</div>
          
          <div style="font-size: 11pt; line-height: 2;">TEL 098-996-4444</div>
          <div style="font-size: 11pt; line-height: 2;">医師: ${reception.doctor?.name} </div>
        </div>
        <div style="display: flex; width: 30%">
          <div style="margin: auto"></div>
          <label>診察日</label>
          <div style="min-width: 15%; margin-left: 8px;">${format(new Date(reception.appointmentTime), 'yyyy年MM月dd日')}</div>
        </div>
      </div>
      
      <!-- end address info -->
      
      <!-- introduction -->
      <div style="display: flex; width: 100%; margin-top: 8px;">
        <p>${patient.firstName} ${patient.lastName}様を御紹介申し上げます。よろしく御高診お願い致します。</p>
      </div>
      <!-- end introduction -->
      
      <!-- user info-->
      <table style=" margin-top: 12px; width: 100%; border: none; border-collapse: collapse;">
          <tbody>
            <tr>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">フリガナ</th>
              <td style="border: 2px solid black; text-align: center">${patient.firstNameFurigana} ${patient.lastNameFurigana}</td>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">性別</th>
              <td style="border: 2px solid black; text-align: center">${patient.gender > 1 ? '女' : patient.gender > 0 ? '男' : '他'}</td>
            <tr>
            <tr>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">患者氏名</th>
              <td style="border: 2px solid black; text-align: center">${patient.firstName} ${patient.lastName}</td>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">電話番号</th>
              <td style="border: 2px solid black; text-align: center">${patient.phone}</td>
            <tr>
            <tr>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">生年月日</th>
              <td style="border: 2px solid black; text-align: center">${format(new Date(patient.birthYear), 'yyyy年MM月dd日')}</td>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">年齢</th>
              <td style="border: 2px solid black; text-align: center">${calculateAge(patient.birthYear).years}歳</td>
            <tr>
              
              
          <tbody>
      </table>
      <!-- end user info -->

      <!-- reception info-->
      <table style=" margin-top: 32px; width: 100%; border: none; border-collapse: collapse;">
          <tbody>
            <tr>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">診察メニュー</th>
              <td style="border: 2px solid black; text-align: center">${reception.examination?.name}</td>
            <tr>
            <tr>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">紹介目的</th>
              <td style="border: 2px solid black; text-align: center">いつもお世話になっております。患者様をご紹介致します。<br>
              お忙しいところ恐れ入りますが、ご高診賜りますようお願い申し上げます
              </td>
            <tr>
            <tr>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">アレルギー<br>
              禁忌薬・常用薬
              </th>
              <td style="border: 2px solid black; text-align: center"></td>
            <tr>
            <tr>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">病状経過<br>
              検査結果<br>
              治療経過
              </th>
              <td style="border: 2px solid black; text-align: center">
              ${receptionList
                .map((r) => `<p>${r.examination?.name}</p>`)
                .join('')}
              </td>
            <tr>
            <tr>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">現在の処方
              </th>
              <td style="border: 2px solid black; text-align: center"></td>
            <tr>
            <tr>
              <th style="border: 2px solid black; width: 10rem; background: #80808038">備考
              </th>
              <td style="border: 2px solid black; text-align: center"></td>
            <tr>
          <tbody>
      </table>
      <!-- end user info -->
    
      
      <!-- footer -->
      
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
  const { receptionId } = await req.json()

  const reception = await receptionDetail(Number(receptionId))
  const patient = reception?.patient
  const clinicId = reception?.clinicId
  const clinics = await clinicList('', 1, 100)
  const clinic = clinics.clinics.findLast((i) => i.id == Number(clinicId))
  const receptions = await patientReceptionList(Number(patient?.id))
  const receptionList = receptions
    .sort((a, b) => {
      return Number(b.id - a.id)
    })
    .slice(0, 10)

  const encodedFileName = encodeURIComponent('紹介・情報提供書.pdf')

  const pdf = await preparePdf(
    'pdf',
    reception!,
    patient!,
    clinic!,
    receptionList,
  )
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
  const receiptId = url.searchParams.get('receiptId')

  const reception = await receptionDetail(Number(receiptId))
  const patient = reception?.patient
  const clinicId = reception?.clinicId
  const receptions = await patientReceptionList(Number(patient?.id))
  const receptionList = receptions
    .sort((a, b) => {
      return Number(b.id - a.id)
    })
    .slice(0, 10)

  const clinics = await clinicList('', 1, 100)
  const clinic = clinics.clinics.findLast((i) => i.id == Number(clinicId))

  const html = await preparePdf(
    'html',
    reception!,
    patient!,
    clinic!,
    receptionList,
  )
  // Create a NextResponse object with the PDF content
  const response = new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  })

  return response
}

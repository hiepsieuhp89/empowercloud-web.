import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

import chromium from '@sparticuz/chromium'

const chromiumPack =
  'https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar'

const preparePdf = async (type: string) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    // See https://www.npmjs.com/package/@sparticuz/chromium#running-locally--headlessheadful-mode for local executable path
    executablePath: await chromium.executablePath(chromiumPack),
    headless: true,
  })

  // Open a new page.
  const page = await browser.newPage()

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Prescription</title>
      <link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .prescription {
            max-width: 600px;
            margin: 0 auto;
        }
        .patient-info {
            margin-bottom: 20px;
        }
        .medication {
            margin-bottom: 20px;
        }
      </style>
  </head>
  <body>
      <div class="prescription">
          <h1>処方箋</h1>
          
          <!-- Patient Information -->
          <div class="patient-info">
              <h2>患者情報</h2>
              <p>氏名: 山田 太郎</p>
              <p>生年月日: 1980年1月1日</p>
              <p>性別: 男性</p>
          </div>
          
          <!-- Medication -->
          <div class="medication">
              <h2>処方薬</h2>
              <ul>
                  <li>薬品名: ○○錠</li>
                  <li>用法: 1日3回食後に服用</li>
                  <li>処方量: 1日3錠</li>
              </ul>
              <ul>
                  <li>薬品名: △△軟膏</li>
                  <li>用法: 皮膚に塗布</li>
                  <li>処方量: 適量</li>
              </ul>
          </div>
          
          <!-- Doctor Information -->
          <div class="doctor-info">
              <h2>医師情報</h2>
              <p>医師名: 田中 花子</p>
              <p>医師免許番号: XXXXXX</p>
              <p>所属医院: ○○病院</p>
          </div>
      </div>
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
export async function POST(_req: Request) {
  // const { orderId } = await _req.json()
  //TODO: get detail of payment and append to html

  const encodedFileName = encodeURIComponent('領収書.pdf')

  const pdf = await preparePdf('pdf')
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

export async function GET(_req: Request) {
  const html = await preparePdf('html')
  // Create a NextResponse object with the PDF content
  const response = new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  })

  return response
}

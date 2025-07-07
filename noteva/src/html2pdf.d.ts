declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[]
    filename?: string
    image?: { type?: string; quality?: number }
    html2canvas?: { scale?: number; useCORS?: boolean }
    jsPDF?: { unit?: string; format?: string | number[]; orientation?: string }
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf
    from(element: HTMLElement | string): Html2Pdf
    save(): Promise<void>
    outputPdf(): Promise<any>
    then(callback: (pdf: any) => void): Promise<any>
  }

  function html2pdf(): Html2Pdf
  function html2pdf(element: HTMLElement, options?: Html2PdfOptions): Html2Pdf

  export = html2pdf
} 
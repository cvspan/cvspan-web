/**
 * Render inside `<style media="print">`: an `@page` size applied on screen resizes the layout viewport
 * (A4 landscape is 1122px wide) and breaks phone layouts.
 *
 * Printing hides the whole portal and fits the certificate to an A4 landscape page. */
export const certificatePrintCss = `
@page { size: A4 landscape; margin: 0; }
@media print {
  body * { visibility: hidden; }
  .cert-print, .cert-print * { visibility: visible; }
  .cert-print { position: fixed; inset: 0; width: 100vw; margin: 0; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
  .cert-lightbox { position: static !important; transform: none !important; }
  .cert-sheet { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}`;

"use client";

import { RiPrinterLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";

/** The browser's print dialog also saves as PDF, so one button covers both. */
export function PrintCertificateButton() {
  return (
    <Button type="button" onClick={() => window.print()}>
      <RiPrinterLine size={18} aria-hidden />
      Print or save as PDF
    </Button>
  );
}

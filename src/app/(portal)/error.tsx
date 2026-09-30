"use client";

import { RiRefreshLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** A dropped database connection should offer a retry, not a blank 500. */
export default function PortalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Card className="mx-auto mt-10 max-w-125 p-8 text-center">
      <h1 className="text-primary text-title font-semibold">Something went wrong</h1>
      <p className="text-secondary mt-2 text-body">
        We could not load this page. This is usually a brief connection problem — trying again
        normally fixes it.
      </p>
      <span className="mt-5 inline-block">
        <Button onClick={reset}>
          <RiRefreshLine size={18} aria-hidden />
          Try again
        </Button>
      </span>
    </Card>
  );
}

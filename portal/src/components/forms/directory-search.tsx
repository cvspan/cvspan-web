"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RiSearchLine } from "@remixicon/react";

/** A search box that filters the page it sits on by writing `?q=`; the server does the filtering. */
export function DirectorySearch({ initial, label }: { initial: string; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initial);
  const first = useRef(true);

  useEffect(() => {
    /** Don't navigate on the first render, only when someone types. */
    if (first.current) {
      first.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const query = value.trim();
      /** Keep any other filter on the page (like a status tab) and only change the search. */
      const next = new URLSearchParams(searchParams.toString());
      if (query) next.set("q", query);
      else next.delete("q");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
    // searchParams is read when the timer fires; depending on it would re-run the effect on every navigation it causes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, pathname, router]);

  return (
    <label className="border-line flex h-9 items-center gap-2 rounded-lg border px-2.5">
      <RiSearchLine size={16} className="text-muted" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={label}
        aria-label={label}
        className="text-primary placeholder:text-muted w-40 bg-transparent text-caption outline-none"
      />
    </label>
  );
}

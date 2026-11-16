"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RiSendPlaneFill } from "@remixicon/react";
import { sendMessage } from "@/app/actions/messages";
import { withBasePath } from "@/lib/base-path";
import { initials } from "@/lib/format";
import type { ChatItem } from "@/lib/chat";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 2000;
/** How often to ask whether a newer message exists while the conversation is open. */
const CHECK_MS = 10_000;

export function ChatPanel({
  threadId,
  latestId,
  items,
  isGroup,
  otherName,
}: {
  threadId: string;
  /** The newest message id the server rendered, to tell when something newer arrives. */
  latestId: string | null;
  items: ChatItem[];
  isGroup: boolean;
  otherName: string;
}) {
  const router = useRouter();
  const scroller = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const [sending, startSending] = useTransition();

  const messageCount = items.reduce((total, item) => total + (item.kind === "group" ? item.messages.length : 0), 0);

  /** Stay at the latest message when opening a conversation and whenever one is added. */
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [threadId, messageCount]);

  /** Reload only when the newest message has changed; stop quietly if the session has ended. */
  useEffect(() => {
    let stopped = false;
    const timer = setInterval(async () => {
      if (stopped || document.visibilityState !== "visible") return;
      try {
        const response = await fetch(withBasePath(`/api/messages/${threadId}/latest`), { cache: "no-store" });
        if (!response.ok) {
          stopped = true;
          return;
        }
        const data = (await response.json()) as { latestId: string | null };
        if (data.latestId !== latestId) router.refresh();
      } catch {
        /* offline: try again next time */
      }
    }, CHECK_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [router, threadId, latestId]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;

    const form = new FormData();
    form.set("threadId", threadId);
    form.set("body", body);
    setDraft("");
    startSending(async () => {
      await sendMessage(form);
    });
  }

  return (
    <>
      <div ref={scroller} className="flex-1 overflow-y-auto px-5 py-4" role="log" aria-label="Conversation">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <span className="bg-accent-soft text-accent flex size-12 items-center justify-center rounded-full text-body font-semibold">
              {initials(otherName)}
            </span>
            <p className="text-primary mt-2 text-body font-semibold">{otherName}</p>
            <p className="text-muted text-caption">No messages yet. Say hello.</p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {items.map((item) =>
              item.kind === "day" ? (
                <li key={item.key} className="my-4 flex items-center gap-3 first:mt-0" aria-label={item.label}>
                  <span className="bg-line h-px flex-1" aria-hidden />
                  <span className="text-muted text-tiny font-semibold tracking-wide uppercase">{item.label}</span>
                  <span className="bg-line h-px flex-1" aria-hidden />
                </li>
              ) : (
                <li
                  key={item.key}
                  className={cn("mt-3 flex items-end gap-2 first:mt-0", item.mine ? "justify-end" : "justify-start")}
                >
                  {!item.mine && isGroup ? (
                    <span
                      aria-hidden
                      className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold"
                    >
                      {initials(item.senderName)}
                    </span>
                  ) : null}

                  <div className={cn("flex max-w-[75%] flex-col gap-1", item.mine ? "items-end" : "items-start")}>
                    {!item.mine && isGroup ? (
                      <span className="text-muted px-1 text-caption font-semibold">{item.senderName}</span>
                    ) : null}
                    {item.messages.map((message) => (
                      <span
                        key={message.id}
                        className={cn(
                          "rounded-2xl px-3 py-2 text-body break-words whitespace-pre-wrap",
                          item.mine ? "bg-brand text-on-accent rounded-br-sm" : "bg-raised text-primary rounded-bl-sm",
                        )}
                      >
                        {message.body}
                      </span>
                    ))}
                    <span className="text-muted px-1 text-tiny">{item.messages[item.messages.length - 1].time}</span>
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </div>

      <form onSubmit={submit} className="border-line flex items-center gap-2 border-t p-3">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={MAX_LENGTH}
          autoComplete="off"
          placeholder={`Message ${isGroup ? "the group" : otherName.split(" ")[0]}…`}
          aria-label="Write a message"
          className="text-primary placeholder:text-muted border-line focus:border-accent h-10 min-w-0 flex-1 rounded-lg border bg-transparent px-3 text-body outline-none"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          aria-label="Send message"
          className="bg-brand text-on-accent hover:bg-brand-hover flex h-10 cursor-pointer items-center gap-2 rounded-lg px-4 text-body font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RiSendPlaneFill size={16} aria-hidden />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </>
  );
}

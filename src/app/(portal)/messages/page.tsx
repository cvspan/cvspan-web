import { RiAddLine, RiAttachment2, RiSendPlaneFill } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { conversation, threads } from "@/lib/mock-data";

export default function MessagesPage() {
  return (
    <>
      <PageHeader
        pretitle="Workplace"
        title="Messages"
        actions={
          <Button>
            <RiAddLine size={18} aria-hidden />
            New message
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <ul>
            {threads.map((thread, index) => (
              <li key={thread.id}>
                <button
                  type="button"
                  className={`border-line hover:bg-raised flex w-full cursor-pointer items-center gap-3 border-b px-5 py-3 text-left transition-colors ${
                    index === 0 ? "bg-accent-soft" : ""
                  }`}
                >
                  <span className="bg-accent-soft text-accent flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-semibold">
                    {thread.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-primary block truncate text-body font-semibold">
                      {thread.name}
                    </span>
                    <span className="text-muted block truncate text-tiny">{thread.preview}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-muted text-tiny">{thread.when}</span>
                    {thread.unread > 0 ? <Badge tone="accent">{thread.unread}</Badge> : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col lg:col-span-2">
          <header className="border-line flex items-center gap-3 border-b px-5 py-3">
            <span className="bg-accent-soft text-accent flex size-9 items-center justify-center rounded-full text-caption font-semibold">
              AO
            </span>
            <span>
              <span className="text-primary block text-body font-semibold">Ada Obi</span>
              <span className="text-muted block text-tiny">Design Lead · online</span>
            </span>
          </header>

          <ul className="flex flex-1 flex-col gap-3 p-5">
            {conversation.map((message, index) => (
              <li
                key={index}
                className={message.from === "me" ? "flex justify-end" : "flex justify-start"}
              >
                <span
                  className={`max-w-[75%] rounded-lg px-4 py-2.5 ${
                    message.from === "me"
                      ? "bg-brand text-on-accent"
                      : "bg-raised text-primary"
                  }`}
                >
                  <span className="block text-body">{message.text}</span>
                  <span
                    className={`mt-1 block text-tiny ${
                      message.from === "me" ? "text-on-accent/70" : "text-muted"
                    }`}
                  >
                    {message.when}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="border-line flex items-center gap-2 border-t p-3">
            <button
              type="button"
              aria-label="Attach a file"
              className="text-muted hover:bg-raised hover:text-primary flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors"
            >
              <RiAttachment2 size={20} aria-hidden />
            </button>
            <input
              type="text"
              placeholder="Write a message…"
              aria-label="Write a message"
              className="text-primary placeholder:text-muted border-line h-10 flex-1 rounded-lg border bg-transparent px-3 text-body outline-none"
            />
            <Button aria-label="Send message">
              <RiSendPlaneFill size={18} aria-hidden />
              Send
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

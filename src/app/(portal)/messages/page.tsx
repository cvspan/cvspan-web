import { RiAttachment2, RiSendPlaneFill } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { sendMessage } from "@/app/actions/messages";
import { NewMessageButton } from "@/components/forms/message-forms";
import { getMessages, getPeople, getThreadsFor } from "@/db/queries";
import { formatTime, initials, relativeDays } from "@/lib/format";
import { requireUser } from "@/lib/session";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ thread?: string }>;
}) {
  const user = await requireUser();
  const { thread: requested } = await searchParams;

  const [threads, people] = await Promise.all([getThreadsFor(user.id), getPeople()]);
  const activeId = requested ?? threads[0]?.id;
  const messages = activeId ? await getMessages(activeId) : [];
  const active = threads.find((thread) => thread.id === activeId);
  const otherName =
    active?.name ??
    messages.find((message) => message.senderId !== user.id)?.senderName ??
    "Conversation";

  return (
    <>
      <PageHeader
        pretitle="Workplace"
        title="Messages"
        actions={
          <NewMessageButton
            people={people
              .filter((person) => person.id !== user.id)
              .map((person) => ({ id: person.id, name: person.name }))}
          />
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          {threads.length === 0 ? (
            <p className="text-muted px-5 py-8 text-center text-body">No conversations yet.</p>
          ) : (
            <ul>
              {threads.map((thread) => (
                <li key={thread.id}>
                  <a
                    href={`/messages?thread=${thread.id}`}
                    className={`border-line hover:bg-raised flex w-full items-center gap-3 border-b px-5 py-3 text-left transition-colors ${
                      thread.id === activeId ? "bg-accent-soft" : ""
                    }`}
                  >
                    <span className="bg-accent-soft text-accent flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-semibold">
                      {initials(thread.name ?? "Direct message")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-primary block truncate text-body font-semibold">
                        {thread.name ?? "Direct message"}
                      </span>
                      <span className="text-muted block truncate text-tiny">
                        {thread.lastMessage ?? "No messages yet"}
                      </span>
                    </span>
                    <span className="text-muted shrink-0 text-tiny">
                      {thread.lastAt ? relativeDays(thread.lastAt) : ""}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="flex flex-col lg:col-span-2">
          <header className="border-line flex items-center gap-3 border-b px-5 py-3">
            <span className="bg-accent-soft text-accent flex size-9 items-center justify-center rounded-full text-caption font-semibold">
              {initials(otherName)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-primary block truncate text-body font-semibold">
                {otherName}
              </span>
              <span className="text-muted block text-tiny">
                {messages.length} message{messages.length === 1 ? "" : "s"}
              </span>
            </span>
            {active?.name ? <Badge>Group</Badge> : null}
          </header>

          <ul className="flex min-h-60 flex-1 flex-col gap-3 p-5">
            {messages.map((message) => {
              const mine = message.senderId === user.id;
              return (
                <li key={message.id} className={mine ? "flex justify-end" : "flex justify-start"}>
                  <span
                    className={`max-w-[75%] rounded-lg px-4 py-2.5 ${
                      mine ? "bg-brand text-on-accent" : "bg-raised text-primary"
                    }`}
                  >
                    {!mine ? (
                      <span className="text-muted mb-0.5 block text-tiny font-semibold">
                        {message.senderName}
                      </span>
                    ) : null}
                    <span className="block text-body">{message.body}</span>
                    <span
                      className={`mt-1 block text-tiny ${mine ? "text-on-accent/70" : "text-muted"}`}
                    >
                      {formatTime(message.createdAt)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <form action={sendMessage} className="border-line flex items-center gap-2 border-t p-3">
            <input type="hidden" name="threadId" value={activeId ?? ""} />
            <button
              type="button"
              aria-label="Attach a file"
              className="text-muted hover:bg-raised hover:text-primary flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors"
            >
              <RiAttachment2 size={20} aria-hidden />
            </button>
            <input
              type="text"
              name="body"
              required
              autoComplete="off"
              placeholder="Write a message…"
              aria-label="Write a message"
              disabled={!activeId}
              className="text-primary placeholder:text-muted border-line h-10 flex-1 rounded-lg border bg-transparent px-3 text-body outline-none disabled:opacity-50"
            />
            <Button type="submit" aria-label="Send message" disabled={!activeId}>
              <RiSendPlaneFill size={18} aria-hidden />
              Send
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

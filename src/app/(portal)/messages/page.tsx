import Link from "next/link";
import { RiArrowLeftLine } from "@remixicon/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { NewMessageButton } from "@/components/forms/message-forms";
import { ChatPanel } from "@/components/messages/chat-panel";
import { getMessages, getPeople, getThreadsFor } from "@/db/queries";
import { groupMessages, listTime, threadTitle } from "@/lib/chat";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata = { title: "Messages · CVSpan Portal" };

function ThreadAvatar({ name, src, onTint = false }: { name: string; src?: string | null; onTint?: boolean }) {
  return <Avatar name={name} src={src} size="lg" className={onTint ? "bg-card" : undefined} />;
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ thread?: string }>;
}) {
  const user = await requireUser();
  const { thread: requested } = await searchParams;

  const [threads, people] = await Promise.all([getThreadsFor(user.id), getPeople()]);

  /** A thread id that isn't one of mine (stale link, someone else's) falls back to the newest. */
  const active = threads.find((thread) => thread.id === requested) ?? threads[0];
  const messages = active ? await getMessages(active.id) : [];

  const titled = threads.map((thread) => ({
    ...thread,
    title: threadTitle(thread, thread.members, user.id),
    isGroup: thread.name !== null || thread.members.length > 2,
    /** A one-to-one chat shows the other person's photo; a group shows initials. */
    photo:
      thread.name === null && thread.members.length === 2
        ? (thread.members.find((member) => member.id !== user.id)?.avatarUrl ?? null)
        : null,
  }));
  const current = titled.find((thread) => thread.id === active?.id);

  /** For a one-to-one chat, who they are: role and department under their name. */
  const others = current?.members.filter((member) => member.id !== user.id) ?? [];
  const subtitle = !current
    ? ""
    : current.isGroup
      ? `${current.members.length} members · ${others.map((member) => member.name.split(" ")[0]).join(", ")}`
      : [others[0]?.jobTitle, others[0]?.department].filter(Boolean).join(" · ") || "Teammate";

  /** On phones only one pane shows: the list, or the open conversation with a way back. */
  const showConversation = Boolean(requested && current);

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

      <div className="grid h-[calc(100dvh-14rem)] min-h-[28rem] gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <Card className={cn("flex-col", showConversation ? "hidden lg:flex" : "flex")}>
          <h2 className="border-line text-primary border-b px-4 py-3 text-body font-semibold">
            Conversations
          </h2>
          {titled.length === 0 ? (
            <p className="text-muted px-4 py-10 text-center text-body">
              No conversations yet. Use <span className="font-semibold">New message</span> to start one.
            </p>
          ) : (
            <ul className="flex-1 overflow-y-auto">
              {titled.map((thread) => {
                const selected = thread.id === current?.id;
                const preview = thread.lastMessage
                  ? `${thread.lastSenderId === user.id ? "You: " : ""}${thread.lastMessage}`
                  : "No messages yet";
                return (
                  <li key={thread.id}>
                    <Link
                      href={`/messages?thread=${thread.id}`}
                      aria-current={selected ? "page" : undefined}
                      className={cn(
                        "hover:bg-raised flex items-center gap-3 border-l-2 px-4 py-3 transition-colors",
                        selected ? "border-accent bg-accent-soft" : "border-transparent",
                      )}
                    >
                      <ThreadAvatar name={thread.title} src={thread.photo} onTint={selected} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-primary truncate text-body font-semibold">{thread.title}</span>
                          {thread.lastAt ? (
                            <span className="text-muted shrink-0 text-tiny">{listTime(thread.lastAt)}</span>
                          ) : null}
                        </span>
                        <span className="text-muted block truncate text-caption">{preview}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className={cn("flex-col", showConversation ? "flex" : "hidden lg:flex")}>
          {current ? (
            <>
              <header className="border-line flex items-center gap-3 border-b px-4 py-3">
                <Link
                  href="/messages"
                  aria-label="Back to conversations"
                  className="text-muted hover:bg-raised hover:text-primary -ml-1 flex size-8 items-center justify-center rounded-lg lg:hidden"
                >
                  <RiArrowLeftLine size={20} aria-hidden />
                </Link>
                <ThreadAvatar name={current.title} src={current.photo} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-primary truncate text-body font-semibold">{current.title}</h2>
                  <p className="text-muted truncate text-caption">{subtitle}</p>
                </div>
                {current.isGroup ? <Badge>Group</Badge> : null}
              </header>

              <ChatPanel
                threadId={current.id}
                latestId={messages[messages.length - 1]?.id ?? null}
                items={groupMessages(messages, user.id)}
                isGroup={current.isGroup}
                otherName={current.title}
              />
            </>
          ) : (
            <div className="text-muted flex flex-1 items-center justify-center px-6 text-center text-body">
              Select a conversation, or start a new one.
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

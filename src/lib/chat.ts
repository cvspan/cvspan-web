import { COMPANY_TIME_ZONE, companyDay, daysBetween } from "./dates";

/*
 * Pure helpers for the messages screen: who a conversation is "with", how a thread's latest
 * message reads in the list, and how a run of messages is grouped for display. Times follow the
 * company's Lagos clock so everyone sees the same day boundaries.
 */

type Person = { id: string; name: string };

/** A direct thread is titled with the other person; a group uses its name, else its members' names. */
export function threadTitle(thread: { name: string | null }, members: Person[], myId: string) {
  if (thread.name) return thread.name;
  const others = members.filter((member) => member.id !== myId);
  if (others.length === 0) return "Just you";
  if (others.length === 1) return others[0].name;
  const shown = others.slice(0, 3).map((member) => member.name.split(" ")[0]);
  return others.length > 3 ? `${shown.join(", ")} +${others.length - 3}` : shown.join(", ");
}

const clock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: COMPANY_TIME_ZONE });
const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: COMPANY_TIME_ZONE });
const longDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: COMPANY_TIME_ZONE,
});

export const messageTime = (value: Date) => clock.format(value);

/** "Today", "Yesterday", then "Mon 29 Sep": the label on a day divider. */
export function dayLabel(value: Date, now = new Date()) {
  const gap = daysBetween(companyDay(value), companyDay(now));
  if (gap === 0) return "Today";
  if (gap === 1) return "Yesterday";
  return longDate.format(value);
}

/** The time on the right of a conversation row: a clock today, otherwise the day. */
export function listTime(value: Date, now = new Date()) {
  const gap = daysBetween(companyDay(value), companyDay(now));
  if (gap === 0) return clock.format(value);
  if (gap === 1) return "Yesterday";
  return shortDate.format(value);
}

export type ChatMessage = { id: string; body: string; createdAt: Date; senderId: string | null; senderName: string | null };

export type ChatItem =
  | { kind: "day"; key: string; label: string }
  | {
      kind: "group";
      key: string;
      mine: boolean;
      senderName: string;
      messages: { id: string; body: string; time: string }[];
    };

/** Messages from one person within five minutes sit together under one name and one timestamp. */
const GROUP_GAP_MS = 5 * 60 * 1000;

export function groupMessages(messages: ChatMessage[], myId: string, now = new Date()): ChatItem[] {
  const items: ChatItem[] = [];
  let lastDay = "";
  let lastAt = 0;

  for (const message of messages) {
    const day = companyDay(message.createdAt);
    if (day !== lastDay) {
      items.push({ kind: "day", key: `day-${day}`, label: dayLabel(message.createdAt, now) });
      lastDay = day;
      lastAt = 0;
    }

    const entry = { id: message.id, body: message.body, time: messageTime(message.createdAt) };
    const previous = items[items.length - 1];
    const sameRun =
      previous?.kind === "group" &&
      previous.key.startsWith(`group-${message.senderId ?? "gone"}-`) &&
      message.createdAt.getTime() - lastAt <= GROUP_GAP_MS;

    if (sameRun && previous.kind === "group") {
      previous.messages.push(entry);
    } else {
      items.push({
        kind: "group",
        key: `group-${message.senderId ?? "gone"}-${message.id}`,
        mine: message.senderId === myId,
        senderName: message.senderName ?? "Former member",
        messages: [entry],
      });
    }
    lastAt = message.createdAt.getTime();
  }

  return items;
}

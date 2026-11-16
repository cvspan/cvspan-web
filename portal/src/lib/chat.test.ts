import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dayLabel, groupMessages, listTime, threadTitle, type ChatMessage } from "./chat";

const ME = "me";
const ada = { id: "ada", name: "Ada Obi" };
const bello = { id: "bello", name: "Bello Ibrahim" };
const ngozi = { id: "ngozi", name: "Ngozi Uche" };
const kemi = { id: "kemi", name: "Kemi Adeyemi" };
const you = { id: ME, name: "Seyi Bankole" };

describe("threadTitle", () => {
  it("names a direct thread after the other person", () => {
    assert.equal(threadTitle({ name: null }, [you, ada], ME), "Ada Obi");
  });

  it("prefers a group's own name", () => {
    assert.equal(threadTitle({ name: "Seyi's team" }, [you, ada, bello], ME), "Seyi's team");
  });

  it("lists first names for an unnamed group and counts the rest", () => {
    assert.equal(threadTitle({ name: null }, [you, ada, bello], ME), "Ada, Bello");
    assert.equal(threadTitle({ name: null }, [you, ada, bello, ngozi, kemi], ME), "Ada, Bello, Ngozi +1");
  });

  it("copes with a thread that only has me in it", () => {
    assert.equal(threadTitle({ name: null }, [you], ME), "Just you");
  });
});

const at = (iso: string) => new Date(iso);
const msg = (id: string, senderId: string | null, iso: string, body = id): ChatMessage => ({
  id,
  body,
  senderId,
  senderName: senderId === ME ? "Seyi Bankole" : senderId ? "Ada Obi" : null,
  createdAt: at(iso),
});

describe("groupMessages", () => {
  const now = at("2026-10-01T12:00:00Z");

  it("puts quick messages from one person in a single group", () => {
    const items = groupMessages(
      [msg("1", ME, "2026-10-01T09:00:00Z"), msg("2", ME, "2026-10-01T09:02:00Z")],
      ME,
      now,
    );
    assert.deepEqual(items.map((item) => item.kind), ["day", "group"]);
    const group = items[1];
    assert.ok(group.kind === "group" && group.mine && group.messages.length === 2);
  });

  it("starts a new group when the sender changes or the gap is long", () => {
    const items = groupMessages(
      [
        msg("1", ME, "2026-10-01T09:00:00Z"),
        msg("2", "ada", "2026-10-01T09:01:00Z"),
        msg("3", "ada", "2026-10-01T09:30:00Z"),
      ],
      ME,
      now,
    );
    assert.equal(items.filter((item) => item.kind === "group").length, 3);
  });

  it("adds a divider for each new day and does not group across midnight", () => {
    const items = groupMessages(
      [msg("1", ME, "2026-09-30T22:59:00Z"), msg("2", ME, "2026-09-30T23:01:00Z")],
      ME,
      now,
    );
    // 23:59 and 00:01 Lagos time (UTC+1) fall on different company days.
    assert.deepEqual(items.map((item) => item.kind), ["day", "group", "day", "group"]);
  });

  it("labels a message from a deleted account", () => {
    const items = groupMessages([msg("1", null, "2026-10-01T09:00:00Z")], ME, now);
    const group = items[1];
    assert.ok(group.kind === "group" && group.senderName === "Former member" && !group.mine);
  });
});

describe("dayLabel and listTime", () => {
  const now = at("2026-10-01T12:00:00Z");

  it("reads Today and Yesterday, then a dated label", () => {
    assert.equal(dayLabel(at("2026-10-01T08:00:00Z"), now), "Today");
    assert.equal(dayLabel(at("2026-09-30T08:00:00Z"), now), "Yesterday");
    assert.match(dayLabel(at("2026-09-25T08:00:00Z"), now), /25 Sep/);
  });

  it("shows a clock for today in Lagos time, then the day", () => {
    assert.equal(listTime(at("2026-10-01T08:30:00Z"), now), "09:30");
    assert.equal(listTime(at("2026-09-30T08:30:00Z"), now), "Yesterday");
    assert.match(listTime(at("2026-09-20T08:30:00Z"), now), /^20 Sep/);
  });
});

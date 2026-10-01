import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cn } from "./utils";

describe("cn with the project's type scale", () => {
  it("keeps the text colour when a custom size follows it", () => {
    // The primary button: colour first, then the size. Both must survive.
    assert.equal(cn("bg-brand text-on-accent", "h-10 px-4 text-body"), "bg-brand text-on-accent h-10 px-4 text-body");
    assert.equal(cn("bg-card text-primary", "h-8 px-3 text-caption"), "bg-card text-primary h-8 px-3 text-caption");
  });

  it("keeps the size when a colour follows it", () => {
    // The badge: size in the base, colour from the tone.
    assert.equal(cn("rounded-full text-tiny font-semibold", "text-accent"), "rounded-full text-tiny font-semibold text-accent");
  });

  it("still lets a later size or colour replace an earlier one", () => {
    assert.equal(cn("text-body", "text-caption"), "text-caption");
    assert.equal(cn("text-primary", "text-muted"), "text-muted");
  });

  it("still handles ordinary Tailwind sizes", () => {
    assert.equal(cn("text-sm", "text-lg"), "text-lg");
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeUrl, parseProjectLinks } from "./project-links";

describe("normalizeUrl", () => {
  it("accepts http and https addresses", () => {
    assert.equal(normalizeUrl("https://www.figma.com/file/abc"), "https://www.figma.com/file/abc");
    assert.equal(normalizeUrl("http://example.com"), "http://example.com/");
  });

  it("adds https when the scheme is missing", () => {
    assert.equal(normalizeUrl("figma.com/file/abc"), "https://figma.com/file/abc");
    assert.equal(normalizeUrl("  github.com/cvspan/portal "), "https://github.com/cvspan/portal");
  });

  it("refuses anything that isn't a web page, since the link is clickable", () => {
    assert.equal(normalizeUrl("javascript:alert(1)"), null);
    assert.equal(normalizeUrl("data:text/html,<script>1</script>"), null);
    assert.equal(normalizeUrl("ftp://files.example.com"), null);
    assert.equal(normalizeUrl("file:///etc/passwd"), null);
  });

  it("refuses text that isn't an address", () => {
    assert.equal(normalizeUrl(""), null);
    assert.equal(normalizeUrl("not a url"), null);
    assert.equal(normalizeUrl("intranet"), null);
  });
});

describe("parseProjectLinks", () => {
  it("pairs names with addresses and drops blank rows", () => {
    const result = parseProjectLinks(["Figma", "", "Repo"], ["figma.com/f", "", "github.com/x"]);
    assert.deepEqual(result, {
      ok: true,
      links: [
        { name: "Figma", url: "https://figma.com/f" },
        { name: "Repo", url: "https://github.com/x" },
      ],
    });
  });

  it("allows no links at all", () => {
    assert.deepEqual(parseProjectLinks([], []), { ok: true, links: [] });
    assert.deepEqual(parseProjectLinks([""], [""]), { ok: true, links: [] });
  });

  it("allows up to three and refuses a fourth", () => {
    const three = parseProjectLinks(["a", "b", "c"], ["a.com", "b.com", "c.com"]);
    assert.equal(three.ok, true);
    const four = parseProjectLinks(["a", "b", "c", "d"], ["a.com", "b.com", "c.com", "d.com"]);
    assert.deepEqual(four, { ok: false, error: "A project can have up to 3 links." });
  });

  it("asks for the missing half of a row", () => {
    assert.deepEqual(parseProjectLinks(["Figma"], [""]), { ok: false, error: "Add a URL for “Figma”, or remove it." });
    assert.deepEqual(parseProjectLinks([""], ["figma.com"]), {
      ok: false,
      error: "Give the link to figma.com a name, such as Figma.",
    });
  });

  it("rejects an unsafe address with the offending text", () => {
    assert.deepEqual(parseProjectLinks(["Bad"], ["javascript:alert(1)"]), {
      ok: false,
      error: "“javascript:alert(1)” isn't a valid web address.",
    });
  });

  it("limits the name length", () => {
    const result = parseProjectLinks(["x".repeat(41)], ["a.com"]);
    assert.equal(result.ok, false);
  });
});

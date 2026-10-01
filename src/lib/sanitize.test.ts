import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizeRichText } from "./sanitize";

describe("sanitizeRichText", () => {
  it("keeps what the editor produces", () => {
    /** The sanitiser normalises formatting (no space after the colon, self-closing img), nothing more. */
    const html = '<h2>Title</h2><p style="text-align:center">Hello <strong>there</strong> <em>you</em></p><ul><li>One</li></ul><img src="https://cvspan.com/portal/api/media/abc" alt="x" />';
    assert.equal(sanitizeRichText(html), html);
  });

  it("removes scripts, handlers and unsafe protocols", () => {
    const dirty = '<p onclick="steal()">Hi</p><script>alert(1)</script><a href="javascript:alert(1)">x</a><img src="x" onerror="boom()"><iframe src="https://evil.example"></iframe>';
    const clean = sanitizeRichText(dirty);
    assert.ok(!/script|onclick|onerror|javascript:|iframe/i.test(clean), clean);
    assert.ok(clean.includes("Hi"));
  });

  it("only allows alignment as a style", () => {
    const clean = sanitizeRichText('<p style="text-align:right;position:fixed;background:url(x)">a</p>');
    assert.ok(clean.includes("text-align:right"));
    assert.ok(!clean.includes("position") && !clean.includes("background"));
  });

  it("opens outside links safely and leaves mailto alone", () => {
    const clean = sanitizeRichText('<a href="https://example.com">a</a> <a href="mailto:hr@cvspan.com">b</a>');
    assert.ok(clean.includes('target="_blank"') && clean.includes("noopener"));
    assert.ok(clean.includes('href="mailto:hr@cvspan.com"'));
  });

  it("returns an empty string for nothing", () => {
    assert.equal(sanitizeRichText(null), "");
    assert.equal(sanitizeRichText(""), "");
  });
});

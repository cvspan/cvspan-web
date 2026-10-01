import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BASE_PATH,
  absoluteMedia,
  htmlForEditor,
  htmlForStorage,
  htmlWithAbsoluteMedia,
  mediaSrc,
  withBasePath,
} from "./base-path";

describe("base path", () => {
  it("defaults to /portal", () => {
    assert.equal(BASE_PATH, "/portal");
  });

  it("prefixes plain paths once", () => {
    assert.equal(withBasePath("/api/export/people"), "/portal/api/export/people");
    assert.equal(withBasePath("/portal/api/export/people"), "/portal/api/export/people");
    assert.equal(withBasePath("/"), "/portal/");
  });

  it("leaves absolute URLs and non-paths alone", () => {
    assert.equal(withBasePath("https://cvspan.com/careers"), "https://cvspan.com/careers");
    assert.equal(withBasePath("//cdn.example.com/x"), "//cdn.example.com/x");
    assert.equal(withBasePath("mailto:a@b.co"), "mailto:a@b.co");
  });
});

describe("uploaded media", () => {
  it("adds the prefix for display and takes it off for storage, symmetrically", () => {
    const stored = '<p>Hi</p><img src="/api/media/abc" alt="x"><img src="https://images.unsplash.com/p.jpg">';
    const shown = htmlForEditor(stored);
    assert.ok(shown.includes('src="/portal/api/media/abc"'));
    assert.ok(shown.includes('src="https://images.unsplash.com/p.jpg"'));
    assert.equal(htmlForStorage(shown), stored);
  });

  it("does not double-prefix", () => {
    assert.equal(htmlForStorage(htmlForEditor('<img src="/api/media/a">')), '<img src="/api/media/a">');
  });

  it("builds URLs another site can load", () => {
    assert.equal(mediaSrc("/api/media/abc"), "/portal/api/media/abc");
    assert.equal(mediaSrc("https://example.com/a.png"), "https://example.com/a.png");
    assert.equal(absoluteMedia("/api/media/abc", "https://cvspan.com/portal"), "https://cvspan.com/portal/api/media/abc");
    assert.equal(absoluteMedia("https://example.com/a.png", "https://cvspan.com/portal"), "https://example.com/a.png");
    assert.equal(absoluteMedia(null, "https://cvspan.com/portal"), null);
    assert.equal(
      htmlWithAbsoluteMedia('<img src="/api/media/abc">', "https://cvspan.com/portal"),
      '<img src="https://cvspan.com/portal/api/media/abc">',
    );
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  checkGaId,
  checkGtmId,
  checkHandle,
  checkImagePath,
  checkPixelId,
  checkRobotsExtra,
  checkTitleTemplate,
  checkUrl,
  checkVerification,
  parseCustomTags,
  seoChecks,
} from "./site-settings";

describe("tracking IDs", () => {
  it("accepts the shapes Google and Meta give out and normalises case", () => {
    assert.deepEqual(checkGaId(" g-abc123xyz9 "), { ok: true, value: "G-ABC123XYZ9" });
    assert.deepEqual(checkGtmId("GTM-ABC1234"), { ok: true, value: "GTM-ABC1234" });
    assert.deepEqual(checkPixelId("1234567890123456"), { ok: true, value: "1234567890123456" });
    assert.deepEqual(checkGaId(""), { ok: true, value: null });
  });

  it("rejects things that are not IDs, including a pasted script", () => {
    assert.equal(checkGaId("UA-12345-1").ok, false);
    assert.equal(checkGtmId("<script>alert(1)</script>").ok, false);
    assert.equal(checkPixelId("abc").ok, false);
  });
});

describe("verification codes", () => {
  it("takes the code from a whole meta tag, or the bare code", () => {
    assert.deepEqual(checkVerification('<meta name="google-site-verification" content="abcDEF123_-xyz" />'), { ok: true, value: "abcDEF123_-xyz" });
    assert.deepEqual(checkVerification("abcDEF123_-xyz"), { ok: true, value: "abcDEF123_-xyz" });
    assert.equal(checkVerification("two words here").ok, false);
  });
});

describe("addresses and handles", () => {
  it("requires https and tidies the trailing slash", () => {
    assert.deepEqual(checkUrl("Facebook", "https://www.facebook.com/CVSpanOfficial/"), { ok: true, value: "https://www.facebook.com/CVSpanOfficial" });
    assert.equal(checkUrl("Facebook", "http://facebook.com/x").ok, false);
    assert.equal(checkUrl("Facebook", "javascript:alert(1)").ok, false);
  });

  it("writes handles with an @", () => {
    assert.deepEqual(checkHandle("Cvspanofficial"), { ok: true, value: "@Cvspanofficial" });
    assert.equal(checkHandle("not a handle").ok, false);
  });

  it("needs %s in a title pattern", () => {
    assert.equal(checkTitleTemplate("CVSpan").ok, false);
    assert.deepEqual(checkTitleTemplate("%s | CVSpan"), { ok: true, value: "%s | CVSpan" });
  });

  it("only points the share image at our own files", () => {
    assert.equal(checkImagePath("https://evil.example/x.png").ok, false);
    assert.equal(checkImagePath("//evil.example/x.png").ok, false);
    assert.equal(checkImagePath("/api/media/3f2c1c7e-2f4a-4e0c-9d0e-0a1b2c3d4e5f").ok, true);
    assert.equal(checkImagePath("/assets/images/og.png").ok, true);
  });
});

describe("robots.txt extras", () => {
  it("allows standard rules and comments only", () => {
    assert.equal(checkRobotsExtra("User-agent: GPTBot\nDisallow: /").ok, true);
    assert.equal(checkRobotsExtra("# keep out\nDisallow: /private/").ok, true);
    assert.equal(checkRobotsExtra("Disallow: /\n<script>").ok, false);
  });
});

describe("parseCustomTags", () => {
  it("turns a Google Tag Manager snippet into a script and a noscript", () => {
    const head = parseCustomTags(
      `<script>(function(w,d,s,l,i){w[l]=w[l]||[];})(window,document,'script','dataLayer','GTM-ABC1234');</script>`,
      "head",
    );
    assert.deepEqual(head.problems, []);
    assert.equal(head.tags[0].tag, "script");
    assert.match(head.tags[0].content ?? "", /GTM-ABC1234/);

    const body = parseCustomTags(
      `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-ABC1234" height="0" width="0"></iframe></noscript>`,
      "bodyStart",
    );
    assert.deepEqual(body.problems, []);
    assert.equal(body.tags[0].tag, "noscript");
    assert.match(body.tags[0].content ?? "", /^<iframe src="https:\/\/www.googletagmanager.com/);
  });

  it("keeps verification metas and external scripts, with their attributes", () => {
    const { tags, problems } = parseCustomTags(
      `<meta name="facebook-domain-verification" content="abc123" />\n<script async src="https://example.com/t.js" data-id="9"></script>`,
      "head",
    );
    assert.deepEqual(problems, []);
    assert.deepEqual(tags[0], { tag: "meta", attrs: { name: "facebook-domain-verification", content: "abc123" } });
    assert.deepEqual(tags[1].attrs, { async: "", src: "https://example.com/t.js", "data-id": "9" });
  });

  it("reports what it won't take instead of storing it", () => {
    assert.match(parseCustomTags('<iframe src="https://x.example"></iframe>', "head").problems[0], /can't be used here/);
    assert.match(parseCustomTags('<script src="http://x.example/t.js"></script>', "head").problems[0], /https:\/\//);
    assert.match(parseCustomTags('<meta http-equiv="refresh" content="0;url=https://x.example">', "head").problems[0], /redirects/);
    assert.match(parseCustomTags('<link rel="import" href="https://x.example">', "head").problems[0], /isn't allowed/);
    assert.match(parseCustomTags('<link rel="stylesheet" href="javascript:alert(1)">', "head").problems[0], /https:\/\/ or \//);
    assert.match(parseCustomTags("just words", "head").problems[0], /Text outside a tag/);
    assert.equal(parseCustomTags('<meta name="x" content="y" onload="evil()">', "head").tags[0].attrs.onload, undefined);
  });

  it("limits the body to scripts, styles and noscript", () => {
    assert.match(parseCustomTags('<meta name="x" content="y">', "bodyEnd").problems[0], /can't be used here/);
  });
});

describe("seoChecks", () => {
  const base = { description: null, siteName: null, defaultShareImage: null, gaMeasurementId: null, gtmContainerId: null, googleVerification: null, bingVerification: null, titleTemplate: null, allowIndexing: true, facebookUrl: null, twitterUrl: null, instagramUrl: null, linkedinUrl: null, tiktokUrl: null, youtubeUrl: null };

  it("lists what is missing on an empty site", () => {
    const todo = seoChecks(base).filter((check) => check.level === "todo").map((check) => check.key);
    assert.deepEqual(todo, ["description", "name", "title", "image", "analytics", "verification"]);
  });

  it("warns when indexing is off, and about a description that is too short or too long", () => {
    assert.equal(seoChecks({ ...base, allowIndexing: false })[0].level, "warn");
    assert.equal(seoChecks({ ...base, description: "Too short" })[1].level, "warn");
    assert.equal(seoChecks({ ...base, description: "x".repeat(120) })[1].level, "ok");
  });
});

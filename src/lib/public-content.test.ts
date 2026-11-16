import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toPublicJob, toPublicJobSummary, toPublicPost } from "./public-content";

const job = (overrides = {}) => ({
  slug: "product-designer",
  title: "Product Designer",
  summary: "Design the portal",
  description: "<p>Hi</p><script>alert(1)</script>",
  employmentType: "internship" as const,
  seniority: "intern" as const,
  workMode: "remote" as const,
  location: "Remote Worldwide",
  experience: "1-2 Years Experience",
  language: "English",
  openings: 2,
  skills: ["Figma"],
  salaryMin: 100000,
  salaryMax: 150000,
  salaryCurrency: "NGN",
  salaryPeriod: "month" as const,
  salaryPublic: false,
  applyMethod: "portal" as const,
  applyValue: "hr-secret@cvspan.com",
  closingDate: null,
  postedAt: new Date("2026-09-01T10:00:00Z"),
  departmentName: "Design",
  departmentSlug: "design",
  ...overrides,
});

describe("public job", () => {
  it("matches what the website's list shows", () => {
    const result = toPublicJobSummary(job());
    assert.equal(result.title, "Product Designer");
    assert.deepEqual(result.department, { name: "Design", slug: "design" });
    assert.equal(result.employmentLabel, "Internship");
    assert.equal(result.language, "English");
    assert.equal(result.experience, "1-2 Years Experience");
    assert.equal(result.location, "Remote Worldwide");
  });

  it("never exposes pay unless the listing made it public", () => {
    assert.equal(toPublicJobSummary(job()).salary, null);
    const open = toPublicJobSummary(job({ salaryPublic: true }));
    assert.equal(open.salary?.min, 100000);
    assert.match(open.salary?.display ?? "", /₦100,000/);
  });

  it("does not leak an internal apply address when applications come through the portal", () => {
    assert.equal(toPublicJobSummary(job()).apply.target, null);
    assert.equal(toPublicJobSummary(job({ applyMethod: "email", applyValue: "jobs@cvspan.com" })).apply.target, "jobs@cvspan.com");
  });

  it("sanitises the description", () => {
    assert.ok(!toPublicJob(job()).descriptionHtml.includes("<script"));
  });

  it("exposes nothing internal", () => {
    const keys = Object.keys(toPublicJob(job()));
    for (const forbidden of ["id", "stage", "hiringManagerId", "hiringManager", "salaryMin", "applyValue"]) {
      assert.ok(!keys.includes(forbidden), forbidden);
    }
  });
});

describe("public post", () => {
  const post = {
    slug: "hello",
    title: "Hello",
    excerpt: "Hi",
    body: '<p>Text</p><img src="/api/media/abc" alt="a"><img src="javascript:x">',
    coverImageUrl: "/api/media/cover",
    coverAlt: "Cover",
    tags: ["culture"],
    readingMinutes: 2,
    publishAt: new Date("2026-09-30T10:00:00Z"),
    updatedAt: new Date("2026-10-01T10:00:00Z"),
    categoryName: "Culture",
    categorySlug: "culture",
    authorName: "Ada Obi",
  };

  it("turns stored image paths into full URLs the website can load", () => {
    const result = toPublicPost(post, "https://cvspan.com/portal");
    assert.equal(result.coverImageUrl, "https://cvspan.com/portal/api/media/cover");
    assert.ok(result.bodyHtml.includes('src="https://cvspan.com/portal/api/media/abc"'));
    assert.ok(!result.bodyHtml.includes("javascript:"));
  });

  it("uses the publish date, falling back to the last update", () => {
    assert.equal(toPublicPost(post, "x").publishedAt, "2026-09-30T10:00:00.000Z");
    assert.equal(toPublicPost({ ...post, publishAt: null }, "x").publishedAt, "2026-10-01T10:00:00.000Z");
  });
});

import { toPublicTeamMember } from "./public-content";

describe("toPublicTeamMember", () => {
  it("exposes the profile address, splits the bio and makes uploaded pictures absolute", () => {
    const member = toPublicTeamMember(
      { slug: "ada-obi", name: "Ada Obi", role: "Design Lead", bio: "One.\n\nTwo.", photoUrl: "/api/media/abc" },
      "https://cvspan.com/portal",
    );
    assert.deepEqual(member, {
      id: "ada-obi",
      name: "Ada Obi",
      role: "Design Lead",
      photoUrl: "https://cvspan.com/portal/api/media/abc",
      bio: ["One.", "Two."],
    });
  });

  it("leaves website pictures alone and gives an empty bio as no paragraphs", () => {
    const member = toPublicTeamMember(
      { slug: "x", name: "X", role: "Y", bio: null, photoUrl: "/assets/images/team/x.jpg" },
      "https://cvspan.com/portal",
    );
    assert.equal(member.photoUrl, "/assets/images/team/x.jpg");
    assert.deepEqual(member.bio, []);
  });
});

import { toPublicSiteSettings } from "./public-content";
import { EMPTY_SITE_SETTINGS } from "./site-settings";

describe("toPublicSiteSettings", () => {
  it("hands the website parsed tags and absolute image addresses, never raw HTML", () => {
    const result = toPublicSiteSettings(
      {
        ...EMPTY_SITE_SETTINGS,
        defaultShareImage: "/api/media/3f2c1c7e-2f4a-4e0c-9d0e-0a1b2c3d4e5f",
        gaMeasurementId: "G-ABC123XYZ9",
        headTags: '<meta name="x" content="y" /><iframe src="https://evil.example"></iframe>',
      },
      "https://cvspan.com/portal",
    );
    assert.equal(result.shareImage, "https://cvspan.com/portal/api/media/3f2c1c7e-2f4a-4e0c-9d0e-0a1b2c3d4e5f");
    assert.equal(result.analytics.googleAnalytics, "G-ABC123XYZ9");
    assert.deepEqual(result.tags.head, [{ tag: "meta", attrs: { name: "x", content: "y" } }]);
    assert.deepEqual(result.tags.bodyStart, []);
  });

  it("is all empty and indexable before anyone has set anything", () => {
    const result = toPublicSiteSettings(EMPTY_SITE_SETTINGS, "https://cvspan.com/portal");
    assert.equal(result.allowIndexing, true);
    assert.equal(result.siteName, null);
    assert.equal(result.shareImage, null);
  });
});

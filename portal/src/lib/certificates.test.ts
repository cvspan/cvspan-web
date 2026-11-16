import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { certificateState, certificateTitle, mayRequestFor, nextReference } from "./certificates";

describe("nextReference", () => {
  it("starts at 0001 for a year with no certificates", () => {
    assert.equal(nextReference([], 2026), "CVS-2026-0001");
    assert.equal(nextReference(["CVS-2025-0900"], 2026), "CVS-2026-0001");
  });

  it("goes one past the highest in that year", () => {
    assert.equal(nextReference(["CVS-2026-0184", "CVS-2026-0042"], 2026), "CVS-2026-0185");
  });

  it("ignores references it does not recognise", () => {
    assert.equal(nextReference(["legacy-7", "CVS-2026-abc"], 2026), "CVS-2026-0001");
  });
});

describe("certificateState", () => {
  const now = new Date();
  it("treats a revoked issued certificate as revoked", () => {
    assert.equal(certificateState({ status: "issued", revokedAt: now }), "revoked");
    assert.equal(certificateState({ status: "issued", revokedAt: null }), "valid");
  });

  it("keeps pending and declined as they are", () => {
    assert.equal(certificateState({ status: "pending", revokedAt: null }), "pending");
    assert.equal(certificateState({ status: "declined", revokedAt: null }), "declined");
  });
});

describe("certificateTitle", () => {
  it("names internship certificates when there is no programme", () => {
    assert.equal(certificateTitle(null), "Internship certificate");
    assert.equal(certificateTitle("Data Analytics"), "Data Analytics certificate");
  });
});

describe("mayRequestFor", () => {
  const manager = { id: "m1", role: "manager" as const };
  it("lets managers put forward only their own reports", () => {
    assert.equal(mayRequestFor(manager, { id: "a", managerId: "m1" }), true);
    assert.equal(mayRequestFor(manager, { id: "b", managerId: "m2" }), false);
  });

  it("lets admins put forward anyone but themselves", () => {
    const admin = { id: "ad", role: "admin" as const };
    assert.equal(mayRequestFor(admin, { id: "a", managerId: null }), true);
    assert.equal(mayRequestFor(admin, { id: "ad", managerId: null }), false);
  });

  it("never lets members do it", () => {
    assert.equal(mayRequestFor({ id: "x", role: "member" }, { id: "y", managerId: "x" }), false);
  });
});

import { durationLabel, longDate, nameFontSize, slashDate } from "./certificates";

describe("certificate wording", () => {
  it("formats dates the way the design prints them", () => {
    assert.equal(slashDate("2026-01-12"), "12/01/2026");
    assert.equal(longDate(new Date("2026-07-08T10:00:00Z")), "08 July 2026");
  });

  it("describes the length of the internship", () => {
    assert.equal(durationLabel("2026-01-12", "2026-07-13"), "6-month");
    assert.equal(durationLabel("2026-02-10", "2026-08-28"), "7-month");
    assert.equal(durationLabel("2026-08-01", "2026-09-12"), "6-week");
  });

  it("shrinks long names but never below the floor", () => {
    assert.equal(nameFontSize("Progress Okotete"), 200);
    assert.equal(nameFontSize("Oluwaseyi Adebayo-Johnson"), 128);
    assert.equal(nameFontSize("A".repeat(80)), 100);
  });
});

import { automaticRequestNote, internshipEnded, programmeCompleted } from "./certificates";

describe("automatic requests", () => {
  const addSixMonths = () => "2026-10-12";
  const intern = { employmentType: "internship", status: "active", startDate: "2026-04-12", endDate: null as string | null };

  it("flags an active intern once the end date has passed", () => {
    assert.equal(internshipEnded(intern, "2026-10-12", addSixMonths), "2026-10-12");
    assert.equal(internshipEnded(intern, "2026-10-11", addSixMonths), null);
    assert.equal(internshipEnded({ ...intern, endDate: "2026-08-28" }, "2026-10-01", addSixMonths), "2026-08-28");
  });

  it("ignores people who are not active interns with a start date", () => {
    assert.equal(internshipEnded({ ...intern, status: "alumni" }, "2027-01-01", addSixMonths), null);
    assert.equal(internshipEnded({ ...intern, employmentType: "full_time" }, "2027-01-01", addSixMonths), null);
    assert.equal(internshipEnded({ ...intern, startDate: null }, "2027-01-01", addSixMonths), null);
  });

  it("counts a programme as complete when marked so or at 100%", () => {
    assert.equal(programmeCompleted({ progress: 100, completedAt: null }), true);
    assert.equal(programmeCompleted({ progress: 40, completedAt: new Date() }), true);
    assert.equal(programmeCompleted({ progress: 99, completedAt: null }), false);
  });

  it("explains the request", () => {
    assert.match(automaticRequestNote({ internshipEnd: "2026-08-28" }), /28\/08\/2026/);
    assert.match(automaticRequestNote({ programme: "Data Analytics" }), /Data Analytics/);
  });
});

import { certificateShareText, certificateStatement } from "./certificates";

describe("certificate statement", () => {
  const text = (parts: { text: string }[]) => parts.map((part) => part.text).join("");

  it("reads as the design does for a dated internship", () => {
    const parts = certificateStatement({ programme: null, role: "Product Designer", start: "2026-01-12", end: "2026-07-13" });
    assert.equal(
      text(parts),
      "Has successfully completed a 6-month internship program as a PRODUCT DESIGNER at CVSPAN from 12/01/2026 to 13/07/2026.",
    );
    assert.equal(parts.find((part) => part.style === "bold")?.text, "PRODUCT DESIGNER");
    assert.equal(parts.find((part) => part.style === "light")?.text, "12/01/2026 to 13/07/2026");
  });

  it("drops the role and dates when they are not known", () => {
    assert.equal(
      text(certificateStatement({ programme: null, role: " ", start: null, end: null })),
      "Has successfully completed an internship program at CVSPAN.",
    );
  });

  it("names the programme when there is one", () => {
    const parts = certificateStatement({ programme: "Data Analytics", role: "x", start: null, end: null });
    assert.equal(text(parts), "Has successfully completed the Data Analytics programme at CVSPAN.");
    assert.equal(parts[1].style, "bold");
  });

  it("words the share text for the owner and for someone else", () => {
    assert.equal(certificateShareText({ person: "Ada", title: "Internship certificate", isOwner: true }), "I received my Internship certificate from CVSpan.");
    assert.match(certificateShareText({ person: "Ada", title: "Internship certificate", isOwner: false }), /^Ada received the/);
  });
});

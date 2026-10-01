import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MAX_RESUME_BYTES, checkResume, safeFilename } from "./resume";

const head = (...bytes: number[]) => Uint8Array.from(bytes);

describe("checkResume", () => {
  it("accepts a PDF, DOC and DOCX by their first bytes", () => {
    assert.deepEqual(checkResume(head(0x25, 0x50, 0x44, 0x46), 1000), {
      ok: true,
      contentType: "application/pdf",
      extension: "pdf",
    });
    const doc = checkResume(head(0xd0, 0xcf, 0x11, 0xe0), 1000);
    assert.ok(doc.ok && doc.extension === "doc");
    const docx = checkResume(head(0x50, 0x4b, 0x03, 0x04), 1000);
    assert.ok(docx.ok && docx.extension === "docx");
  });

  it("rejects anything else, whatever it is called", () => {
    const script = checkResume(head(0x23, 0x21, 0x2f, 0x62), 1000); // "#!/b"
    assert.equal(script.ok, false);
  });

  it("rejects empty and oversized files", () => {
    assert.equal(checkResume(head(), 0).ok, false);
    assert.equal(checkResume(head(0x25, 0x50, 0x44, 0x46), MAX_RESUME_BYTES + 1).ok, false);
    assert.equal(checkResume(head(0x25, 0x50, 0x44, 0x46), MAX_RESUME_BYTES).ok, true);
  });
});

describe("safeFilename", () => {
  it("keeps a readable name and swaps the extension for the detected one", () => {
    assert.equal(safeFilename("Ada Obi CV.pdf", "pdf"), "Ada-Obi-CV.pdf");
  });

  it("strips characters that could break a header", () => {
    assert.equal(safeFilename('x"\r\nSet-Cookie: a=b.pdf', "pdf"), "xSet-Cookie-ab.pdf");
  });

  it("falls back to a plain name", () => {
    assert.equal(safeFilename("???.pdf", "pdf"), "resume.pdf");
  });
});

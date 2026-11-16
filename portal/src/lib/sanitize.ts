import sanitizeHtml from "sanitize-html";

/**
 * HTML written in the portal's editor and rendered on the public website. The editor can only
 * produce a small set of tags, but the stored value is just a form field, so it is cleaned again
 * on the way out: the website is allowed to render this with dangerouslySetInnerHTML.
 */
const options: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "h2", "h3", "h4",
    "strong", "b", "em", "i", "u", "s", "code", "pre", "blockquote",
    "ul", "ol", "li",
    "a", "img",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    p: ["style"],
    h2: ["style"],
    h3: ["style"],
    h4: ["style"],
  },
  /** Only the editor's alignment control may set a style. */
  allowedStyles: {
    "*": { "text-align": [/^(left|right|center|justify)$/] },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  transformTags: {
    /** Links out of the site open safely. */
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        ...(attribs.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      },
    }),
  },
};

export function sanitizeRichText(html: string | null | undefined) {
  return html ? sanitizeHtml(html, options) : "";
}

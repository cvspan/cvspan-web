import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getCertificateForShare, getDefaultSigner } from "@/db/queries-certificates";
import { certificateDisplay } from "@/lib/certificate-display";
import { nameFontSize, type CertificateData } from "@/lib/certificates";

export const alt = "CVSpan certificate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * The share preview is the certificate itself, drawn with the same artwork and layout as the one on
 * the page (components/certificate/certificate.tsx), at 1200 × 630. Satori has no container units,
 * so everything is placed in pixels from the same 4035 × 2851 canvas the design uses.
 */
const WIDTH = 4035;
const HEIGHT = 2851;
const MARGIN = 25;
const SCALE = (size.height - MARGIN * 2) / HEIGHT;
const SHEET_WIDTH = Math.round(WIDTH * SCALE);
const px = (units: number) => Math.round(units * SCALE * 100) / 100;

const ink = "#171717";
const grey = "#626262";
const blue = "#1515cc";

const read = (...parts: string[]) => readFile(join(process.cwd(), ...parts));
const asset = async (file: string, mime: string) =>
  `data:${mime};base64,${(await read("public", "certificate", file)).toString("base64")}`;

const [cinzel, inter300, inter400, inter700, caveat, logo, shapes, sealOuter, sealDisc, sealDots, sealWreath, sealInner, sealMark] =
  await Promise.all([
    read("src", "assets", "og", "cinzel-latin-400-normal.woff"),
    read("src", "assets", "og", "inter-latin-300-normal.woff"),
    read("src", "assets", "og", "inter-latin-400-normal.woff"),
    read("src", "assets", "og", "inter-latin-700-normal.woff"),
    read("src", "assets", "og", "caveat-latin-500-normal.woff"),
    asset("logo.svg", "image/svg+xml"),
    asset("shapes.svg", "image/svg+xml"),
    asset("seal-outer.svg", "image/svg+xml"),
    asset("seal-disc.svg", "image/svg+xml"),
    asset("seal-ring-dots.png", "image/png"),
    asset("seal-wreath.svg", "image/svg+xml"),
    asset("seal-inner.svg", "image/svg+xml"),
    asset("seal-mark.svg", "image/svg+xml"),
  ]);

const fonts = [
  { name: "Cinzel", data: cinzel, weight: 400 as const, style: "normal" as const },
  { name: "Inter", data: inter300, weight: 300 as const, style: "normal" as const },
  { name: "Inter", data: inter400, weight: 400 as const, style: "normal" as const },
  { name: "Inter", data: inter700, weight: 700 as const, style: "normal" as const },
  { name: "Caveat", data: caveat, weight: 500 as const, style: "normal" as const },
];

type Run = { text: string; style?: "bold" | "light" };

/**
 * Satori lays out inline runs only as flex children, so the sentence is broken into words. A run that
 * starts without a space (the full stop after "CVSPAN") stays attached to the word before it.
 */
function statementWords(parts: Run[]) {
  const words: Run[][] = [];
  let open = false;
  for (const part of parts) {
    part.text.split(/(\s+)/).forEach((piece) => {
      if (!piece) return;
      if (/^\s+$/.test(piece)) {
        open = false;
        return;
      }
      if (open) words[words.length - 1].push({ text: piece, style: part.style });
      else words.push([{ text: piece, style: part.style }]);
      open = true;
    });
  }
  return words;
}

/** Position a box in canvas units, relative to the sheet. */
const at = (left: number, top: number, width?: number, height?: number) => ({
  position: "absolute" as const,
  left: px(left),
  top: px(top),
  ...(width ? { width: px(width) } : {}),
  ...(height ? { height: px(height) } : {}),
});

/** Hairlines are a fraction of a pixel at this scale; keep them visible. */
const hairline = (units: number) => Math.max(1, px(units));

function Sheet({ data }: { data: CertificateData }) {
  const words = statementWords(data.statement);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: SHEET_WIDTH,
        height: size.height - MARGIN * 2,
        background: blue,
        color: ink,
        fontFamily: "Inter",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ ...at(0, 1239, WIDTH, 1612), background: "#fff" }} />

      <img alt="" src={logo} style={at(250, 250, 490, 100)} />

      <div
        style={{
          position: "absolute",
          right: px(250),
          top: px(350),
          display: "flex",
          fontSize: px(50),
          fontWeight: 700,
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        Cert. No: {data.certificateNumber}
      </div>

      <div style={{ ...at(250, 588), display: "flex", flexDirection: "column", fontFamily: "Cinzel", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "baseline", fontSize: px(250), lineHeight: 1 }}>
          Certificate
          <span style={{ fontSize: px(150), marginLeft: px(50) }}>of</span>
        </div>
        <div style={{ display: "flex", fontSize: px(250), lineHeight: 1, marginTop: px(20) }}>{data.headline}</div>
      </div>

      <img alt="" src={shapes} style={at(2102, 876, 540, 180)} />

      <img alt="" src={sealOuter} style={at(2945, 787, 813, 813)} />
      <img alt="" src={sealDisc} style={at(2979.18, 821.27, 744.187, 744.187)} />
      <img alt="" src={sealDots} style={at(2960, 801, 783.646, 783.646)} />
      <img alt="" src={sealWreath} style={at(3021.49, 865.75, 657.401, 628.111)} />
      <img alt="" src={sealInner} style={at(3095.26, 937.35, 512.035, 512.035)} />
      <img alt="" src={sealMark} style={at(3188.26, 1115.5, 324.363, 151.092)} />

      {/* Same block as the page: centred on y = 1776. */}
      <div
        style={{
          ...at(250, 1480),
          display: "flex",
          flexDirection: "column",
          height: px(592),
          justifyContent: "center",
          gap: px(100),
        }}
      >
        <div style={{ display: "flex", fontSize: px(70), whiteSpace: "nowrap" }}>This is to Certify that</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: px(nameFontSize(data.name)),
              fontWeight: 700,
              whiteSpace: "nowrap",
              textTransform: "uppercase",
            }}
          >
            {data.name}
          </div>
          <div style={{ display: "flex", height: hairline(5), background: ink }} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: px(1613), fontSize: px(70), lineHeight: `${px(100)}px` }}>
          {words.map((word, index) => (
            <div key={index} style={{ display: "flex", marginRight: px(19) }}>
              {word.map((run, i) => (
                <span key={i} style={{ fontWeight: run.style === "bold" ? 700 : run.style === "light" ? 300 : 400 }}>
                  {run.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          ...at(250, 2285),
          display: "flex",
          width: px(3516),
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", paddingTop: px(50) }}>
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: px(40) }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontFamily: "Caveat",
                fontSize: px(130),
                lineHeight: `${px(85)}px`,
                marginBottom: px(47),
                whiteSpace: "nowrap",
              }}
            >
              {data.signerName}
            </div>
            <div style={{ display: "flex", height: hairline(3), background: ink }} />
          </div>
          <div style={{ display: "flex", fontSize: px(50), fontWeight: 700, marginTop: px(10), whiteSpace: "nowrap" }}>
            {data.signerName}
          </div>
          <div style={{ display: "flex", fontSize: px(50), color: grey, marginTop: px(10), whiteSpace: "nowrap" }}>
            {data.signerTitle}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", paddingTop: px(50) }}>
          <div style={{ display: "flex", fontSize: px(50), fontWeight: 700, whiteSpace: "nowrap" }}>{data.issuedOn}</div>
          <div style={{ display: "flex", fontSize: px(50), color: grey, marginTop: px(10) }}>Date Issued</div>
        </div>
      </div>
    </div>
  );
}

/** Shown when the reference is unknown or revoked, so a stray link never previews as a valid certificate. */
function Fallback({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        color: "#fff",
        fontFamily: "Inter",
      }}
    >
      <img alt="" src={logo} width={245} height={50} />
      <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>{message}</div>
      <div style={{ display: "flex", fontSize: 22, opacity: 0.75 }}>CVSpan certificate registry</div>
    </div>
  );
}

export default async function Image({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const certificate = await getCertificateForShare(decodeURIComponent(reference));
  const valid = certificate && !certificate.revokedAt ? certificate : null;
  const data = valid ? certificateDisplay(valid, valid.decidedBy ? null : await getDefaultSigner()) : null;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a66 0%, #050533 100%)",
        }}
      >
        {data ? (
          <Sheet data={data} />
        ) : (
          <Fallback message={certificate?.revokedAt ? "This certificate has been revoked" : "Certificate not found"} />
        )}
      </div>
    ),
    {
      ...size,
      fonts,
      /**
       * Rendering is CPU work and every share or crawler hit would repeat it, so the CDN keeps the image.
       * A valid certificate is cached for five minutes (a revoked one stops previewing as valid within
       * that); an unknown or revoked one for one minute.
       */
      headers: {
        "Cache-Control": data
          ? "public, s-maxage=300, stale-while-revalidate=3600"
          : "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}

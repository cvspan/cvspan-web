import { Cinzel, Caveat } from "next/font/google";
import { withBasePath } from "@/lib/base-path";
import { nameFontSize, type CertificateData, type StatementPart } from "@/lib/certificates";

/** Cinzel is the headline face in the design; Caveat stands in for the Pecita handwriting of the signature. */
const cinzel = Cinzel({ subsets: ["latin"], weight: "400" });
const signatureFace = Caveat({ subsets: ["latin"], weight: "500" });

/** Bold and light runs in the sentence under the name, as the design sets them. */
function Statement({ parts }: { parts: StatementPart[] }) {
  return parts.map((part, index) =>
    part.style === "bold" ? (
      <strong key={index}>{part.text}</strong>
    ) : part.style === "light" ? (
      <em key={index} style={{ fontWeight: 300 }}>
        {part.text}
      </em>
    ) : (
      part.text
    ),
  );
}

/** The artwork is drawn on a 4035 × 2851 canvas (A4 landscape); every size below is in those units. */
const WIDTH = 4035;
const HEIGHT = 2851;
const u = (value: number) => `${((value / WIDTH) * 100).toFixed(4)}cqw`;
const asset = (file: string) => withBasePath(`/certificate/${file}`);

const ink = "#171717";
const grey = "#626262";
const blue = "#1515cc";

/** Position a box using canvas units. */
function box(left: number, top: number, width?: number, height?: number): React.CSSProperties {
  return { position: "absolute", left: u(left), top: u(top), width: width ? u(width) : undefined, height: height ? u(height) : undefined };
}

export function Certificate({ data }: { data: CertificateData }) {
  const { headline, name, statement, certificateNumber, signerName, signerTitle, issuedOn } = data;

  return (
    <div
      className="cert-sheet relative w-full overflow-hidden"
      style={{ containerType: "inline-size", aspectRatio: `${WIDTH} / ${HEIGHT}`, background: blue, color: ink }}
      role="img"
      aria-label={`Certificate of ${headline.toLowerCase()} for ${name}`}
    >
      <div className="absolute inset-x-0 bg-white" style={{ top: u(1239), height: u(1612) }} />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="CVSpan" src={asset("logo.svg")} style={box(250, 250, 490, 100)} />

      <p
        className="absolute text-right font-bold text-white"
        style={{ right: u(250), top: u(350), fontSize: u(50), lineHeight: 1.2, whiteSpace: "nowrap" }}
      >
        Cert. No: {certificateNumber}
      </p>

      <p
        className={`${cinzel.className} absolute text-white`}
        style={{ left: u(250), top: u(588), width: u(2064), fontSize: u(250), lineHeight: u(250), fontWeight: 400 }}
      >
        Certificate <span style={{ fontSize: u(150) }}>of</span> {headline}
      </p>

      {/* eslint-disable @next/next/no-img-element */}
      <img alt="" src={asset("shapes.svg")} style={box(2102, 876, 540, 180)} />

      {/* The seal, built from the same layers as the design. */}
      <img alt="" src={asset("seal-outer.svg")} style={box(2945, 787, 813, 813)} />
      <img alt="" src={asset("seal-disc.svg")} style={box(2979.18, 821.27, 744.187, 744.187)} />
      <img alt="" src={asset("seal-ring-dots.png")} style={box(2964 - 4, 805 - 4, 783.646, 783.646)} />
      <img alt="" src={asset("seal-wreath.svg")} style={box(3021.49, 865.75, 657.401, 628.111)} />
      <img alt="" src={asset("seal-inner.svg")} style={box(3095.26, 937.35, 512.035, 512.035)} />
      <img alt="" src={asset("seal-mark.svg")} style={box(3188.26, 1115.5, 324.363, 151.092)} />
      {/* eslint-enable @next/next/no-img-element */}

      <div
        className="absolute flex flex-col"
        style={{ left: u(250), top: u(1776), transform: "translateY(-50%)", gap: u(100) }}
      >
        <p style={{ fontSize: u(70), lineHeight: 1.2, whiteSpace: "nowrap" }}>This is to Certify that</p>
        <div className="flex flex-col" style={{ maxWidth: u(3500) }}>
          <p
            className="font-bold uppercase"
            style={{ fontSize: u(nameFontSize(name)), lineHeight: 1.2, whiteSpace: "nowrap" }}
          >
            {name}
          </p>
          <span style={{ height: u(5), background: ink, display: "block" }} />
        </div>
        <p style={{ width: u(1613), fontSize: u(70), lineHeight: u(100) }}>
          <Statement parts={statement} />
        </p>
      </div>

      <div className="absolute flex items-end justify-between" style={{ left: u(250), top: u(2285), width: u(3516) }}>
        <div className="flex flex-col" style={{ paddingTop: u(50), gap: u(10) }}>
          <div className="flex flex-col" style={{ gap: u(47), paddingBottom: u(40) }}>
            <p
              className={`${signatureFace.className} text-center`}
              style={{ fontSize: u(130), lineHeight: u(85), whiteSpace: "nowrap" }}
            >
              {signerName}
            </p>
            <span style={{ height: u(3), background: ink, display: "block" }} />
          </div>
          <p className="font-bold" style={{ fontSize: u(50), lineHeight: 1.2, whiteSpace: "nowrap" }}>
            {signerName}
          </p>
          <p style={{ fontSize: u(50), lineHeight: 1.2, color: grey, whiteSpace: "nowrap" }}>{signerTitle}</p>
        </div>

        <div className="flex flex-col items-end" style={{ paddingTop: u(50), gap: u(10) }}>
          <p className="font-bold" style={{ fontSize: u(50), lineHeight: 1.2, whiteSpace: "nowrap" }}>
            {issuedOn}
          </p>
          <p style={{ fontSize: u(50), lineHeight: 1.2, color: grey }}>Date Issued</p>
        </div>
      </div>
    </div>
  );
}

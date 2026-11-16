"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RiCheckboxCircleFill, RiErrorWarningFill, RiImageAddLine, RiTimeLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, fieldClass } from "@/components/ui/dialog";
import { saveSiteSettings } from "@/app/actions/site-settings";
import { mediaSrc } from "@/lib/base-path";
import { uploadImage } from "@/lib/image";
import { seoChecks, type SiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

const textarea = `${fieldClass} h-auto py-2.5`;
const code = `${textarea} font-mono text-caption`;

/** "%s | CVSpan" with a page title filled in, the way the website builds titles. */
const applyTemplate = (template: string, title: string) => (template.includes("%s") ? template.replace("%s", title) : title);

export function SiteSettingsForm({ initial, websiteUrl, saved }: { initial: SiteSettings; websiteUrl: string; saved: string | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [draft, setDraft] = useState(initial);
  const [shareImage, setShareImage] = useState(initial.defaultShareImage ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const set = (key: keyof SiteSettings) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft((current) => ({ ...current, [key]: event.target.value }));
  const input = (key: keyof SiteSettings, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input name={key} value={(draft[key] as string | null) ?? ""} onChange={set(key)} className={fieldClass} {...props} />
  );

  const siteName = draft.siteName?.trim() || "CVSpan";
  const description = draft.description?.trim() ?? "";
  const pageTitle = draft.tagline?.trim() ? `${siteName} — ${draft.tagline.trim()}` : siteName;
  const sampleTitle = applyTemplate(draft.titleTemplate?.trim() || "%s | " + siteName, "UI/UX design");
  const checks = seoChecks({ ...draft, defaultShareImage: shareImage || null });

  async function chooseImage(selected: File) {
    setUploading(true);
    setUploadError(null);
    try {
      setShareImage(await uploadImage(selected));
    } catch (problem) {
      setUploadError(problem instanceof Error ? problem.message : "Couldn't upload that image.");
    } finally {
      setUploading(false);
      if (file.current) file.current.value = "";
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      const outcome = await saveSiteSettings(data);
      setResult(outcome.ok ? { ok: true, message: "Saved. The website picks it up within a minute." } : { ok: false, message: outcome.error });
      if (outcome.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader title="Site identity" />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Site name">{input("siteName", { maxLength: 60, placeholder: "CVSpan" })}</Field>
            <Field label="Tagline" hint="Follows the name in the home page title.">{input("tagline", { maxLength: 100, placeholder: "Digital Product Design & Development Agency" })}</Field>
            <Field label="Page title pattern" hint="%s is each page's own title. Every page ends the same way.">{input("titleTemplate", { maxLength: 80, placeholder: "%s | CVSpan" })}</Field>
            <Field label="X (Twitter) handle">{input("twitterHandle", { maxLength: 16, placeholder: "@Cvspanofficial" })}</Field>
            <div className="sm:col-span-2">
              <Field label="Site description" hint={`${description.length} characters. 70 to 160 is shown in full by search engines.`}>
                <textarea name="description" rows={3} maxLength={320} value={draft.description ?? ""} onChange={set("description")} className={textarea} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <span className="text-primary mb-1.5 block text-body font-semibold">Default share image</span>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => file.current?.click()} aria-label="Choose a share image" className="border-line-input bg-raised text-muted hover:border-accent flex h-24 w-44 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed">
                  {shareImage ? (
                    // eslint-disable-next-line @next/next/no-img-element -- our own media route
                    <img src={mediaSrc(shareImage)} alt="" className="size-full object-cover" />
                  ) : (
                    <RiImageAddLine size={24} aria-hidden />
                  )}
                </button>
                <div className="flex flex-col gap-1.5">
                  <Button type="button" variant="secondary" size="sm" disabled={uploading} onClick={() => file.current?.click()}>
                    {uploading ? "Uploading…" : shareImage ? "Change image" : "Upload image"}
                  </Button>
                  <p className="text-muted text-tiny">1200 × 630 works on every network. Used when a page has no image of its own.</p>
                  {uploadError ? <p role="alert" className="text-error-text text-tiny">{uploadError}</p> : null}
                </div>
              </div>
              <input type="hidden" name="defaultShareImage" value={shareImage} />
              <input ref={file} type="file" hidden accept="image/jpeg,image/png,image/webp" aria-label="Choose a share image" onChange={(event) => { const picked = event.target.files?.[0]; if (picked) chooseImage(picked); }} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Social profiles" />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Facebook">{input("facebookUrl", { type: "url", placeholder: "https://www.facebook.com/…" })}</Field>
            <Field label="X (Twitter)">{input("twitterUrl", { type: "url", placeholder: "https://x.com/…" })}</Field>
            <Field label="Instagram">{input("instagramUrl", { type: "url", placeholder: "https://www.instagram.com/…" })}</Field>
            <Field label="LinkedIn">{input("linkedinUrl", { type: "url", placeholder: "https://www.linkedin.com/company/…" })}</Field>
            <Field label="TikTok">{input("tiktokUrl", { type: "url", placeholder: "https://www.tiktok.com/@…" })}</Field>
            <Field label="YouTube">{input("youtubeUrl", { type: "url", placeholder: "https://www.youtube.com/@…" })}</Field>
          </div>
          <p className="text-muted border-line border-t px-5 py-3 text-caption">These are shared with search engines as the brand&apos;s official profiles.</p>
        </Card>

        <Card>
          <CardHeader title="Search engines" />
          <div className="flex flex-col gap-4 p-5">
            <label className={cn("flex items-start gap-3 rounded-lg border p-3", draft.allowIndexing ? "border-line" : "border-warning-border bg-warning-surface")}>
              <input type="hidden" name="allowIndexing" value="0" />
              <input type="checkbox" name="allowIndexing" value="1" checked={draft.allowIndexing} onChange={(event) => setDraft((current) => ({ ...current, allowIndexing: event.target.checked }))} className="mt-0.5 size-4 accent-[var(--color-accent)]" />
              <span>
                <span className="text-primary block text-body font-semibold">Let search engines index the website</span>
                <span className="text-muted block text-caption">Switch off only for a staging copy or before launch: the whole site is then hidden from Google and Bing.</span>
              </span>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Google Search Console" hint="The code, or the whole meta tag.">{input("googleVerification", { placeholder: "google-site-verification code" })}</Field>
              <Field label="Bing Webmaster Tools">{input("bingVerification", { placeholder: "msvalidate.01 code" })}</Field>
              <Field label="Yandex Webmaster">{input("yandexVerification")}</Field>
              <Field label="Facebook domain verification">{input("facebookDomainVerification")}</Field>
            </div>
            <Field label="Extra robots.txt rules" hint="One rule per line: User-agent, Allow, Disallow, Sitemap or Crawl-delay. The sitemap and the portal rules are added for you.">
              <textarea name="robotsExtra" rows={4} value={draft.robotsExtra ?? ""} onChange={set("robotsExtra")} className={code} placeholder={"User-agent: GPTBot\nDisallow: /"} />
            </Field>
            <p className="text-muted text-caption">
              Sitemap: <a className="text-accent hover:underline" href={`${websiteUrl}/sitemap.xml`} target="_blank" rel="noopener noreferrer">{websiteUrl}/sitemap.xml</a> · robots.txt:{" "}
              <a className="text-accent hover:underline" href={`${websiteUrl}/robots.txt`} target="_blank" rel="noopener noreferrer">{websiteUrl}/robots.txt</a>
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Analytics and tracking" />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Google Analytics 4 measurement ID" hint="One property for the website and the portal.">{input("gaMeasurementId", { placeholder: "G-ABC123XYZ9" })}</Field>
            <Field label="Google Tag Manager container ID">{input("gtmContainerId", { placeholder: "GTM-ABC1234" })}</Field>
            <Field label="Meta (Facebook) Pixel ID" hint="Loads only after a visitor accepts cookies.">{input("metaPixelId", { inputMode: "numeric", placeholder: "1234567890123456" })}</Field>
            <Field label="LinkedIn Insight partner ID" hint="Loads only after a visitor accepts cookies.">{input("linkedinPartnerId", { inputMode: "numeric", placeholder: "1234567" })}</Field>
          </div>
          <p className="text-muted border-line border-t px-5 py-3 text-caption">Nothing is stored until a visitor accepts the cookie notice. Page views, job applications, shares, outbound links, downloads, form submissions and scroll depth are recorded as events.</p>
        </Card>

        <Card>
          <CardHeader title="Custom tags" />
          <div className="flex flex-col gap-4 p-5">
            <p className="bg-warning-surface text-warning-text border-warning-border rounded-lg border px-3.5 py-2.5 text-caption">
              These run on every page of the public website. Paste code only from tools you trust. Only script, meta, link, style and noscript tags are accepted, and a problem is shown here before anything is saved.
            </p>
            <Field label="In the head" hint="Verification tags, extra meta tags, tracking scripts.">
              <textarea name="headTags" rows={5} value={draft.headTags ?? ""} onChange={set("headTags")} className={code} placeholder={'<meta name="…" content="…" />'} />
            </Field>
            <Field label="Start of the body" hint="Where Google Tag Manager's noscript snippet goes.">
              <textarea name="bodyStartTags" rows={3} value={draft.bodyStartTags ?? ""} onChange={set("bodyStartTags")} className={code} />
            </Field>
            <Field label="End of the body" hint="Chat widgets and scripts that can wait until the page has loaded.">
              <textarea name="bodyEndTags" rows={3} value={draft.bodyEndTags ?? ""} onChange={set("bodyEndTags")} className={code} />
            </Field>
          </div>
        </Card>

        <div className="bg-app border-line sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t px-4 py-3 lg:-mx-6 lg:px-6">
          <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save settings"}</Button>
          {result ? (
            <p role={result.ok ? "status" : "alert"} className={cn("flex items-center gap-1.5 text-body", result.ok ? "text-success-text" : "text-error-text")}>
              {result.ok ? <RiCheckboxCircleFill size={18} aria-hidden /> : <RiErrorWarningFill size={18} aria-hidden />}
              {result.message}
            </p>
          ) : saved ? (
            <p className="text-muted flex items-center gap-1.5 text-caption"><RiTimeLine size={16} aria-hidden />Last saved {saved}</p>
          ) : null}
        </div>
      </div>

      <aside className="flex flex-col gap-4 xl:sticky xl:top-20 xl:self-start">
        <Card>
          <CardHeader title="In search results" />
          <div className="p-5">
            <p className="text-muted truncate text-tiny">{websiteUrl.replace(/^https?:\/\//, "")}</p>
            <p className="mt-0.5 text-para font-semibold text-[#1a0dab] dark:text-[#8ab4f8]">{(pageTitle.length > 60 ? `${pageTitle.slice(0, 57)}…` : pageTitle) || siteName}</p>
            <p className="text-secondary mt-0.5 line-clamp-3 text-caption">{description || "Add a site description and it appears here."}</p>
            <p className="text-muted mt-3 text-tiny">An inner page reads: <span className="text-primary font-semibold">{sampleTitle}</span></p>
          </div>
        </Card>
        <Card>
          <CardHeader title="When shared" />
          <div className="p-5">
            <div className="border-line overflow-hidden rounded-lg border">
              <div className="bg-raised text-muted flex aspect-[1200/630] items-center justify-center">
                {shareImage ? (
                  // eslint-disable-next-line @next/next/no-img-element -- our own media route
                  <img src={mediaSrc(shareImage)} alt="" className="size-full object-cover" />
                ) : (
                  <span className="text-caption">No share image yet</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-muted text-tiny uppercase">{websiteUrl.replace(/^https?:\/\//, "")}</p>
                <p className="text-primary text-body font-semibold">{pageTitle}</p>
                <p className="text-muted line-clamp-2 text-caption">{description}</p>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Health" />
          <ul>
            {checks.map((check) => (
              <li key={check.key} className="border-line flex gap-2.5 border-b px-5 py-3 last:border-b-0">
                <span className={cn("mt-0.5 shrink-0", check.level === "ok" ? "text-success-text" : check.level === "warn" ? "text-warning-text" : "text-muted")}>
                  {check.level === "ok" ? <RiCheckboxCircleFill size={18} aria-label="Done" /> : <RiErrorWarningFill size={18} aria-label={check.level === "warn" ? "Needs attention" : "To do"} />}
                </span>
                <span>
                  <span className="text-primary block text-body font-semibold">{check.label}</span>
                  <span className="text-muted block text-caption">{check.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </aside>
    </form>
  );
}

// Browser-only resume text extraction (PDF + DOCX).

export const ACCEPTED_EXTENSIONS = [".pdf", ".docx"] as const;

export function isAcceptedResume(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buffer = await file.arrayBuffer();

  if (name.endsWith(".docx")) {
    const mammoth = (await import("mammoth/mammoth.browser.js" as string)) as {
      extractRawText: (opts: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
    };
    const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
    return normalize(value);
  }

  if (name.endsWith(".pdf")) {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = (
      await import("pdfjs-dist/build/pdf.worker.min.mjs?url")
    ).default;

    const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i += 1) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" "),
      );
    }
    void doc.cleanup();
    return normalize(pages.join("\n"));
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX resume.");
}

function normalize(text: string): string {
  return text.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

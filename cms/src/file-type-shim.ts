// Shim for file-type package in Cloudflare Workers environment.
// Payload CMS statically imports fileTypeFromFile but only calls it in Node.js
// file-based upload paths — never in the Workers request-based flow.
// This provides magic-byte detection for common image/PDF types so Payload's
// upload validation works correctly, and stubs for everything else.

function detectFromBytes(
  input: ArrayBuffer | Uint8Array | Buffer,
): { ext: string; mime: string } | undefined {
  const buf =
    input instanceof Uint8Array ? input : new Uint8Array(input)
  if (buf.length < 4) return undefined

  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { ext: 'png', mime: 'image/png' }
  }
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { ext: 'jpg', mime: 'image/jpeg' }
  }
  // WebP: RIFF....WEBP
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) {
    return { ext: 'webp', mime: 'image/webp' }
  }
  // AVIF: ....ftypavif (or ftypavis)
  if (
    buf.length >= 12 &&
    buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 &&
    buf[8] === 0x61 && buf[9] === 0x76 && buf[10] === 0x69
  ) {
    return { ext: 'avif', mime: 'image/avif' }
  }
  // PDF: %PDF
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
    return { ext: 'pdf', mime: 'application/pdf' }
  }

  return undefined
}

export async function fileTypeFromFile() {
  throw new Error('fileTypeFromFile is not available in Cloudflare Workers')
}

export async function fileTypeFromBuffer(
  input: ArrayBuffer | Uint8Array | Buffer,
) {
  return detectFromBytes(input)
}

export async function fileTypeFromStream() {
  return undefined
}

export async function fileTypeFromBlob() {
  return undefined
}

export async function fileTypeFromTokenizer() {
  return undefined
}

export class FileTypeParser {
  async fromBuffer(input: ArrayBuffer | Uint8Array | Buffer) {
    return detectFromBytes(input)
  }
  async fromStream() { return undefined }
  async fromBlob() { return undefined }
  async fromTokenizer() { return undefined }
}

export const supportedExtensions = new Set<string>()
export const supportedMimeTypes = new Set<string>()

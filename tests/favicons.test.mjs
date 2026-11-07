import assert from "node:assert/strict"
import { Buffer } from "node:buffer"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { URL } from "node:url"
import { imageMetadata } from "astro/assets/utils"
import { faviconUrlPattern } from "../src/lib/favicon.ts"
import imageService from "../src/lib/image-service.ts"

test("CMS and build use the same HTTPS/non-ICO validation", async () => {
  const cms = await readFile(new URL("../public/cms-rxtsel/config.yml", import.meta.url), "utf8")
  const [, pattern] = cms.match(/pattern:\s*\[\s*'([^']+)'/)
  assert.equal(pattern, faviconUrlPattern.source)

  for (const url of [
    "https://example.com/logo.png",
    "https://another-source.dev/logo.svg?v=2",
    "https://example.com/icon?format=webp",
    "https://example.com/logo.png?fallback=icon.ico",
  ]) {
    assert.ok(faviconUrlPattern.test(url), url)
  }

  for (const url of [
    "http://example.com/logo.png",
    "https://example.com/favicon.ico",
    "https://example.com/favicon.ICO?v=2",
    "https://example.com/favicon.iCo#icon",
    "https://example.com/icon with spaces.png",
  ]) {
    assert.ok(!faviconUrlPattern.test(url), url)
  }
})

test("ICO content is rejected even when the URL claims to be PNG", async () => {
  const ico = Buffer.alloc(22)
  ico.writeUInt16LE(1, 2)
  ico.writeUInt16LE(1, 4)
  ico[6] = 16
  ico[7] = 16

  await assert.rejects(
    imageService.transform(ico, { src: "https://example.com/icon.png", format: "webp" }, {}),
    /Unsupported image format "ico".*icon\.png/,
  )
})

test("1x, 2x and 3x WebP icons preserve non-square proportions without cropping", async () => {
  const input = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="108" height="54"><rect width="108" height="54" fill="blue"/></svg>',
  )

  for (const size of [18, 36, 54]) {
    const result = await imageService.transform(
      input,
      {
        src: "https://example.com/logo.svg",
        width: size,
        height: size,
        format: "webp",
        fit: "contain",
        quality: 90,
      },
      { service: { config: {} }, dangerouslyProcessSVG: true },
    )
    const metadata = await imageMetadata(result.data, "icon.webp")
    assert.equal(metadata.format, "webp")
    assert.equal(metadata.width, size)
    assert.equal(metadata.height, size / 2)
    assert.ok(result.data.length < 2048)
  }
})

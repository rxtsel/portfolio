import sharpService from "astro/assets/services/sharp"
import type { LocalImageService } from "astro"
import { imageMetadata } from "astro/assets/utils"

export default {
  ...sharpService,
  async transform(input, options, config) {
    const { format } = await imageMetadata(input, options.src)

    if (!["png", "jpeg", "jpg", "webp", "avif", "svg", "gif", "tiff"].includes(format)) {
      throw new Error(
        `Unsupported image format "${format}" for "${options.src}". Use PNG, JPEG, WebP, AVIF or SVG instead.`,
      )
    }

    return sharpService.transform(input, options, config)
  },
} satisfies LocalImageService

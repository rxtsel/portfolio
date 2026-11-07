import assert from "node:assert/strict"
import test from "node:test"
import sharp from "sharp"
import { generateProjectOgImage } from "../src/lib/og.ts"
import { getProjectOgStaticPaths, projectPages } from "../src/lib/project-pages.ts"

for (const locale of ["en", "es"]) {
  test(`project OG paths and PNG are generated for ${locale}`, async () => {
    const paths = getProjectOgStaticPaths(locale)
    assert.equal(paths.length, Object.keys(projectPages).length)

    for (const { params, props } of paths) {
      const project = projectPages[params.slug]
      assert.equal(props.title, project.title)
      assert.equal(props.description, project.locales[locale].description)
      assert.equal(props.logoPath, project.logoPath)
      assert.ok(project.locales[locale].path.endsWith("/"))

      const response = await generateProjectOgImage(props)
      assert.equal(response.status, 200)
      assert.match(response.headers.get("content-type"), /^image\/png/)
      const output = sharp(await response.arrayBuffer())
      const image = await output.metadata()
      assert.equal(image.width, 1200)
      assert.equal(image.height, 630)
      assert.equal(image.format, "png")

      const header = await output
        .clone()
        .extract({ left: 140, top: 50, width: 1000, height: 70 })
        .removeAlpha()
        .raw()
        .toBuffer()
      assert.ok(header.every((value) => value === 0))
      const isotype = await output
        .clone()
        .extract({ left: 88, top: 60, width: 44, height: 44 })
        .removeAlpha()
        .raw()
        .toBuffer()
      assert.ok(isotype.some((value) => value >= 240))

      // The 180px project icon is centered at y=315, with black bands above and below.
      for (const top of [210, 405]) {
        const band = await output
          .clone()
          .extract({ left: 88, top, width: 180, height: 15 })
          .removeAlpha()
          .raw()
          .toBuffer()
        assert.ok(band.every((value) => value === 0))
      }
    }
  })
}

test("Xialu OG descriptions are localized", () => {
  assert.notEqual(projectPages.xialu.locales.en.description, projectPages.xialu.locales.es.description)
})

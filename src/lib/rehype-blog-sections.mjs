function hasSlugText(node) {
  return (node.type === "text" && /[\p{L}\p{N}]/u.test(node.value)) || node.children?.some(hasSlugText)
}

/** Wrap each H2/H3 and its content in a CSS view-timeline subject. */
export default function rehypeBlogSections() {
  return (tree, file) => {
    const project =
      /[/\\]content[/\\]projects[/\\]/.test(file.path ?? "") && file.data?.astro?.frontmatter?.detailPage
    if (!project && !/[/\\]content[/\\]blog[/\\]/.test(file.path ?? "")) {
      return
    }

    // Reserve the first timeline only when the project actually has a gallery.
    let index = project && file.data.astro.frontmatter.screenshots?.length > 0 ? 1 : 0

    function group(parent) {
      if (project && parent.type === "element" && parent.tagName === "a") {
        parent.properties = {
          ...parent.properties,
          className: [...(parent.properties?.className ?? []), "link-underline"],
        }
      }
      if (!parent.children) {
        return
      }

      const children = []
      let section

      for (const child of parent.children) {
        if (child.type === "element" && ["h2", "h3"].includes(child.tagName)) {
          // Emoji-only headings otherwise get an empty slug from Astro.
          if (!child.properties?.id && !hasSlugText(child)) {
            child.properties = { ...child.properties, id: `toc-heading-${index}` }
          }

          section = {
            type: "element",
            tagName: "div",
            properties: {
              className: ["blog-section"],
              id: `toc-section-${index}`,
              style: `view-timeline-name: --toc-section-${index++}`,
            },
            children: [],
          }
          children.push(section)
        }

        group(child)
        const target = section ? section.children : children
        target.push(child)
      }

      parent.children = children
    }

    group(tree)
  }
}

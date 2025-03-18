import slug from 'slug'

export const slugify = (text) => {
  return slug(text, {
    replacement: '-',
    lower: true,
    strict: true,
    trim: true
  })
}

export const slugify = (text: string) => {
  return encodeURI(
    text
      .replace(/Á/gi, 'a')
      .replace(/É/gi, 'e')
      .replace(/Í/gi, 'i')
      .replace(/Ó/gi, 'o')
      .replace(/Ú/gi, 'u')
      .replace(/À/gi, 'a')
      .replace(/È/gi, 'e')
      .replace(/Ì/gi, 'i')
      .replace(/Ò/gi, 'o')
      .replace(/Ù/gi, 'u')
      .replace(/ñ/gi, 'n')
      .replace(/\?/gi, '')
      .replace(/¿/gi, '')
      .replace(/!/gi, '')
      .replace(/¡/gi, '')
      .replace(/ /g, '-')
      .toLowerCase()
  )
}

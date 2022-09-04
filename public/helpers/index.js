document.addEventListener('DOMContentLoaded', () => {

  const $ = element => document.querySelector(element)
  const $$ = elements => document.querySelectorAll(elements)

  const burger = $('#burger')
  const show = $('#show')
  const hidden = $('#hidden')
  const navbar = $('#nav__links')
  const anchors = $$('#nav__links a')

  // show and hidden navbar

  burger.addEventListener('click', () => {
    navbar.classList.toggle('active')
    if (navbar.classList.contains('active')) {
      show.style.display = 'none'
      hidden.style.display = 'block'
    } else {
      show.style.display = 'block'
      hidden.style.display = 'none'
    }
  }
  )

  anchors.forEach((anchor) => {
    anchor.addEventListener('click', () => {
      navbar.classList.remove('active')
      show.style.display = 'block'
      hidden.style.display = 'none'
    }
    )
  })

  // active color in anchors for each sections
  const sections = $$('section[id]')

  function isAnchorActive() {
    const scrollY = window.pageYOffset

    sections.forEach( (current) => {
      const sectionHeight = current.offsetHeight
      const sectionTop = current.offsetTop - 50
      const sectionId = current.getAttribute('id')
      // const a = $('#nav__links a[href*=' + sectionId + ']')
      const a = $(`#nav__links a[href*='${sectionId}']`)
      const svg = $(`#nav__links a svg#${sectionId}-icon path`)

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        a.classList.add('active-color')
        svg.classList.add('active-color')
      } else {
        a.classList.remove('active-color')
        svg.classList.remove('active-color')
      }

    }) 

  }

  window.addEventListener('scroll', isAnchorActive)

  // back to top
  function backToTop() {
    const scrollUp = $('#back-top')
    if (this.scrollY >= 560) scrollUp.classList.add('show-scroll')
    else scrollUp.classList.remove('show-scroll')
  }
  window.addEventListener('scroll', backToTop)

  // cursor
  const cursor = $('#cursor')

  document.addEventListener('mousemove', e => {

    const mouseX = e.pageX - 30
    const mouseY = e.pageY - 30

    cursor.style = `transform: translate3d(${mouseX}px, ${mouseY}px, 0);`

  })

  // change language
  const lang = $('#lang')

  lang.addEventListener('click', () => {
    const currentLink = window.location.href
    let gato = currentLink.split('#')
    const nameSection = gato[1]

    if (currentLink.includes('es')) {
      window.location = `/#${nameSection === undefined ? 'home' : nameSection}`
    } else {
      window.location = `/es/#${nameSection === undefined ? 'home' : nameSection}`
    }

  })

})

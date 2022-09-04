document.addEventListener('DOMContentLoaded', () => {

  const $ = element => document.querySelector(element)
  const $$ = elements => document.querySelectorAll(elements)

  const form = $('#form')
  const inputs = $$('#form .input-camp')
  const textArea = $('#group__message textarea')
  const submit = $('#submit')
  const modal = $('#modal')
  const alerta = $('#modal span')

  const regex = {
    text: /^[a-zA-ZÀ-ÿ]{1,40}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  }

  const camps = {
    firstName: false,
    lastName: false,
    email: false,
    message: false
  }

  const validarFormulario = (e) => {
    switch (e.target.name) {
      case 'firstName':
        validarCampo(regex.text, e.target, 'firstName')
        break
      case 'lastName':
        validarCampo(regex.text, e.target, 'lastName')
        break
      case 'email':
        validarCampo(regex.email, e.target, 'email')
        break
      case 'message':
        validarTextArea()
        break
    }
  }

  const validarCampo = (expresion, input, camp) => {
    if (expresion.test(input.value)) {
      $(`#group__${camp} #input__error`)
        .classList.remove('input__error-active')
      camps[camp] = true
      data[camp] = input.value
    } else {
      $(`#group__${camp} #input__error`)
        .classList.add('input__error-active')
      camps[camp] = false
      data[camp] = ''
    }
  }

  const validarTextArea = () => {
    if (textArea.value.length >= 3) {
      $(`#group__message #input__error`)
        .classList.remove('input__error-active')
      camps.message = true
      data.message = textArea.value
    } else {
      $(`#group__message #input__error`)
        .classList.add('input__error-active')
      camps.message = false
      data.message = ''
    }
  }

  inputs.forEach(input => {
    input.addEventListener('keyup', validarFormulario)
    input.addEventListener('blur', validarFormulario)
  })

  textArea.addEventListener('keyup', validarTextArea)
  textArea.addEventListener('blur', validarTextArea)

  const cleanState = () => {
    camps.firstName = false
    camps.lastName = false
    camps.email = false
    camps.message = false
  }

  // modal
  const openModal = () => {
    modal.showModal()
  }

  // close modal
  modal.addEventListener('click', () => {
    modal.close()
  })

  const handleSubmit = async e => {

    const currentUrl = window.location.pathname
    const data = new FormData(form)
    const url = 'https://formspree.io/f/mqkjavlv'

    e.preventDefault()

    if (camps.firstName && camps.lastName && camps.email && camps.message) {

      const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {

        modal.classList.remove('invalid-modal')
        alerta.textContent = currentUrl.includes('es') ? 'Email enviado correctamente' : 'Email sent successfully.'
        openModal()
        form.reset()
        cleanState()
        setTimeout(() => {
          window.location = '/'
        }, 4500)

      } else {

        modal.classList.add('invalid-modal')
        alerta.textContent = currentUrl.includes('es') ? '¡Oops! Hubo un problema al enviar su formulario.' : 'Oops! There was a problem submitting your form.'
        openModal()

      }

    } else {

      modal.classList.add('invalid-modal')
      alerta.textContent = currentUrl.includes('es') ? 'Por favor, compruebe los campos.' : 'Please check the fields.'
      openModal()

    }

  }

  submit.addEventListener('click', handleSubmit)

})

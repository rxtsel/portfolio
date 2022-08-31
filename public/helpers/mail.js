document.addEventListener('DOMContentLoaded', () => {

  const $ = element => document.querySelector(element)
  const $$ = elements => document.querySelectorAll(elements)

  const inputs = $$('#form .input-camp')
  const textArea = $('#group__message textarea')
  const submit = $('#submit')
  const send = $('#send')
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

  const data = {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
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

  const cleanData = () => {
    data.firstName = ''
    data.lastName = ''
    data.email = ''
    data.message = '' 
  }

  // modal
  const openModal = () => {
    modal.showModal()
  }

  const closeModal = () => {
    modal.close()
  }

  modal.addEventListener('click', () => {
    modal.close()
  })

  submit.addEventListener('click', e => {

    e.preventDefault()

    if (camps.firstName && camps.lastName && camps.email && camps.message) {

      form.reset()


      modal.classList.remove('invalid-modal')
      alerta.textContent = 'Message is being processed.'
      openModal()

      send.setAttribute('href', `mailto:cristhixnn@hotmail.com?subject=${data.firstName} ${data.lastName} desde rxtsel.ml&body=Nombre: ${data.firstName} ${data.lastName}. Email: ${data.email}. Mensaje: ${data.message}`)
      send.click()

      window.location = '/'

      cleanState()
      cleanData()

    } else {

      modal.classList.add('invalid-modal')
      alerta.textContent = 'Please check the fields.'
      openModal()
    }
  })

})

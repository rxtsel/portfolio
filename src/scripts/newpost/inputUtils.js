import input from '@inquirer/input'
import confirm from '@inquirer/confirm'

export const askTitle = async () => {
  return await input({ message: 'Post title:', default: '' })
}

export const askIsDraft = async () => {
  return await confirm({ message: 'Is Draft?', default: false })
}

export const askDescription = async () => {
  return await input({ message: 'Post description:', default: '' })
}

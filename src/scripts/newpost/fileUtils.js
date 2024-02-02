import { execSync } from 'child_process'
import fs from 'fs'

export const getAuthorName = () => {
  try {
    return execSync('git config --get user.name').toString().slice(0, -1)
  } catch (err) {
    return ''
  }
}

export const fileExists = (fullPath) => {
  try {
    fs.statSync(fullPath)
    return true
  } catch (err) {
    return false
  }
}

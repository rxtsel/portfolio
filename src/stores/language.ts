import { atom } from 'nanostores'

type Language = 'en' | 'es'

export const lang = atom<Language>('es')


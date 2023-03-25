import { useStore } from '@nanostores/react'
import { lang } from '../stores/language'
import style from './nav/nav.module.css'
import { SiGoogletranslate } from 'react-icons/si/index'

export function ToggleLang () {

  const $lang = useStore(lang)

  const handleClick = () => $lang === 'es' ? lang.set('en') : lang.set('es')

  return (
  <div 

    className={style.lang_content}
    onClick={handleClick}
    id="lang"
    >
      {$lang === 'es' ? 'ES' : 'EN'}
     <SiGoogletranslate /> 
  </div>
  )
}

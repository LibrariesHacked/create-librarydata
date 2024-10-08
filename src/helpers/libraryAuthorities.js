import axios from 'axios'

import * as config from './config'

export async function getLibraryAuthorities () {
  const response = await axios.get(config.authorities_path)
  if (response && response.data) {
    return response.data
  } else {
    return []
  }
}

export async function getLibraryAuthorityByName (name) {
  const response = await axios.get(config.authorities_path + '/name/' + name)
  if (response && response.data) {
    return response.data
  } else {
    return {}
  }
}

export async function getAuthorityLsoaStatsByCode (code) {
  const response = await axios.get(
    config.lsoas_path + '/smallareas/libraryauthority/' + code
  )
  if (response && response.data) {
    return response.data
  } else {
    return {}
  }
}

export function getLibraryAuthoritySystemName (name) {
  return name.replace(/[. ,:-]+/g, '-').toLowerCase()
}

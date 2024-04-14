import axios from 'axios'

import * as config from './config.json'

export function extractPostcodeSectors (postcodeList) {
  const sectors = new Set(
    postcodeList
      .map(postcode => extractPostcodeSector(postcode))
      .filter(sector => sector != null)
  )
  return [...sectors]
}

export function extractPostcodeSector (postcode) {
  const re = /[a-zA-Z]+\d\d?[a-zA-Z]?\s*\d+/
  if (postcode) {
    const match = postcode.match(re)
    if (match && match.length > 0) return match[0].substring(0, 6)
  }
  return null
}

export function getLsoasFromPostcodeSectors (sectors, callback) {
  axios
    .post(config.postcode_api + 'lsoas?filter=sector', sectors)
    .then(response => {
      callback(response.data)
    })
}

export function extractLsoaLookupFromPostcodes (postcodeList, callback) {
  const sectors = extractPostcodeSectors(postcodeList)

  const postcodes = {}
  getLsoasFromPostcodeSectors(sectors, lsoas => {
    Object.keys(lsoas).forEach(lsoa => {
      lsoas[lsoa].forEach(postcode => {
        postcodes[postcode.replace(/\s/g, '')] = lsoa.trim()
      })
    })
    callback(postcodes)
  })
}

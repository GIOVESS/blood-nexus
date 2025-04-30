import { GeocoderAddressComponent, PlaceDetailsResponse } from '@/types/place'
import { AddressInput } from '@/types/place'
import { AddressType } from '@prisma/client'
import { counties, subCounties, wards } from '@/data/kenya-geo'

type NormalizedAddress = AddressInput & {
  county: string
  countyId: string
  subCounty: string
  subCountyId: string
  ward: string
  wardId: string
}

const normalizeAddress = (result: PlaceDetailsResponse): NormalizedAddress => {
  const address: NormalizedAddress = {
    label: result.name ?? result.formatted_address ?? '',
    type: result.types?.find((type) => type === 'hospital')
      ? AddressType.HOSPITAL
      : result.types?.find((type) => type === 'blood_bank')
        ? AddressType.BLOOD_BANK
        : AddressType.OTHER,
    county: '',
    countyId: '',
    subCounty: '',
    subCountyId: '',
    ward: '',
    wardId: '',
    streetAddress: '',
    postalCode: '',
    landmark: result.name ?? '',
    instructions: ''
  }

  result.address_components?.forEach((component: GeocoderAddressComponent) => {
    console.log(component.long_name)
    if (
      component.long_name.includes('County') ||
      component.types.includes('administrative_area_level_1')
    ) {
      address.countyId =
        counties.find((county) =>
          component.long_name.includes(county.name)
        )?.id ?? ''
      address.county = component.long_name.replace('County', '').trim()
    } else if (
      component.long_name.includes('SubCounty') ||
      component.types.includes('administrative_area_level_2')
    ) {
      address.subCountyId =
        subCounties.find((subCounty) =>
          component.long_name.includes(subCounty.name)
        )?.id ?? ''
      address.subCounty = component.long_name.replace('SubCounty', '').trim()
    } else if (
      component.long_name.includes('Ward') ||
      component.types.includes('sublocality')
    ) {
      address.wardId =
        wards.find((ward) => component.long_name.includes(ward.name))
          ?.id ?? ''
      if (address.wardId) {
        address.ward = component.long_name.replace('Ward', '').trim()
      }
    } else if (
      component.long_name.includes('Postal Code') ||
      component.types.includes('postal_code')
    ) {
      address.postalCode = component.long_name.replace('Postal Code', '').trim()
    } else if (
      component.long_name.includes('Street') ||
      component.types.includes('route') ||
      component.types.includes('locality') ||
      component.types.includes('fom')
    ) {
      address.streetAddress = component.long_name.replace('Street', '').trim()
    }
  })

  return address
}

export default normalizeAddress

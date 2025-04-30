import { Address } from '@prisma/client'

const formatAddress = (address: Address): string => {
  const components = [
    address.label,
    address.streetAddress,
    address.postalCode,
    address.ward,
    address.subCounty,
    address.county
  ]

  return components
    .filter(Boolean)
    .filter((component) => component !== '')
    .join(', ')
}

export { formatAddress }

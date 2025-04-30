/// <reference types="google.maps" />
import { AddressType } from '@prisma/client'
export type GooglePlaceSuggestion = google.maps.places.AutocompletePrediction
export type GeocoderAddressComponent = google.maps.GeocoderAddressComponent
export type PlaceDetailsResponse = google.maps.places.PlaceResult

type Place = {
  formattedAddress: string
  placeId: string
  type: string[]
  name: string
  streetNumber?: string
  streetAddress?: string
  city?: string
  state?: string
  country?: string
  countryCode?: string
  postalCode?: string
  landmark?: string
  vicinity?: string
  county?: string
  subCounty?: string
  ward?: string
}

type AddressInput = {
  label: string
  type: AddressType
  county: string
  subCounty: string
  ward: string
  streetAddress: string
  postalCode: string
  landmark: string
  instructions: string
}

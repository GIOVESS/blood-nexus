'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextFieldElement, SelectElement } from 'react-hook-form-mui'
import { Control, FieldErrors } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { counties, subCounties, wards } from '@/data/kenya-geo'
import { AddressInput, AddressSchema } from '@/schema/donation-request'
import { UpdateProfileInput } from '@/schema/account'
import Map from '@/app/components/Map'
import { useState, useRef, useEffect, RefObject } from 'react'

type FieldConfig = {
  name: keyof AddressInput
  fieldType: string
  label: string
  options?: { id: string; label: string }[]
  placeholder?: string
  multiline?: boolean
  rows?: number
}

const countyOptions = counties.map((county) => ({
  id: county.id,
  label: county.name
}))

const getSubCountyOptions = (countyId: string) => {
  return subCounties
    .filter((subCounty) => subCounty.countyId === countyId)
    .map((subCounty) => ({
      id: subCounty.id,
      label: subCounty.name
    }))
}

const getWardOptions = (subCountyId: string) => {
  return wards
    .filter((ward) => ward.subCountyId === subCountyId)
    .map((ward) => ({
      id: ward.id,
      label: ward.name
    }))
}

const addressFields: Array<FieldConfig> = [
  {
    name: 'label',
    fieldType: 'text',
    label: 'Label',
    placeholder: 'eg. Home, Office'
  },
  {
    name: 'type',
    fieldType: 'select',
    label: 'Address Type',
    options: [
      { id: 'HOSPITAL', label: 'Hospital' },
      { id: 'BLOOD_BANK', label: 'Blood Bank' },
      { id: 'OTHER', label: 'Other' }
    ]
  },
  {
    name: 'streetAddress',
    fieldType: 'text',
    label: 'Street Address',
    placeholder: 'eg. 22, Baker Street',
    multiline: true,
    rows: 2
  },
  {
    name: 'landmark',
    fieldType: 'text',
    label: 'Landmark',
    placeholder: 'eg. Near to Shopping Mall'
  },
  {
    name: 'postalCode',
    fieldType: 'text',
    label: 'Postal Code',
    placeholder: 'eg. 1200'
  },
  {
    name: 'instructions',
    fieldType: 'text',
    label: 'Additional Instructions',
    placeholder: 'Any other instructions',
    multiline: true,
    rows: 2
  }
]

const commonTextFieldProps = {
  fullWidth: true,
  slotProps: {
    input: {
      style: { fontSize: '14px' }
    },
    inputLabel: {
      shrink: true
    }
  }
}

const LocationFields = ({
  control,
  errors
}: {
  control: Control<AddressInput>
  errors: FieldErrors<AddressInput>
}) => {
  const county = useWatch({
    control,
    name: 'county'
  })
  const subCounty = useWatch({
    control,
    name: 'subCounty'
  })

  const subCountyOptions = county ? getSubCountyOptions(county) : []
  const wardOptions = subCounty ? getWardOptions(subCounty) : []

  return (
    <>
      <SelectElement
        name="county"
        control={control}
        label="County"
        options={countyOptions}
        helperText={errors.county?.message}
        fullWidth={true}
        slotProps={{
          ...commonTextFieldProps.slotProps,
          select: {
            displayEmpty: true,
            renderValue: (value: unknown) => {
              if (!value) return 'Select one'
              const option = countyOptions.find((opt) => opt.id === value)
              return option?.label || String(value)
            }
          }
        }}
      />
      <SelectElement
        name="subCounty"
        control={control}
        label="SubCounty"
        options={subCountyOptions}
        disabled={!county}
        helperText={errors.subCounty?.message}
        fullWidth={true}
        slotProps={{
          ...commonTextFieldProps.slotProps,
          select: {
            displayEmpty: true,
            renderValue: (value: unknown) => {
              if (!value) return 'Select one'
              const option = subCountyOptions.find((opt) => opt.id === value)
              return option?.label || String(value)
            }
          }
        }}
      />
      <SelectElement
        name="ward"
        control={control}
        label="Ward"
        options={wardOptions}
        disabled={!subCounty}
        helperText={errors.ward?.message}
        fullWidth={true}
        slotProps={{
          ...commonTextFieldProps.slotProps,
          select: {
            displayEmpty: true
          }
        }}
      />
    </>
  )
}

const AddressForm = ({
  initial,
  onSubmit
}: {
  initial?: UpdateProfileInput['address']
  onSubmit: (data: AddressInput) => void
}) => {
  const initialAddress: AddressInput = {
    label: initial?.label || '',
    type: initial?.type || 'OTHER',
    county: initial?.county || '',
    subCounty: initial?.subCounty || '',
    ward: initial?.ward || '',
    streetAddress: initial?.streetAddress || '',
    postalCode: initial?.postalCode || '',
    landmark: initial?.landmark || '',
    instructions: initial?.instructions || '',
    latitude: initial?.latitude || undefined,
    longitude: initial?.longitude || undefined
  }
  const [address, setAddress] = useState<AddressInput>(initialAddress)
  const formRef = useRef<HTMLFormElement>(null)

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setAddress((prev) => ({
      ...prev,
      latitude,
      longitude
    }))
    if (formRef.current) {
      const event = new CustomEvent('location-change', {
        detail: { latitude, longitude }
      })
      formRef.current.dispatchEvent(event)
    }
  }

  return (
    <div className="max-w-xl">
      <div className="px-6 pt-6">
        <Map
          onLocationSelect={handleLocationSelect}
          initialLatitude={address?.latitude || 23.8103}
          initialLongitude={address?.longitude || 90.4125}
          height="300px"
        />
      </div>
      <Form initial={address} onSubmit={onSubmit} formRef={formRef} />
    </div>
  )
}

export default AddressForm

const Form = ({
  initial,
  onSubmit,
  formRef
}: {
  initial: AddressInput
  onSubmit: (data: AddressInput) => void
  formRef: RefObject<HTMLFormElement>
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors }
  } = useForm<AddressInput>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      ...initial,
      latitude: initial.latitude,
      longitude: initial.longitude
    }
  })

  useEffect(() => {
    const form = formRef.current
    if (!form) return

    const handleLocationChange = (e: Event) => {
      const { latitude, longitude } = (e as CustomEvent).detail
      setValue('latitude', latitude)
      setValue('longitude', longitude)
    }

    form.addEventListener('location-change', handleLocationChange)
    return () => {
      form.removeEventListener('location-change', handleLocationChange)
    }
  }, [setValue])

  const onSubmitHandler = (data: AddressInput) => {
    console.log(data)
    onSubmit(data)
  }

  return (
    <form
      ref={formRef}
      id="address-form"
      onSubmit={handleSubmit(onSubmitHandler)}
      className="w-full space-y-6 p-6 relative rounded-md"
    >
      <TextFieldElement
        {...addressFields[0]}
        control={control}
        helperText={errors.label?.message}
        {...commonTextFieldProps}
      />
      <SelectElement
        {...addressFields[1]}
        control={control}
        helperText={errors.type?.message}
        fullWidth={true}
        slotProps={{
          ...commonTextFieldProps.slotProps,
          select: {
            displayEmpty: true,
            renderValue: (value: unknown) => {
              if (!value) return 'Select one'
              const option = addressFields[1].options?.find(
                (opt) => opt.id === value
              )
              return option?.label || String(value)
            }
          }
        }}
      />

      <LocationFields control={control} errors={errors} />

      {addressFields.slice(2).map((field) => (
        <TextFieldElement
          key={field.name}
          {...field}
          control={control}
          helperText={errors[field.name]?.message}
          {...commonTextFieldProps}
        />
      ))}

      <input type="hidden" {...register('latitude')} />
      <input type="hidden" {...register('longitude')} />
    </form>
  )
}

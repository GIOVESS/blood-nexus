import { NextRequest, NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { BloodDonationRequestFormSchema } from '@/schema/donation-request'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body with Zod
    const parseResult = BloodDonationRequestFormSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: parseResult.error.errors },
        { status: 400 }
      )
    }
    const data = parseResult.data

    // Create the blood donation request in the database
    const created = await prismaClient.bloodDonationRequest.create({
      data: {
        bloodGroup: data.donationRequest.bloodGroup,
        unit: data.donationRequest.unit,
        requiredOn: data.donationRequest.requiredOn,
        phone: data.donationRequest.phone,
        notes: data.donationRequest.notes,
        priority: data.donationRequest.priority,
        address: {
          create: {
            label: data.address.label,
            type: data.address.type,
            county: data.address.county,
            subCounty: data.address.subCounty,
            ward: data.address.ward,
            streetAddress: data.address.streetAddress,
            postalCode: data.address.postalCode,
            landmark: data.address.landmark,
            instructions: data.address.instructions,
            latitude: data.address.latitude,
            longitude: data.address.longitude,
          }
        },
        patient: {
          create: {
            name: data.patient.name,
            gender: data.patient.gender,
            age: data.patient.age,
            disease: data.patient.disease,
          }
        }
      },
      include: {
        address: true,
        patient: true,
      }
    })

    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
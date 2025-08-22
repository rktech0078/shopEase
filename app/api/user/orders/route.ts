import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { client } from '@/sanity/lib/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's email from session
    const userEmail = session.user.email

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    // Fetch orders for the authenticated user
    const orders = await client.fetch(
      `*[_type == "order" && customer.email == $userEmail] | order(createdAt desc) {
        _id,
        orderId,
        customer,
        items[] {
          productId,
          productName,
          quantity,
          price,
          discount,
          finalPrice,
          productImage
        },
        totalAmount,
        status,
        paymentMethod,
        paymentStatus,
        createdAt,
        notes
      }`,
      { userEmail }
    )

    return NextResponse.json({ orders })

  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

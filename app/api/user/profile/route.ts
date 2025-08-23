import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { client } from '@/sanity/lib/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await client.fetch(
      `*[_type == "user" && _id == $userId][0]`,
      { userId: (session.user as any).id }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove sensitive data
    const { password: _, verificationToken: __, resetPasswordToken: ___, resetPasswordExpires: ____, ...userProfile } = user

    return NextResponse.json({ user: userProfile })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { fullName, phone, address } = await request.json()

    // Update user profile
    const updatedUser = await client.patch((session.user as any).id).set({
      fullName: fullName || undefined,
      phone: phone || undefined,
      address: address || undefined,
      updatedAt: new Date().toISOString(),
    }).commit()

    // Remove sensitive data
    const { password: _, verificationToken: __, resetPasswordToken: ___, resetPasswordExpires: ____, ...userProfile } = updatedUser

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: userProfile 
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

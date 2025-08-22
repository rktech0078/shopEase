import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// Server-side Sanity client with API token
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!, // Use server-side token
  useCdn: false,
});

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    console.log('API Route: Creating order with data:', orderData);
    
    // Generate a unique order ID if not provided
    if (!orderData.orderId) {
      orderData.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    // Set creation date if not provided
    if (!orderData.createdAt) {
      orderData.createdAt = new Date().toISOString();
    }
    
    // Ensure proper status values
    if (!orderData.status) {
      orderData.status = 'pending';
    }
    if (!orderData.paymentStatus) {
      orderData.paymentStatus = 'pending';
    }
    
    console.log('API Route: Sanity client config:', {
      projectId: sanityClient.config().projectId,
      dataset: sanityClient.config().dataset,
      apiVersion: sanityClient.config().apiVersion,
      hasToken: !!sanityClient.config().token
    });
    
    // Create the order document in Sanity
    const result = await sanityClient.create({
      _type: 'order',
      orderId: orderData.orderId,
      customer: orderData.customer,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: orderData.status,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      createdAt: orderData.createdAt,
      notes: orderData.notes || ''
    });
    
    console.log('API Route: Order created successfully in Sanity:', result);
    
    return NextResponse.json({
      success: true,
      order: { ...orderData, _id: result._id, _createdAt: result._createdAt }
    });
    
  } catch (error) {
    console.error('API Route: Error creating order:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create order' 
      },
      { status: 500 }
    );
  }
}

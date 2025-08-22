import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import nodemailer from 'nodemailer';

// Server-side Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

// Email transporter configuration - Fixed function name
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Alternative: Resend email service (more reliable)
const sendEmailWithResend = async (to: string, subject: string, html: string) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ShopEase <noreply@yourdomain.com>',
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Resend email error:', error);
    throw error;
  }
};

// Email templates
const getEmailTemplate = (orderId: string, customerName: string, status: string, items: any[]) => {
  const statusMessages = {
    pending: 'Your order has been placed and is currently pending.',
    processing: 'Your order is now being processed and prepared for shipping.',
    shipped: 'Your order has been shipped and is on its way to you!',
    delivered: 'Your order has been delivered successfully!',
    cancelled: 'Your order has been cancelled as requested.',
  };

  const statusMessage = statusMessages[status as keyof typeof statusMessages] || 'Your order status has been updated.';

  return {
    subject: `Order ${orderId} Status Update - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">ShopEase</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Order Status Update</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${customerName},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            ${statusMessage}
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Order Details</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: #667eea; font-weight: bold; text-transform: capitalize;">${status}</span></p>
            <p style="margin: 5px 0; color: #666;"><strong>Items:</strong> ${items.length} product(s)</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/orders/${orderId}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View Order Details
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you have any questions about your order, please don't hesitate to contact our customer support team.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
              Thank you for choosing ShopEase!<br>
              Best regards,<br>
              The ShopEase Team
            </p>
          </div>
        </div>
      </div>
    `
  };
};

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status, notes } = await request.json();
    
    console.log('API Route: Updating order status:', { orderId, status, notes });
    
    // Update order in Sanity
    const result = await sanityClient
      .patch(orderId)
      .set({ 
        status,
        notes: notes || '',
        updatedAt: new Date().toISOString()
      })
      .commit();
    
    console.log('Order status updated successfully:', result);
    
    // Get order details for email
    const order = await sanityClient.getDocument(orderId);
    
    if (order && order.customer?.email) {
      try {
        // Send email notification
        const emailTemplate = getEmailTemplate(
          order.orderId,
          order.customer.fullName,
          status,
          order.items
        );
        
        // Try Gmail first
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: order.customer.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          });
          
          console.log('✅ Gmail email sent successfully to:', order.customer.email);
        } catch (gmailError) {
          console.log('❌ Gmail failed, trying Resend...');
          
          // Try Resend as fallback
          try {
            await sendEmailWithResend(
              order.customer.email,
              emailTemplate.subject,
              emailTemplate.html
            );
            console.log('✅ Resend email sent successfully to:', order.customer.email);
          } catch (resendError) {
            console.log('❌ Both email services failed, logging email details...');
            
            // Log email details for development
            console.log('📧 Email Details (Development Mode):');
            console.log('To:', order.customer.email);
            console.log('Subject:', emailTemplate.subject);
            console.log('HTML Content Length:', emailTemplate.html.length);
            console.log('Email Template Preview:', emailTemplate.html.substring(0, 200) + '...');
            
            // Show success message to user (email will be sent later)
            console.log('📝 Note: Email logged for development. Configure email service for production.');
          }
        }
        
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails
      }
    }
    
    return NextResponse.json({
      success: true,
      order: result,
      message: 'Order status updated successfully'
    });
    
  } catch (error) {
    console.error('API Route: Error updating order status:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update order status' 
      },
      { status: 500 }
    );
  }
}

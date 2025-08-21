import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'customer',
      title: 'Customer Information',
      type: 'object',
      fields: [
        { name: 'fullName', type: 'string', title: 'Full Name' },
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
        { name: 'address', type: 'string', title: 'Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State/Province' },
        { name: 'zipCode', type: 'string', title: 'ZIP/Postal Code' },
      ],
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productId', type: 'string', title: 'Product ID' },
            { name: 'productName', type: 'string', title: 'Product Name' },
            { name: 'quantity', type: 'number', title: 'Quantity' },
            { name: 'price', type: 'number', title: 'Price' },
            { name: 'discount', type: 'number', title: 'Discount %' },
            { name: 'finalPrice', type: 'number', title: 'Final Price' },
            { name: 'productImage', type: 'image', title: 'Product Image' },
          ],
        },
      ],
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Credit Card', value: 'credit_card' },
          { title: 'Cash on Delivery', value: 'cod' },
          { title: 'Bank Transfer', value: 'bank_transfer' },
        ],
      },
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'createdAt',
      title: 'Order Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'notes',
      title: 'Order Notes',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'orderId',
      subtitle: 'customer.fullName',
      media: 'items.0.productImage',
    },
  },
})
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'user',
  title: 'Users',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'password',
      title: 'Password Hash',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        { name: 'street', type: 'string', title: 'Street Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State/Province' },
        { name: 'zipCode', type: 'string', title: 'ZIP/Postal Code' },
        { name: 'country', type: 'string', title: 'Country' },
      ],
    }),
    defineField({
      name: 'role',
      title: 'User Role',
      type: 'string',
      options: {
        list: [
          { title: 'Customer', value: 'customer' },
          { title: 'Admin', value: 'admin' },
        ],
      },
      initialValue: 'customer',
    }),
    defineField({
      name: 'isVerified',
      title: 'Email Verified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'verificationToken',
      title: 'Email Verification Token',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'resetPasswordToken',
      title: 'Password Reset Token',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'resetPasswordExpires',
      title: 'Password Reset Expires',
      type: 'datetime',
      hidden: true,
    }),
    defineField({
      name: 'lastLogin',
      title: 'Last Login',
      type: 'datetime',
    }),
    defineField({
      name: 'createdAt',
      title: 'Account Created',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'email',
      role: 'role',
    },
    prepare(selection) {
      const { title, subtitle, role } = selection
      return {
        title: title || 'Unnamed User',
        subtitle: subtitle,
        media: role === 'admin' ? 'A' : 'U',
      }
    },
  },
})

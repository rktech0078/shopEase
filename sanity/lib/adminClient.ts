import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const adminClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Use admin token for write operations
})

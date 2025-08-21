import { type SchemaTypeDefinition } from 'sanity'
import banner from './banner'
import product from './product'
import category from './category'
import order from './order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [banner, product, category, order],
}
export default schema
export type ProductStatus = "active" | "inactive" | "out-of-stock"

export type ProductComponent = { name: string; percentage: string }
export type ProductIngredient = { name: string; benefit: string }

export type Product = {
  id: string
  name: string
  category: string
  subCategory: string
  subSubCategory: string
  warehouse: string
  tags: string[]
  mrp: number
  discount: number
  price: number
  stock: number
  status: ProductStatus
  about: string
  description: string
  components: ProductComponent[]
  ingredients: ProductIngredient[]
  benefits: string
  howToUse: string
  expiryDate: string
  weight: number
  length: number
  width: number
  height: number
  customShipping: boolean
  customShippingCost: number
  gstApplicable: boolean
  gstRate: number
  images: string[]
}


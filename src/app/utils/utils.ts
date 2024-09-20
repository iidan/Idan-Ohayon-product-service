import { Product } from '../products/product.models';

// Helper function to create default Product structure
export const getDefaultProduct = (): Product => ({
  id: 0,
  meta: {
    barcode: '',
    createdAt: '',
    updatedAt: '',
    qrCode: ''
  },
  title: '',
  images: [],
  imagesString: '',
  tags: [],
  tagsString: '',
  rating: 0,
  price: 0
});
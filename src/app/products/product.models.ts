export interface Product {
  id: number;
  meta: {
    barcode: string;
    createdAt: string;
    updatedAt: string;
    qrCode: string;
  };
  title: string;
  images: string[];
  imagesString?: string;
  rating: number;
  price: number;
  tags: string[];
  tagsString?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

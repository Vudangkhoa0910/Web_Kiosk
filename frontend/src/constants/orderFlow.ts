/**
 * Order Flow Constants
 * Mock data cho restaurants và products
 */

import type { Restaurant, ProductItem } from '../types/orderFlow'

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest1',
    name: 'Burger House',
    description: 'Chuyên các loại burger ngon và đồ ăn nhanh',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    location: 'Tầng 1, Khu A',
    category: 'fastfood'
  },
  {
    id: 'rest2',
    name: 'Cafe & Tea',
    description: 'Đồ uống và món ăn nhẹ phong cách hiện đại',
    image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    location: 'Tầng 2, Khu B',
    category: 'cafe'
  },
  {
    id: 'rest3',
    name: 'Asian Kitchen',
    description: 'Món ăn châu Á đa dạng và hấp dẫn',
    image: 'https://images.pexels.com/photos/1833349/pexels-photo-1833349.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    location: 'Tầng 1, Khu C',
    category: 'asian'
  }
]

export const PRODUCT_ITEMS: ProductItem[] = [
  // Đồ ăn
  {
    id: 'pho-ha-noi',
    name: 'Phở Bò Hà Nội',
    description: 'Bánh phở mềm, nước dùng trong, thịt bò tươi',
    price: 10000,
    image: 'https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'food',
    available: true,
    restaurantId: 'rest3'
  },
  {
    id: 'banh-mi',
    name: 'Bánh Mì Thịt Nướng',
    description: 'Bánh giòn, pate, thịt nướng và rau thơm',
    price: 5000,
    image: 'https://images.pexels.com/photos/4917818/pexels-photo-4917818.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'food',
    available: true,
    restaurantId: 'rest1'
  },
  {
    id: 'bun-cha',
    name: 'Bún Chả Hà Nội',
    description: 'Chả nướng than hoa, nước mắm chua ngọt',
    price: 10000,
    image: 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'food',
    available: true,
    restaurantId: 'rest3'
  },
  // Đồ uống
  {
    id: 'ca-phe-sua',
    name: 'Cà Phê Sữa Đá',
    description: 'Cà phê phin truyền thống với sữa đặc',
    price: 5000,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'drink',
    available: true,
    restaurantId: 'rest2'
  },
  {
    id: 'tra-sua',
    name: 'Trà Sữa Trân Châu',
    description: 'Trà sữa thơm ngon với trân châu đen dai giòn',
    price: 10000,
    image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'drink',
    available: true,
    restaurantId: 'rest2'
  },
  {
    id: 'nuoc-suoi',
    name: 'Nước Suối Lavie',
    description: 'Nước suối tinh khiết chai 500ml',
    price: 5000,
    image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'drink',
    available: true,
    restaurantId: 'rest2'
  },
  // Đồ ăn vặt
  {
    id: 'snack-lay',
    name: 'Snack Khoai Tây Lay\'s',
    description: 'Bánh snack khoai tây vị tự nhiên gói 56g',
    price: 5000,
    image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'snack',
    available: true,
    restaurantId: 'rest2'
  },
  {
    id: 'banh-quy',
    name: 'Bánh Quy Oreo',
    description: 'Bánh quy chocolate kem vani gói 133g',
    price: 10000,
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'snack',
    available: true,
    restaurantId: 'rest2'
  },
  // Tráng miệng
  {
    id: 'banh-flan',
    name: 'Bánh Flan Caramel',
    description: 'Mềm mịn, thơm béo lớp caramel',
    price: 5000,
    image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    category: 'dessert',
    available: true,
    restaurantId: 'rest2'
  }
]

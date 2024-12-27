import { ImageSourcePropType } from 'react-native'

type CartItemType = {
  id: number
  title: string
  heroImage: ImageSourcePropType
  price: number
  quantity: number
  maxQuantity: number
}

export type CartItemProps = {
  item: CartItemType
  onRemove: (id: number) => void
  onIncrement: (id: number) => void
  onDecrement: (id: number) => void
}

'use client'
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
}

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.item.id)
      if (existing) {
        return state.map(i =>
          i.id === action.item.id
            ? { ...i, quantity: Math.min(i.quantity + action.item.quantity, 10) }
            : i
        )
      }
      return [...state, { ...action.item, quantity: Math.min(action.item.quantity, 10) }]
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QTY':
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: Math.max(1, Math.min(action.quantity, 10)) } : i
      )
    case 'CLEAR':
      return []
    case 'HYDRATE':
      return action.items
    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  total: number
  count: number
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  const [isOpen, dispatchOpen] = useReducer((_: boolean, v: boolean) => v, false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('azahara-cart')
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'HYDRATE', items: parsed })
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('azahara-cart', JSON.stringify(items))
    } catch {
      // ignore storage errors
    }
  }, [items])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem: item => dispatch({ type: 'ADD', item }),
        removeItem: id => dispatch({ type: 'REMOVE', id }),
        updateQty: (id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
        total,
        count,
        isOpen,
        setIsOpen: v => dispatchOpen(v),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

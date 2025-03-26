import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interfaces for Product and Purchase History
interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface PurchaseHistoryItem {
    id: string;
    items: Product[];
    totalAmount: number;
    date: string;
}

interface CartStore {
    items: Product[];
    purchaseHistory: PurchaseHistoryItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalAmount: () => number;
    pagar: () => void;
    removePurchaseHistoryItem: (purchaseId: string) => void;
    getTotalPurchases: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            purchaseHistory: [],

            addItem: (product) => set((state) => {
                const existingItem = state.items.find(item => item.id === product.id);
                if (existingItem) {
                    return {
                        items: state.items.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: Math.min(item.quantity + 1, 10) } // Limit quantity to 10
                                : item
                        ),
                    };
                }
                return { items: [...state.items, { ...product, quantity: 1 }] };
            }),

            removeItem: (productId) => set((state) => ({
                items: state.items.filter(item => item.id !== productId),
            })),

            updateQuantity: (productId, quantity) => set((state) => ({
                items: state.items.map(item =>
                    item.id === productId
                        ? { ...item, quantity: Math.max(1, Math.min(quantity, 10)) } // Limit between 1-10
                        : item
                ),
            })),

            clearCart: () => set({ items: [] }),

            totalItems: () => {
                const state = get();
                return state.items.reduce((total, item) => total + item.quantity, 0);
            },

            totalAmount: () => {
                const state = get();
                return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            pagar: () => {
                const state = get();
                if (state.items.length === 0) return;

                // Create a purchase history entry
                const purchaseEntry: PurchaseHistoryItem = {
                    id: `purchase-${Date.now()}`, // Unique ID for each purchase
                    items: [...state.items],
                    totalAmount: state.totalAmount(),
                    date: new Date().toISOString()
                };

                set((state) => ({
                    purchaseHistory: [...state.purchaseHistory, purchaseEntry],
                    items: [] // Clear the cart after purchase
                }));
            },

            removePurchaseHistoryItem: (purchaseId) => set((state) => ({
                purchaseHistory: state.purchaseHistory.filter(purchase => purchase.id !== purchaseId)
            })),

            getTotalPurchases: () => {
                const state = get();
                return state.purchaseHistory.reduce((total, purchase) => total + purchase.totalAmount, 0);
            }
        }),
        {
            name: 'cart-storage', // name of the item in localStorage
            partialize: (state) => ({
                items: state.items,
                purchaseHistory: state.purchaseHistory
            })
        }
    )
);
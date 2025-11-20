import { create } from "zustand";
import { devtools } from "zustand/middleware"
import type { PaymentMethod, ShoppingCartContent, ShoppingCartItem } from "../types";
import { createOrder } from "../api/SalesApi";

interface Store {
    //TODO: VALIDAR SI SE DEBE USAR O NO ES NECESARIO
    total: number
    ////TODO: VALIDAR SI SE DEBE USAR O NO ES NECESARIO
    subTotal: number
    paymentMethod: PaymentMethod
    contents: ShoppingCartContent
    addToCart: (item: ShoppingCartItem) => void
    deleteItemToCart: (index: number) => void
    setPaymentMethod: (method_of_payment: PaymentMethod) => void
    createOrder: () => Promise<void>
    clearOrder:()=>void
    updateTotals: () => void
    success: string
    error: string
}

export const useStore = create<Store>()(devtools((set, get) => ({
    total: 0,
    subTotal: 0,
    paymentMethod: 'CASH',
    contents: [],
    success: '',
    error: '',
    addToCart: (item) => {
        let contents: ShoppingCartContent = []

        contents = [...get().contents, item]

        set(() => ({
            contents
        }))
    },
    setPaymentMethod: (method_of_payment) => {
        const paymentMethod = method_of_payment

        set(() => ({
            paymentMethod
        }))
    },
    createOrder: async () => {
        const paymentMethod = get().paymentMethod

        const items = get().contents.map(item => ({
            productId: item.product.id,
            locationId: item.location.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        }))
        const data = {
            paymentMethod,
            items
        }

        try {
            const {message} = await createOrder(data)
            set(() => ({
                success:message
            }))
        } catch (error) {
            set(() => ({
                error:error.message
            }))
        }

    },
    clearOrder:()=>{
        set(() => ({
            total:0,
            subTotal:0,
            paymentMethod:'CASH',
            contents:[],
            success:'',
            error:''
        }))
    },
    updateTotals: () => {
        const contents = get().contents
        const subTotal = contents.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0)
        const taxes = subTotal * 0.0 //TODO: Asignar impuestos correspondientes
        const total = subTotal + taxes

        set(() => ({ subTotal, total }))
    },
    deleteItemToCart: (index) => {
        const itemToDelete = get().contents[index]
        const contents = get().contents.filter(item => item != itemToDelete)
        
        set(() => ({
            contents
        }))
        
        // Llamar updateTotals después de actualizar el estado
        get().updateTotals()
    }

})))
import { isAxiosError } from "axios";
import api from "../lib/axios";
import { ProductsSchema, type Product, type ProductForm } from "../types";


export async function createProduct(formData: ProductForm) {
    try {
        const { data } = await api.post('/inventory/products', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors[0].msg)
        }
    }
}
export async function editProduct({ formData, productId }: { formData: ProductForm, productId: number }) {
    try {
        const { data } = await api.put(`/inventory/products/${productId}`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors[0].msg)
        }
    }
}
export async function getAll() {
    try {
        const { data } = await api.get('/inventory/products')
        const validatedData = ProductsSchema.safeParse(data)
        if (!validatedData) {
            throw new Error('Error de validación de tipado.');
        }
        return validatedData.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors[0].msg)
        }
    }
}
export async function deleteProduct(productId: Product['id']) {
    try {
        const { data } = await api.delete(`/inventory/products/${productId}`)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors[0].msg)
        }
    }
}


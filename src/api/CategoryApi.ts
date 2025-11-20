import api from "../lib/axios";
import { CategoriesSchema, type Category, type CategoryForm } from "../types";
import { isAxiosError } from "axios";

export async function createCategory(formData: CategoryForm) {
    try {
        const { data } = await api.post<string>('/inventory/categories', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors[0].msg)
        }
    }
}
export async function getAll() {
    try {
        const { data } = await api.get('/inventory/categories')
        const validatedData = CategoriesSchema.safeParse(data)
        if (validatedData.success) {
            return validatedData.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors[0].msg)
        }
    }
}

export async function editCategory({ formData, categoryId }: { formData: CategoryForm, categoryId: number }) {
    try {
        const { data } = await api.put(`/inventory/categories/${categoryId}`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors[0].msg)
        }
    }
}

export async function deleteCategory(productId: Category['id']) {
    try {
        const { data } = await api.delete(`/inventory/categories/${productId}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors[0].msg)
        }
    }
}
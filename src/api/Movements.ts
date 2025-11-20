import { isAxiosError } from "axios"
import api from "../lib/axios"
import { MovementsSchema, type MovementForm } from "../types"

export async function getAll() {
    try {
        const { data } = await api.get('/inventory/movements')
        const validatedData = MovementsSchema.safeParse(data)
        if (validatedData.success) {
            return validatedData.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
export async function createMovement(formData:MovementForm) {
    try {
        const { data } = await api.post('/inventory/movements',formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error)
            throw new Error(error.response.data.error)
        }
    }
}
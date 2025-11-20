import { isAxiosError } from "axios"
import api from "../lib/axios"
import type { OrderApi } from "../types"

export async function createOrder(payload: OrderApi) {
    console.log(payload)
    try {
        const { data } = await api.post('/sales/orders', payload)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            // Extraemos el mensaje de la respuesta.
            // Puede venir en 'error', 'message'..
            // Si no encuentra ninguno, usa un mensaje genérico del error de Axios.
            const errorMessage = 
                error.response.data.errors?.[0]?.msg ||
                error.response.data.error || 
                error.response.data.message || 
                error.message;
            
            throw new Error(errorMessage);
        }
        // Si no es un error de Axios, relanzamos un error genérico
        throw new Error('Ocurrió un error inesperado');
    }
}
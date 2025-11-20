import { isAxiosError } from "axios";
import api from "../lib/axios";
import { StocksSchema } from "../types";

export async function getAll() {
    try {
        const {data} = await api.get('/inventory/stock')
        const validatedData = StocksSchema.safeParse(data)
        if(validatedData.success){
            return validatedData.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
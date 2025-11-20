import { isAxiosError } from "axios"
import api from "../lib/axios"
import { LocationsSchema, type Location, type LocationForm } from "../types"


export async function createLocation(formData : LocationForm) {
    try {
        const { data } = await api.post(`/inventory/locations`, formData)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getAll() {
    try {
        const {data} = await api.get('/inventory/locations')
        const validatedData = LocationsSchema.safeParse(data)
        if(validatedData.success){
            return validatedData.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
                    throw new Error(error.response.data.error)
                }
    }
}
export async function editLocation({ formData, locationId }: { formData: LocationForm, locationId: number }) {
    try {
        const { data } = await api.put(`/inventory/locations/${locationId}`, formData)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
export async function deleteLocation(locationId : Location['id']) {
    try {
        const { data } = await api.delete(`/inventory/locations/${locationId}`)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
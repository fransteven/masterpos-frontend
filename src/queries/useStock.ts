import { useQuery } from '@tanstack/react-query'
import { getAll } from '../api/Inventory'

export function useStock() {
    return useQuery({ queryKey: ['stock'], queryFn: getAll })
}
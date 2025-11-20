"use client"

import { useMemo, useState } from "react"
import { ScanText, ShoppingCart, Package } from "lucide-react"
import CarItemRow from "../../components/sales/CarItemRow"
import OrderSummary from "../../components/sales/OrderSummary"
import { useStock } from "../../queries/useStock"

export default function SalesView() {
    const { data, isLoading } = useStock()
    const [productIdInput, setProductIdInput] = useState("")

    const filteredStock = useMemo(() => {
        if (!data) return []
        const trimmed = productIdInput.trim()
        if (trimmed === "") return data
        const parsed = Number(trimmed)
        if (Number.isNaN(parsed)) return []
        return data.filter((record) => record.product.id === parsed)
    }, [data, productIdInput])

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-muted-foreground">Cargando productos...</p>
                </div>
            </div>
        )

    if (data)
        return (
            <div className="h-full flex flex-col lg:flex-row bg-background">
                {/* Área principal de productos */}
                <main className="flex-1 p-6 overflow-hidden">
                    <div className="h-full flex flex-col space-y-6">
                        {/* Header mejorado */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <ShoppingCart className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">Punto de Venta</h1>
                                    <p className="text-sm text-muted-foreground">Busca y agrega productos al carrito</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    <span>{data?.length || 0} productos disponibles</span>
                                </div>
                            </div>
                        </div>

                        {/* Búsqueda mejorada */}
                        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                            <div className="flex gap-4 items-center">
                                <div className="p-2 bg-muted rounded-lg">
                                    <ScanText className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Buscar por ID de producto..."
                                        className="w-full p-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
                                        aria-label="Product code entry"
                                        value={productIdInput}
                                        onChange={(e) => setProductIdInput(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tabla de productos mejorada */}
                        <div className="flex-1 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                            <div className="overflow-auto h-full">
                                <table className="w-full">
                                    <thead className="bg-muted/50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[200px]">
                                                Producto
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[120px]">
                                                Ubicación
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[100px]">
                                                Precio
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[120px]">
                                                Ajustar
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[100px]">
                                                Cantidad
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[80px]">
                                                Acción
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredStock.length > 0 ? (
                                            filteredStock.map((record) => <CarItemRow key={record.id} stockRecord={record} />)
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="p-3 bg-muted rounded-full">
                                                            <Package className="w-8 h-8 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">No se encontraron productos</p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {productIdInput ? "Intenta con otro ID de producto" : "No hay productos disponibles"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Sidebar del resumen de orden */}
                <aside className="w-full lg:w-80 xl:w-[420px] bg-card border-l border-border flex-shrink-0">
                    <div className="h-full p-6">
                        <OrderSummary />
                    </div>
                </aside>
            </div>
        )
}

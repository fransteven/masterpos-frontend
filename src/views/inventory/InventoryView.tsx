import { useStock } from "../../queries/useStock"
import { Package, MapPin, AlertTriangle, TrendingUp } from "lucide-react"

export default function InventoryView() {
    const { data, isLoading } = useStock()

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-muted-foreground">Cargando inventario...</span>
            </div>
        )

    const totalItems = data?.reduce((sum, item) => sum + item.quantity, 0) || 0
    const totalProducts = data?.length || 0
    const lowStockItems = data?.filter((item) => item.quantity < 10).length || 0
    const locations = new Set(data?.map((item) => item.location.name)).size || 0

    const getStockLevelStyle = (quantity: number) => {
        if (quantity < 5) return "text-red-600 bg-red-50 border-red-200"
        if (quantity < 15) return "text-amber-600 bg-amber-50 border-amber-200"
        return "text-green-600 bg-green-50 border-green-200"
    }

    const getStockLevelText = (quantity: number) => {
        if (quantity < 5) return "Stock Bajo"
        if (quantity < 15) return "Stock Medio"
        return "Stock Alto"
    }

    if (data)
        return (
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
                        <p className="text-muted-foreground">Gestiona y monitorea el stock de productos</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Items</p>
                                <p className="text-2xl font-bold text-foreground">{totalItems}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Productos</p>
                                <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Stock Bajo</p>
                                <p className="text-2xl font-bold text-foreground">{lowStockItems}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <MapPin className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Locaciones</p>
                                <p className="text-2xl font-bold text-foreground">{locations}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Producto</th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Locación</th>
                                    <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">Cantidad</th>
                                    <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className={`hover:bg-muted/30 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{item.product.name}</p>
                                                    <p className="text-sm text-muted-foreground">ID: {item.product.id}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-foreground font-medium uppercase">{item.location.name}</span>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <span className="text-lg font-bold text-foreground">{item.quantity}</span>
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStockLevelStyle(item.quantity)}`}
                                            >
                                                {getStockLevelText(item.quantity)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {data.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No hay inventario</h3>
                        <p className="text-muted-foreground">No se encontraron productos en el inventario.</p>
                    </div>
                )}
            </div>
        )
}

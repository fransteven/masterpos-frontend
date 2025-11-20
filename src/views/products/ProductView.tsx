"use client"

import { useNavigate } from "react-router-dom"
import ProductCreationModal from "../../components/products/ProductCreationModal"
import { useQuery } from "@tanstack/react-query"
import { getAll } from "../../api/ProductApi"
import { formatCurrency } from "../../utils"
import ProductEditModal from "../../components/products/ProductEditModal"
import { SquarePen, Trash, Plus, Package } from "lucide-react"
import DeleteProduct from "../../components/products/DeleteProduct"

export default function ProductView() {
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryFn: getAll,
        queryKey: ["products"],
    })

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-muted-foreground">Cargando productos...</p>
                </div>
            </div>
        )

    if (data)
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Gestión de Productos</h1>
                                <p className="text-muted-foreground">Administra tu inventario de productos</p>
                            </div>
                        </div>
                        <button
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm"
                            onClick={() => navigate(location.pathname + "?createProduct=true")}
                        >
                            <Plus className="h-4 w-4" />
                            Crear Producto
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                                    <p className="text-2xl font-bold text-card-foreground">{data.length}</p>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Package className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                                    <p className="text-2xl font-bold text-card-foreground">
                                        {formatCurrency(
                                            data.reduce((sum, item) => sum + Number.parseFloat(item.sale_price.toString()), 0).toString(),
                                        )}
                                    </p>
                                </div>
                                <div className="p-2 bg-accent/10 rounded-lg">
                                    <span className="text-accent font-bold text-lg">$</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Categorías</p>
                                    <p className="text-2xl font-bold text-card-foreground">
                                        {new Set(data.map((item) => item.category.name)).size}
                                    </p>
                                </div>
                                <div className="p-2 bg-secondary/10 rounded-lg">
                                    <span className="text-secondary font-bold text-lg">#</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-primary text-primary-foreground">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Producto</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Marca</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Categoría</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Costo</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Precio Venta</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Garantía</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {data.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={`hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-card-foreground text-sm">{item.name}</div>
                                                    <div className="text-xs text-muted-foreground line-clamp-2 max-w-xs">{item.description}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                                                    {item.brand}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent uppercase">
                                                    {item.category.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-card-foreground">
                                                {formatCurrency(item.unit_cost.toString())}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-primary">
                                                {formatCurrency(item.sale_price.toString())}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">{item.warranty_period_days} días</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        className="p-2 hover:bg-accent/10 rounded-lg transition-colors group"
                                                        onClick={() => navigate(location.pathname + `?editProduct=${item.id}`)}
                                                        title="Editar producto"
                                                    >
                                                        <SquarePen className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group"
                                                        onClick={() => navigate(location.pathname + `?deleteProduct=${item.id}`)}
                                                        title="Eliminar producto"
                                                    >
                                                        <Trash className="h-4 w-4 text-red-600 group-hover:text-red-700" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Empty State */}
                    {data.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-card-foreground mb-2">No hay productos</h3>
                            <p className="text-muted-foreground mb-4">Comienza agregando tu primer producto</p>
                            <button
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
                                onClick={() => navigate(location.pathname + "?createProduct=true")}
                            >
                                <Plus className="h-4 w-4" />
                                Crear Producto
                            </button>
                        </div>
                    )}
                </div>

                <ProductCreationModal />
                {data && <ProductEditModal products={data} />}
                <DeleteProduct />
            </div>
        )
}

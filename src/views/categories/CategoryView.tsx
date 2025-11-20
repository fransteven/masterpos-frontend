"use client"

import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getAll } from "../../api/CategoryApi"
import { SquarePen, Trash, Plus, FolderOpen, Hash, Tag } from "lucide-react"
import CategoryCreationModal from "../../components/categories/CategoryCreationModal"
import CategoryEditModal from "../../components/categories/CategoryEditModal"
import DeleteCategory from "../../components/categories/DeleteCategory"

export default function CategoryView() {
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryFn: getAll,
        queryKey: ["categories"],
    })

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-muted-foreground">Cargando categorías...</p>
                </div>
            </div>
        )

    if (data)
        return (
            <div className="space-y-8 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Categorías</h1>
                        <p className="text-muted-foreground mt-2">Administra las categorías de tus productos</p>
                    </div>
                    <button
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm"
                        onClick={() => navigate(location.pathname + "?createCategory=true")}
                    >
                        <Plus className="h-4 w-4" />
                        Crear Categoría
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FolderOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Categorías</p>
                                <p className="text-2xl font-bold text-foreground">{data.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Tag className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Categorías Activas</p>
                                <p className="text-2xl font-bold text-foreground">{data.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Hash className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Última Actualización</p>
                                <p className="text-sm font-semibold text-foreground">Hoy</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b bg-muted/30">
                        <h2 className="text-lg font-semibold text-foreground">Lista de Categorías</h2>
                    </div>

                    {data.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No hay categorías</h3>
                            <p className="text-muted-foreground mb-4">Comienza creando tu primera categoría</p>
                            <button
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
                                onClick={() => navigate(location.pathname + "?createCategory=true")}
                            >
                                <Plus className="h-4 w-4" />
                                Crear Categoría
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/20">
                                        <th className="text-left py-4 px-6 font-semibold text-foreground">ID</th>
                                        <th className="text-left py-4 px-6 font-semibold text-foreground">Nombre</th>
                                        <th className="text-center py-4 px-6 font-semibold text-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={`border-b hover:bg-muted/30 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/10"
                                                }`}
                                        >
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                                    #{item.id}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 bg-primary/10 rounded-lg">
                                                        <Tag className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <span className="font-medium text-foreground capitalize">{item.name.toLowerCase()}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button
                                                        className="p-2 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors group"
                                                        onClick={() => navigate(location.pathname + `?editCategory=${item.id}`)}
                                                        title="Editar categoría"
                                                    >
                                                        <SquarePen className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-red-50 border border-red-200 rounded-lg transition-colors group"
                                                        onClick={() => navigate(location.pathname + `?deleteCategory=${item.id}`)}
                                                        title="Eliminar categoría"
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
                    )}
                </div>

                {/* MODALES DE CREACIÓN, ACTUALIZACIÓN Y ELIMINACIÓN */}
                <CategoryCreationModal />
                {data && <CategoryEditModal categories={data} />}
                <DeleteCategory />
            </div>
        )
}

"use client"

import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getAll } from "../../api/Locations"
import { SquarePen, Trash, MapPin, Building2, Plus } from "lucide-react"
import LocationCreationModal from "../../components/locations/LocationCreationModal"
import LocationEditModal from "../../components/locations/LocationEditModal"
import DeleteLocation from "../../components/locations/DeleteLocation"

export default function LocationView() {
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryFn: getAll,
        queryKey: ["locations"],
    })

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-muted-foreground">Cargando locaciones...</p>
                </div>
            </div>
        )

    return (
        <div className="space-y-8 p-6">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-balance">Gestión de Locaciones</h1>
                        <p className="text-muted-foreground text-pretty">Administra las ubicaciones físicas de tu inventario</p>
                    </div>
                </div>
            </div>

            {data && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Locaciones</p>
                                <p className="text-2xl font-bold">{data.length}</p>
                            </div>
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Locaciones Activas</p>
                                <p className="text-2xl font-bold text-green-600">{data.length}</p>
                            </div>
                            <MapPin className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Última Actualización</p>
                                <p className="text-sm text-muted-foreground">Hoy</p>
                            </div>
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="rounded-xl border bg-card shadow-sm">
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-semibold">Listado de Locaciones</h2>
                        <p className="text-sm text-muted-foreground">
                            {data ? `${data.length} locaciones registradas` : "Cargando..."}
                        </p>
                    </div>
                    <button
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                        onClick={() => navigate(location.pathname + "?createLocation=true")}
                    >
                        <Plus className="h-4 w-4" />
                        Crear Locación
                    </button>
                </div>

                {data && data.length > 0 ? (
                    <div className="overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">Nombre</th>
                                    <th className="text-center p-4 font-medium text-muted-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className={`border-b transition-colors hover:bg-muted/50 ${index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                            }`}
                                    >
                                        <td className="p-4">
                                            <span className="font-mono text-sm text-muted-foreground">#{item.id}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="font-medium uppercase">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    className="inline-flex items-center justify-center rounded-lg h-9 w-9 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                                    onClick={() => navigate(location.pathname + `?editLocation=${item.id}`)}
                                                    title="Editar locación"
                                                >
                                                    <SquarePen className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                                                </button>
                                                <button
                                                    className="inline-flex items-center justify-center rounded-lg h-9 w-9 border border-destructive/20 bg-destructive/10 text-destructive shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                    onClick={() => navigate(location.pathname + `?deleteLocation=${item.id}`)}
                                                    title="Eliminar locación"
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
                ) : (
                    /* Added empty state */
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-muted/50 rounded-full mb-4">
                            <MapPin className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No hay locaciones registradas</h3>
                        <p className="text-muted-foreground mb-4 max-w-sm text-pretty">
                            Comienza creando tu primera locación para organizar tu inventario
                        </p>
                        <button
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                            onClick={() => navigate(location.pathname + "?createLocation=true")}
                        >
                            <Plus className="h-4 w-4" />
                            Crear Primera Locación
                        </button>
                    </div>
                )}
            </div>

            {/* MODALES DE CREACIÓN, ACTUALIZACIÓN Y ELIMINACIÓN */}
            <LocationCreationModal />
            {data && <LocationEditModal locations={data} />}
            <DeleteLocation />
        </div>
    )
}

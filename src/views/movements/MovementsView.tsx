

import { useNavigate } from "react-router-dom"
import MovementCreationModal from "../../components/movements/MovementCreationModal"
import { useQuery } from "@tanstack/react-query"
import { getAll } from "../../api/Movements"
import { MOVEMENT_TYPE_OPTIONS } from "../../types"
import { formatDate } from "../../utils"
import { Package, TrendingUp, TrendingDown, Calendar, MapPin, FileText, Activity } from "lucide-react"

export default function MovementsView() {
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryKey: ["movements"],
        queryFn: getAll,
    })

    const totalMovements = data?.length || 0
    const recentMovements =
        data?.filter((m) => {
            const movementDate = new Date(m.createdAt)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return movementDate >= weekAgo
        }).length || 0

    const inboundMovements =
        data?.filter(
            (m) =>
                MOVEMENT_TYPE_OPTIONS.find((type) => type.value === m.movementType)?.label?.includes("Entrada") ||
                MOVEMENT_TYPE_OPTIONS.find((type) => type.value === m.movementType)?.label?.includes("Ingreso"),
        ).length || 0

    const outboundMovements =
        data?.filter(
            (m) =>
                MOVEMENT_TYPE_OPTIONS.find((type) => type.value === m.movementType)?.label?.includes("Salida") ||
                MOVEMENT_TYPE_OPTIONS.find((type) => type.value === m.movementType)?.label?.includes("Egreso"),
        ).length || 0

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-muted-foreground">Cargando movimientos...</p>
                </div>
            </div>
        )

    if (data)
        return (
            <div className="space-y-6 p-6">
                <MovementCreationModal />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Activity className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Historial de Movimientos</h1>
                            <p className="text-muted-foreground">Registro completo de movimientos de inventario</p>
                        </div>
                    </div>
                    <button
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                        onClick={() => navigate(location.pathname + "?createMovement=true")}
                    >
                        <Package className="h-4 w-4" />
                        Crear Movimiento
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Activity className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Movimientos</p>
                                <p className="text-2xl font-bold text-foreground">{totalMovements}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Entradas</p>
                                <p className="text-2xl font-bold text-foreground">{inboundMovements}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <TrendingDown className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Salidas</p>
                                <p className="text-2xl font-bold text-foreground">{outboundMovements}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Esta Semana</p>
                                <p className="text-2xl font-bold text-foreground">{recentMovements}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-lg border">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-foreground">Registro de Movimientos</h2>
                        <p className="text-sm text-muted-foreground mt-1">{totalMovements} movimientos registrados</p>
                    </div>

                    {data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="p-3 bg-muted rounded-full mb-4">
                                <Activity className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">No hay movimientos</h3>
                            <p className="text-muted-foreground text-center max-w-sm mb-4">
                                Aún no se han registrado movimientos de inventario. Crea tu primer movimiento para comenzar.
                            </p>
                            <button
                                onClick={() => navigate(location.pathname + "?createMovement=true")}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                <Package className="h-4 w-4" />
                                Crear Primer Movimiento
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="max-h-[600px] overflow-y-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 sticky top-0 z-10">
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Tipo
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Cantidad
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Doc Ref
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Producto
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Origen
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Destino
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Fecha
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {data.map((movement, index) => {
                                            const movementTypeLabel = MOVEMENT_TYPE_OPTIONS.find(
                                                (type) => type.value === movement.movementType,
                                            )?.label
                                            const isInbound = movementTypeLabel?.includes("Entrada") || movementTypeLabel?.includes("Ingreso")

                                            return (
                                                <tr
                                                    key={movement.id}
                                                    className={`hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                                        }`}
                                                >
                                                    <td className="px-4 py-3 text-sm font-medium text-foreground">#{movement.id}</td>

                                                    <td className="px-4 py-3 text-sm">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isInbound ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {isInbound ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                            {movementTypeLabel}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3 text-center">
                                                        <span
                                                            className={`inline-flex items-center font-semibold ${isInbound ? "text-green-600" : "text-red-600"
                                                                }`}
                                                        >
                                                            {isInbound ? "+" : "-"}
                                                            {Math.abs(movement.quantity)}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <FileText className="h-3 w-3" />
                                                            {movement.doc_ref || "N/A"}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3 text-sm font-medium text-foreground">{movement.product.name}</td>

                                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1 uppercase">
                                                            <MapPin className="h-3 w-3" />
                                                            {movement.locationOrigin?.name || "N/A"}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1 uppercase">
                                                            <MapPin className="h-3 w-3" />
                                                            {movement.locationDest?.name || "N/A"}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(movement.createdAt)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
}

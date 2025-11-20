"use client"

import { Trash, ArrowLeftRight, PackageCheck, CreditCard, Banknote, Receipt } from "lucide-react"
import { useStore } from "../../store"
import { formatCurrency } from "../../utils"
import { useEffect } from "react"
import { toast } from "react-toastify"

const CashIcon = () => <Banknote className="h-5 w-5" />

const CardIcon = () => <CreditCard className="h-5 w-5" />

export default function OrderSummary() {
    const {
        paymentMethod,
        setPaymentMethod,
        contents,
        deleteItemToCart,
        createOrder,
        clearOrder,
        subTotal,
        total,
        success,
        error,
    } = useStore()

    let taxes = 0

    const handleDeleteItemFromCart = (index: number) => {
        deleteItemToCart(index)
    }

    taxes = subTotal * taxes

    useEffect(() => {
        if (success) {
            toast.success(success)
            clearOrder()
        }
        if (error) {
            toast.error(error)
            clearOrder()
        }
    }, [success, error, contents])

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm h-full flex flex-col">
            {/* Header mejorado */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Receipt className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Resumen de Orden</h2>
                        <p className="text-sm text-muted-foreground">Revisa los artículos y confirma la compra</p>
                    </div>
                </div>
            </div>

            {/* Lista de artículos con scroll */}
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="space-y-3">
                    {contents.length ? (
                        contents.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-start bg-muted/30 rounded-lg p-4 border border-border/50"
                            >
                                <div className="flex-1 min-w-0">
                                    <span className="font-semibold text-foreground block truncate">{item.product.name}</span>
                                    <span className="text-muted-foreground text-sm">
                                        {item.quantity} × {formatCurrency(item.unitPrice.toString())}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 ml-3">
                                    <span className="font-bold text-foreground">
                                        {formatCurrency((item.quantity * item.unitPrice).toString())}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteItemFromCart(index)}
                                        className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200"
                                        aria-label="Eliminar item"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto mb-4">
                                <PackageCheck className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">El carrito está vacío</p>
                            <p className="text-xs text-muted-foreground mt-1">Agrega productos para comenzar</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sección de totales mejorada */}
            <div className="p-6 bg-muted/20 border-t border-border">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="font-medium text-foreground">{formatCurrency(subTotal.toString())}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Impuestos</span>
                        <span className="font-medium text-foreground">{formatCurrency(taxes.toString())}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-foreground border-t border-border pt-3">
                        <span>Total</span>
                        <span>{formatCurrency(total.toString())}</span>
                    </div>
                </div>
            </div>

            {/* Métodos de pago mejorados */}
            <div className="p-6 border-t border-border">
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Método de Pago</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            className={`flex flex-col items-center justify-center py-3 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${paymentMethod === "CASH"
                                    ? "ring-2 ring-primary bg-primary/10 text-primary"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground focus:ring-2 focus:ring-ring"
                                }`}
                            onClick={() => setPaymentMethod("CASH")}
                        >
                            <CashIcon />
                            <span className="mt-2">Efectivo</span>
                        </button>
                        <button
                            className={`flex flex-col items-center justify-center py-3 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${paymentMethod === "CARD"
                                    ? "ring-2 ring-primary bg-primary/10 text-primary"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground focus:ring-2 focus:ring-ring"
                                }`}
                            onClick={() => setPaymentMethod("CARD")}
                        >
                            <CardIcon />
                            <span className="mt-2">Tarjeta</span>
                        </button>
                        <button
                            className={`flex flex-col items-center justify-center py-3 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${paymentMethod === "TRANSFER"
                                    ? "ring-2 ring-primary bg-primary/10 text-primary"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground focus:ring-2 focus:ring-ring"
                                }`}
                            onClick={() => setPaymentMethod("TRANSFER")}
                        >
                            <ArrowLeftRight className="w-5 h-5" />
                            <span className="mt-2">Transfer</span>
                        </button>
                    </div>
                </div>

                {/* Botón de confirmar compra mejorado */}
                <button
                    className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${contents.length === 0
                            ? "text-muted-foreground bg-muted cursor-not-allowed"
                            : "text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring shadow-sm hover:shadow-md"
                        }`}
                    disabled={contents.length === 0}
                    onClick={() => createOrder()}
                >
                    <PackageCheck className="w-5 h-5" />
                    <span>Confirmar Compra</span>
                </button>
            </div>
        </div>
    )
}

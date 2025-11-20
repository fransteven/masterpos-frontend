
import { z } from "zod";

export const ProductSchema = z.object({
    id: z.int(),
    name: z.string(),
    description: z.string(),
    brand: z.string(),
    unit_cost: z.coerce.number(),
    sale_price: z.coerce.number(),
    warranty_period_days: z.coerce.number(),
    category_id: z.int(),
    category: z.object({
        id: z.int(),
        name: z.string()
    })
})
export const ProductsSchema = z.array(ProductSchema)

export type Product = z.infer<typeof ProductSchema>
export type ProductForm = Pick<Product, 'name' | 'description' | 'brand' | 'unit_cost' | 'sale_price' | 'warranty_period_days' | 'category_id'>

export const CategorySchema = z.object({
    id: z.int(),
    name: z.string(),
})

export const CategoriesSchema = z.array(CategorySchema)

export type Category = z.infer<typeof CategorySchema>
export type CategoryForm = Pick<Category, 'name'>


export const LocationSchema = z.object({
    id: z.int(),
    name: z.string(),
})

export const LocationsSchema = z.array(LocationSchema)

export type Location = z.infer<typeof LocationSchema>
export type LocationForm = Pick<Location, 'name'>


export const movementTypeSchema = z.enum([
    "IN_PURCHASE",
    "IN_RETURN",
    "IN_ADJUSTMENT",
    "TRANSFER",
    "OUT_SALE",
    "OUT_ADJUSTMENT",
    "OUT_WARRANTY_REPAIR",
    "OUT_DISPOSAL",
] as const);

/** TypeScript type inferred from the Zod schema */
export type MovementType = z.infer<typeof movementTypeSchema>;

export const StockSchema = z.object({
    id: z.int(),
    quantity: z.int(),
    product: z.object({
        id: z.int(),
        name: z.string(),
        sale_price: z.coerce.number()
    }),
    location: z.object({
        id:z.number().int(),
        name: z.string()
    }),
})
export const StocksSchema = z.array(StockSchema)

export type Stock = z.infer<typeof StockSchema>


/**Types for movements */

export const MovementSchema = z.object({
    id: z.number().int(),
    movementType: z.string(),
    quantity: z.number().int(),
    doc_ref: z.number().int(),
    product: z.object({
        name: z.string()
    }),
    locationOrigin: z.object({
        name: z.string()
    }).nullable(),
    locationDest: z.object({
        name: z.string()
    }).nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export const MovementsSchema = z.array(MovementSchema)

export const MovementFormSchema = z.object({
    movementType: z.string().min(1, "Tipo de movimiento es requerido"),
    quantity: z.number().int().positive("La cantidad debe ser un número positivo"),
    doc_ref: z.number().int().positive("La referencia del documento es requerida"),
    product_id: z.number().int().positive("El ID del producto es requerido"),
    location_origin_id: z.number().int().positive().nullable().optional(),
    location_dest_id: z.number().int().positive().nullable().optional(),
});

export type Movement = z.infer<typeof MovementSchema>
export type MovementForm = z.infer<typeof MovementFormSchema>;

// Opciones para tipos de movimiento
export const MOVEMENT_TYPE_OPTIONS = [
    { value: "IN_PURCHASE", label: "Entrada por Compra" },
    { value: "IN_RETURN", label: "Entrada por Devolución" },
    { value: "IN_ADJUSTMENT", label: "Ajuste Positivo" },
    { value: "TRANSFER", label: "Transferencia" },
    { value: "OUT_SALE", label: "Salida por Venta" },
    { value: "OUT_ADJUSTMENT", label: "Ajuste Negativo" },
    { value: "OUT_WARRANTY_REPAIR", label: "Garantía/Reparación" },
    { value: "OUT_DISPOSAL", label: "Desecho" },
];


export type ProductInput = {
    id: number;
    code: string;
    name: string;
    price: number;
    taxRate?: number;
};

export type CartItem = {
    productId: number;
    code: string;
    name: string;
    unitPrice: number;
    quantity: number;
    taxRate: number;
    lineTotal: number;
};

export type OrderPayload = {
    items: CartItem[];
    subtotal: number;
    taxes: number;
    total: number;
    paymentMethod: 'cash' | 'card' | 'other';
};

export const PaymentMethodSchema = z.enum(['CASH' , 'CARD' , 'TRANSFER','CREDIT'])

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>



/*Types for Sales module */
export const OrderSchema = z.object({
    paymentMethod: z.string(),
    items: z.array(
        z.object({
            productId: z.number().int(),
            locationId: z.number().int(),
            quantity: z.number().int(),
            unitPrice: z.number().int(),
        })
    )
})

export const OrdersSchema = z.array(OrderSchema)

export type SaleSchema = z.infer<typeof OrderSchema>

/**Shopping cart */
export const ShoppingCartContentsSchema = z.object({
    product: z.object({
        id:z.number().int(),
        name:z.string(),
    }),
    location:z.object({
        id:z.number().int(),
        name:z.string(),
    }),
    quantity: z.number().int(),
    unitPrice: z.number().int(),
})

export const ShoppingCartSchema = z.array(ShoppingCartContentsSchema)

export type ShoppingCartItem = z.infer<typeof ShoppingCartContentsSchema>
export type ShoppingCartContent = z.infer<typeof ShoppingCartSchema>

export const OrderApiSchema = z.object({
    paymentMethod:z.enum(['CASH' , 'CARD' , 'TRANSFER','CREDIT']),
    items:z.array(z.object({
        productId:z.number().int(),
        locationId:z.number().int(),
        quantity:z.number().int(),
        unitPrice:z.number().int()
    }))
})

export const OrdersApiSchema = z.array(OrderApiSchema)

export type OrderApi = z.infer<typeof OrderApiSchema>


export const ErrorResponseSchema = z.object({
    error:z.string()
})

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

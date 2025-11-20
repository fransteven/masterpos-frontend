import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircleX } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, editProduct } from '../../api/ProductApi';
import { toast } from 'react-toastify';
import type { Product, ProductForm } from '../../types';
import ErrorMessage from '../ErrorMessage';


export default function ProductEditModal({ products }: { products: Product[] }) {

    const location = useLocation()
    const navigate = useNavigate()
    const client = useQueryClient()
    

    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('editProduct')!
    const show = productId ? true : false


    const product = useMemo(() => {
        if (!productId) return null;
        return products.find(p => p.id === +productId) || null;
    }, [productId, products]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductForm>();

    //Se asigna el estado previo del producto a editar al formulario
    //para mejor experiencia de usuario
    useEffect(() => {
        if (product) {
            reset({
                ...product
            });
        }
    }, [product, reset]);

    //Se cierra el modal si el producto no existe
    useEffect(() => {
        if (show && productId && products.length > 0 && !product) {
            toast.error('Producto no encontrado');
            closeModal();
        }
    }, [show, productId, products, product]);


    const { mutate } = useMutation({

        mutationFn: editProduct,
        onError: (errors) => {
            toast.error(errors.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            client.invalidateQueries({queryKey:['products']})
            closeModal
        },
    })

    function closeModal() {
        reset()
        
        navigate(location.pathname)
    }

    const onSubmit = (formData: ProductForm) => {
        const data = {
            formData,
            productId: Number(productId)
        }
        mutate(data)
        closeModal()
    };

    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className='relative'>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Edita un Producto
                                        </Dialog.Title>
                                        <Dialog.Description className="mt-1 text-sm text-gray-500 mb-4">
                                            Modifica los siguientes campos para editar tu producto.
                                        </Dialog.Description>

                                        <CircleX
                                            className='absolute top-0 right-0 w-6 h-6 cursor-pointer'
                                            onClick={closeModal} />
                                    </div>

                                    {/* Formulario */}
                                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Name */}
                                            <div className="md:col-span-2">
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                                                    {...register('name', { required: 'El nombre es obligatorio' })}
                                                />
                                                {
                                                    errors.name && (
                                                        <ErrorMessage>{errors.name.message}</ErrorMessage>
                                                    )
                                                }

                                            </div>

                                            {/* Description */}
                                            <div className="md:col-span-2">
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                                                <textarea
                                                    id="description"
                                                    rows={3}
                                                    {...register('description', { required: 'La descripción es obligatoria' })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                                                />
                                                {
                                                    errors.description && (
                                                        <ErrorMessage>{errors.description.message}</ErrorMessage>
                                                    )
                                                }
                                            </div>

                                            {/* Brand */}
                                            <div>
                                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
                                                <input
                                                    type="text"
                                                    id="brand"
                                                    {...register('brand', { required: 'La marca es obligatoria' })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${errors.brand ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                                                />
                                                {
                                                    errors.brand && (
                                                        <ErrorMessage>{errors.brand.message}</ErrorMessage>
                                                    )
                                                }
                                            </div>

                                            {/* Category ID */}
                                            <div>
                                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">ID de Categoría</label>
                                                <input
                                                    type="text"
                                                    id="category_id"
                                                    {...register('category_id', { required: 'El ID de categoría es obligatorio' })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${errors.category_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                                                />
                                                {
                                                    errors.category_id && (
                                                        <ErrorMessage>{errors.category_id.message}</ErrorMessage>
                                                    )
                                                }
                                            </div>

                                            {/* Cost Price */}
                                            <div>
                                                <label htmlFor="unit_cost" className="block text-sm font-medium text-gray-700">Costo unitario ($)</label>
                                                <input
                                                    type="number"
                                                    id="unit_cost"
                                                    step="0.01"
                                                    {...register('unit_cost', {
                                                        required: 'El precio de costo es obligatorio',
                                                        valueAsNumber: true,
                                                        min: { value: 0.01, message: 'El costo debe ser mayor a 0' }
                                                    })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${errors.unit_cost ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                                                />
                                                {
                                                    errors.unit_cost && (
                                                        <ErrorMessage>{errors.unit_cost.message}</ErrorMessage>
                                                    )
                                                }
                                            </div>

                                            {/* Retail Price */}
                                            <div>
                                                <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700">Precio de Venta ($)</label>
                                                <input
                                                    type="number"
                                                    id="sale_price"
                                                    step="0.01"
                                                    {...register('sale_price', {
                                                        required: 'El precio de venta es obligatorio',
                                                        valueAsNumber: true,
                                                        min: { value: 0.01, message: 'El precio de venta debe ser mayor a 0' }
                                                    })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${errors.sale_price ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                                                />
                                                {
                                                    errors.sale_price && (
                                                        <ErrorMessage>{errors.sale_price.message}</ErrorMessage>
                                                    )
                                                }
                                            </div>


                                            {/* Warranty */}
                                            <div>
                                                <label htmlFor="warranty_period_days" className="block text-sm font-medium text-gray-700">Garantía (días)</label>
                                                <input
                                                    type="number"
                                                    id="warranty_period_days"
                                                    {...register('warranty_period_days', {
                                                        required: 'El periodo de garantía es obligatorio',
                                                        valueAsNumber: true,
                                                        min: { value: 0, message: 'La garantía no puede ser negativa' }
                                                    })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${errors.warranty_period_days ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}

                                                />
                                                {
                                                    errors.warranty_period_days && (
                                                        <ErrorMessage>{errors.warranty_period_days.message}</ErrorMessage>
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={closeModal}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                Actualizar Producto
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
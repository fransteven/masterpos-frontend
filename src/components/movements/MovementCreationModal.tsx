import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircleX, ArrowRightLeft, Save } from 'lucide-react';
import ErrorMessage from '../ErrorMessage'; // Asegúrate de tener este componente
import { MOVEMENT_TYPE_OPTIONS, type MovementForm } from '../../types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createMovement } from '../../api/Movements';



export default function MovementCreationModal() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient()

    const queryParams = new URLSearchParams(location.search);
    const queryParam = queryParams.get('createMovement');
    const show = queryParam ? true : false;

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<MovementForm>();

    const movementType = watch("movementType");

    // Determinar qué campos mostrar basado en el tipo de movimiento
    const showOrigin = movementType?.startsWith("OUT_") || movementType === "TRANSFER";
    const showDestination = movementType?.startsWith("IN_") || movementType === "TRANSFER";

    const {mutate} = useMutation({
        mutationFn:createMovement,
        onError: (errors)=>{
            toast.error(errors.message)
        },
        onSuccess: (data)=>{
            toast.success(data)
            queryClient.invalidateQueries({queryKey:['movements']})
            closeModal();
        },
    })

    function closeModal() {
        reset();
        navigate(location.pathname);
    }

    const onSubmit = (formData: MovementForm) => {
        const data = {
            ...formData,
            product_id: +formData.product_id!,
            location_origin_id: formData.location_origin_id ? +formData.location_origin_id : undefined,
            location_dest_id: formData.location_dest_id ? +formData.location_dest_id : undefined,
            quantity: +formData.quantity!,
        }
        console.log(data)
        mutate(data)
        closeModal();
    };

    return (
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Registrar Nuevo Movimiento
                                        </Dialog.Title>
                                    </div>
                                    <Dialog.Description className="mt-1 text-sm text-gray-500 mb-4">
                                        Completa todos los campos para registrar un nuevo movimiento de inventario
                                    </Dialog.Description>

                                    <CircleX
                                        className="absolute top-0 right-0 w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-700"
                                        onClick={closeModal}
                                    />
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Campo: Tipo de Movimiento */}
                                    <div className="space-y-1">
                                        <label htmlFor="movementType" className="block text-sm font-medium text-gray-700">
                                            Tipo de Movimiento
                                        </label>
                                        <select
                                            id="movementType"
                                            {...register("movementType", { required: "Este campo es obligatorio" })}
                                            className={`mt-1 block w-full rounded-md border ${errors.movementType ? 'border-red-500' : 'border-gray-300'
                                                } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        >
                                            <option value="">Seleccionar tipo</option>
                                            {MOVEMENT_TYPE_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.movementType && (
                                            <ErrorMessage>{errors.movementType.message}</ErrorMessage>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Campo: ID del Producto */}
                                        <div className="space-y-1">
                                            <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">
                                                ID del Producto
                                            </label>
                                            <input
                                                id="product_id"
                                                type="number"
                                                placeholder="Ej: 101"
                                                {...register("product_id", {
                                                    required: "Este campo es obligatorio",
                                                    min: { value: 1, message: "ID inválido" },
                                                })}
                                                className={`mt-1 block w-full rounded-md border ${errors.product_id ? 'border-red-500' : 'border-gray-300'
                                                    } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                            />
                                            {errors.product_id && (
                                                <ErrorMessage>{errors.product_id.message}</ErrorMessage>
                                            )}
                                        </div>

                                        {/* Campo: Cantidad */}
                                        <div className="space-y-1">
                                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                                Cantidad
                                            </label>
                                            <input
                                                id="quantity"
                                                type="number"
                                                placeholder="Ej: 50"
                                                {...register("quantity", {
                                                    required: "Este campo es obligatorio",
                                                    min: { value: 1, message: "Mínimo 1 unidad" },
                                                })}
                                                className={`mt-1 block w-full rounded-md border ${errors.quantity ? 'border-red-500' : 'border-gray-300'
                                                    } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                            />
                                            {errors.quantity && (
                                                <ErrorMessage>{errors.quantity.message}</ErrorMessage>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Campo: Ubicación Origen (condicional) */}
                                        {showOrigin && (
                                            <div className="space-y-1">
                                                <label htmlFor="location_origin_id" className="block text-sm font-medium text-gray-700">
                                                    Ubicación de Origen
                                                </label>
                                                <input
                                                    id="location_origin_id"
                                                    type="number"
                                                    placeholder="ID de la bodega de salida"
                                                    {...register("location_origin_id", {
                                                        required: showOrigin ? "Este campo es obligatorio" : false,
                                                        min: { value: 1, message: "ID inválido" },
                                                    })}
                                                    className={`mt-1 block w-full rounded-md border ${errors.location_origin_id ? 'border-red-500' : 'border-gray-300'
                                                        } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                                />
                                                {errors.location_origin_id && (
                                                    <ErrorMessage>{errors.location_origin_id.message}</ErrorMessage>
                                                )}
                                            </div>
                                        )}

                                        {/* Campo: Ubicación Destino (condicional) */}
                                        {showDestination && (
                                            <div className="space-y-1">
                                                <label htmlFor="location_dest_id" className="block text-sm font-medium text-gray-700">
                                                    Ubicación de Destino
                                                </label>
                                                <input
                                                    id="location_dest_id"
                                                    type="number"
                                                    placeholder="ID de la bodega de entrada"
                                                    {...register("location_dest_id", {
                                                        required: showDestination ? "Este campo es obligatorio" : false,
                                                        min: { value: 1, message: "ID inválido" },
                                                    })}
                                                    className={`mt-1 block w-full rounded-md border ${errors.location_dest_id ? 'border-red-500' : 'border-gray-300'
                                                        } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                                />
                                                {errors.location_dest_id && (
                                                    <ErrorMessage>{errors.location_dest_id.message}</ErrorMessage>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Campo: Referencia de Documento */}
                                    <div className="space-y-1">
                                        <label htmlFor="doc_ref" className="block text-sm font-medium text-gray-700">
                                            Referencia de Documento
                                        </label>
                                        <input
                                            id="doc_ref"
                                            type="text"
                                            placeholder="Ej: Factura #12345"
                                            {...register("doc_ref", { required: "Este campo es obligatorio" })}
                                            className={`mt-1 block w-full rounded-md border ${errors.doc_ref ? 'border-red-500' : 'border-gray-300'
                                                } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        />
                                        {errors.doc_ref && (
                                            <ErrorMessage>{errors.doc_ref.message}</ErrorMessage>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Guardar Movimiento
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
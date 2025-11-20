//MODAL GENÉRICO PARA ELIMINAR REGISTROS

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Trash2Icon, XIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Define las props que el componente recibirá
interface GenericDeleteModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    itemToDelete: T | null;
    mutationFn: (item: T) => Promise<any>;
    queryKeyToInvalidate: string[];
    title: string;
    message: string | React.ReactNode;
}

export default function GenericDeleteModal<T>({
    isOpen,
    onClose,
    itemToDelete,
    mutationFn,
    queryKeyToInvalidate,
    title,
    message,
}: GenericDeleteModalProps<T>) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn, // 1. Usamos la función de mutación genérica
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            // 2. Invalidamos la queryKey genérica
            queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
            toast.success(data.message || 'Elemento eliminado con éxito'); // Asumimos una respuesta con un mensaje
            onClose(); // 3. Usamos la función onClose para cerrar el modal
        },
    });

    const handleDelete = () => {
        if (itemToDelete) {
            mutate(itemToDelete);
        }
    };

    return (
        <Transition appear show={isOpen} as={React.Fragment}> {/* 4. Controlado por la prop isOpen */}
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                <div className="min-h-screen px-4 text-center">
                    {/* ... El resto del JSX para el fondo (overlay) es el mismo ... */}
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
                    </Transition.Child>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>

                    {/* Contenido del Modal */}
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <div className="flex justify-between items-center">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    {title} {/* 5. Título dinámico */}
                                </Dialog.Title>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                    <XIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-red-100 p-3 rounded-full">
                                        <Trash2Icon className="h-8 w-8 text-red-600" />
                                    </div>
                                </div>

                                <p className="text-center text-gray-700 mb-2">
                                    {message} {/* 6. Mensaje dinámico */}
                                </p>

                                <div className="mt-6 flex justify-center space-x-4">
                                    <button type="button" onClick={onClose} disabled={isPending} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple disabled:opacity-50">
                                        Cancelar
                                    </button>
                                    <button type="button" onClick={handleDelete} disabled={isPending} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
                                        {isPending ? 'Eliminando...' : 'Eliminar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
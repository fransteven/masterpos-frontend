import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircleX } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { Category, CategoryForm, ProductForm } from '../../types';
import ErrorMessage from '../ErrorMessage';
import { editCategory } from '../../api/CategoryApi';


export default function CategoryEditModal({ categories }: { categories: Category[] }) {

    const location = useLocation()
    const navigate = useNavigate()
    const client = useQueryClient()
    

    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('editCategory')!
    const show = categoryId ? true : false

    const category = useMemo(() => {
        if (!categoryId) return null;
        return categories.find(p => p.id === +categoryId) || null;
    }, [categoryId, categories]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductForm>();

    //Se asigna el estado previo del producto a editar al formulario
    //para mejor experiencia de usuario
    useEffect(() => {
        if (category) {
            reset({
                ...category
            });
        }
    }, [category, reset]);

    //Se cierra el modal si el producto no existe
    useEffect(() => {
        if (show && categoryId && categories.length > 0 && !category) {
            toast.error('Categoría no encontrada');
            closeModal();
        }
    }, [show, categoryId, categories, category]);


    const { mutate } = useMutation({

        mutationFn: editCategory,
        onError: (errors) => {
            toast.error(errors.message)
        },
        onSuccess: (data) => {
            toast.success(data.message)
            client.invalidateQueries({queryKey:['categories']})
            closeModal()
        },
    })

    function closeModal() {
        reset()
        
        navigate(location.pathname)
    }

    const onSubmit = (formData: CategoryForm) => {
        const data = {
            formData,
            categoryId: Number(categoryId)
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
                                            Edita una Categoría
                                        </Dialog.Title>
                                        <Dialog.Description className="mt-1 text-sm text-gray-500 mb-4">
                                            Modifica los siguientes campos para editar la categoría.
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
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de la Categoría</label>
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
                                                Actualizar Categoría
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
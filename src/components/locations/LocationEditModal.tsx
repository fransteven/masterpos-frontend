import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircleX } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { Location, LocationForm } from '../../types';
import ErrorMessage from '../ErrorMessage';
import { editLocation } from '../../api/Locations';


export default function LocationEditModal({ locations }: { locations: Location[] }) {

    const location = useLocation()
    const navigate = useNavigate()
    const client = useQueryClient()
    

    const queryParams = new URLSearchParams(location.search);
    const locationId = queryParams.get('editLocation')!
    const show = locationId ? true : false

    const ubiety = useMemo(() => {
        if (!locationId) return null;
        return locations.find(p => p.id === +locationId) || null;
    }, [locationId, locations]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LocationForm>();

    //Se asigna el estado previo del producto a editar al formulario
    //para mejor experiencia de usuario
    useEffect(() => {
        if (ubiety) {
            reset({
                ...ubiety
            });
        }
    }, [ubiety, reset]);

    //Se cierra el modal si la locación no existe
    useEffect(() => {
        if (show && locationId && locations.length > 0 && !ubiety) {
            toast.error('Categoría no encontrada');
            closeModal();
        }
    }, [show, locationId, locations, ubiety]);


    const { mutate } = useMutation({

        mutationFn: editLocation,
        onError: (errors) => {
            toast.error(errors.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            client.invalidateQueries({queryKey:['locations']})
            closeModal()
        },
    })

    function closeModal() {
        reset()
        
        navigate(location.pathname)
    }

    const onSubmit = (formData: LocationForm) => {
        const data = {
            formData,
            locationId: Number(locationId)
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
                                            Edita una Locación
                                        </Dialog.Title>
                                        <Dialog.Description className="mt-1 text-sm text-gray-500 mb-4">
                                            Modifica los siguientes campos para editar la locación.
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
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de la Locación</label>
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
                                                Actualizar Locación
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
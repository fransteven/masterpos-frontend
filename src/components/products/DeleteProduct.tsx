import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteProduct } from "../../api/ProductApi";
import { toast } from "react-toastify";
import GenericDeleteModal from "../GenericDeleteModal";


export default function DeleteProduct() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('deleteProduct')

    const show = productId ? true : false

    const { mutate, isPending } = useMutation({
        mutationFn: deleteProduct,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(data);
            closeModal();
        },
    });

    const closeModal = () => {
        navigate(location.pathname, { replace: true });
    };

    const handleDelete = () => {
        if (productId) {
            mutate(+productId)
        }
    };
    return (
        <GenericDeleteModal
            isOpen={show}
            onClose={closeModal}
            itemToDelete={+productId!}
            message={'¿Estás seguro de que deseas eliminar el producto?'}
            mutationFn={deleteProduct}
            queryKeyToInvalidate={['products']}
            title="Eliminar producto"

        />
    )
}

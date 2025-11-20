import { useLocation, useNavigate } from "react-router-dom";
import GenericDeleteModal from "../GenericDeleteModal";
import { deleteCategory } from "../../api/CategoryApi";


export default function DeleteCategory() {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('deleteCategory')

    const show = categoryId ? true : false

    const closeModal = () => {
        navigate(location.pathname, { replace: true });
    };

    return (
        <GenericDeleteModal
            isOpen={show}
            onClose={closeModal}
            itemToDelete={+categoryId!}
            message={'¿Estás seguro de que deseas eliminar la categoría?'}
            mutationFn={deleteCategory}
            queryKeyToInvalidate={['categories']}
            title="Eliminar categoría"

        />
    )
}

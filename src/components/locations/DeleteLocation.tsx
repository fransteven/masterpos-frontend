import { useLocation, useNavigate } from "react-router-dom";
import GenericDeleteModal from "../GenericDeleteModal";
import { deleteLocation } from "../../api/Locations";


export default function DeleteLocation() {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const locationId = queryParams.get('deleteLocation')

    const show = locationId ? true : false

    const closeModal = () => {
        navigate(location.pathname, { replace: true });
    };

    return (
        <GenericDeleteModal
            isOpen={show}
            onClose={closeModal}
            itemToDelete={+locationId!}
            message={'¿Estás seguro de que deseas eliminar la locación?'}
            mutationFn={deleteLocation}
            queryKeyToInvalidate={['locations']}
            title="Eliminar locación"
        />
    )
}

import React from 'react';
import { GrClose } from 'react-icons/gr';
import MoviesService from '../../services/MoviesService';
import { useLocation, useNavigate } from 'react-router';


const DeleteButton = ({ id, title }) => {
    let navigate = useNavigate();
    const location = useLocation();

    // delete card
    function onClickDelete() {
        if (window.confirm(`Voulez-vous vraiment supprimer ${title} ?`)) {
            MoviesService.remove(id)
            .then((response) => {
                let message = 'Le film a bien été supprimé !';

                if (response === "error") {
                    message = "Oops, une erreur s'est produite…"
                }

                window.alert(message);

                if (location.pathname === '/') {
                    window.location.reload();
                }
                
                else {
                    navigate('/');
                }
            })
        }
    }

    return (
        <button
            onClick={onClickDelete}
            className="button">
            <GrClose /> Supprimer
        </button>
    );
};

export default DeleteButton;
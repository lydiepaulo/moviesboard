import React from 'react';
import { GrClose } from 'react-icons/gr';

const DeleteButton = () => {
    return (
        <button className="delete-button">
            <GrClose /> Supprimer
        </button>
    );
};

export default DeleteButton;
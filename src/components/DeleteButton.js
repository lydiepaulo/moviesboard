import React from 'react';
import { GrClose } from 'react-icons/gr';

const DeleteButton = () => {
    return (
        <button className="delete-button">
            <GrClose /> <span className="title-small">Supprimer</span>
        </button>
    );
};

export default DeleteButton;
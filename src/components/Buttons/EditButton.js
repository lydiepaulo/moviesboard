import React from 'react';
import { Link } from 'react-router-dom';
import { MdMovieFilter } from 'react-icons/md';

const EditButton = ({ id }) => {
    return (
            <Link className="button" to={{ pathname: `/edit/${id}` }}>
                <MdMovieFilter /> Éditer
            </Link>
        
    );
};

export default EditButton;
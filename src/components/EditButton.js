import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserEdit } from "react-icons/fa";

const EditButton = (id) => {
    return (
            <Link to={{ pathname: `/edit/${id}` }}>
                <FaUserEdit />
            </Link>
        
    );
};

export default EditButton;
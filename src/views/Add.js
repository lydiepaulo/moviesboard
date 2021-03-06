import React, { useState } from 'react';
import Form from '../components/Form/Form';
import Navbar from '../components/Navbar/Navbar';
import MoviesService from '../services/MoviesService';

const Add = () => {
    const [errorMessage, setErrorMessage] = useState(null);

    function addMovie(data) {
        // Envoyer "data" vers le serveur POST /movies
        MoviesService.add(data)
        .catch((err) => setErrorMessage(err.message));
    }

    return (
        <div className="pages-background">
            <Navbar />

            <h1 className="title-large">
                <span>Ajouter un</span>
                <span>film</span>
            </h1>
            
            {errorMessage && <div className='error'>{errorMessage}</div>}
            <Form onValidation={addMovie} />
        </div>
    );
};

export default Add;
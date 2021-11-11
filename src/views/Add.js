import React, { useState } from 'react';
import Form from '../components/Form';
import Navbar from '../components/Navbar';
import MoviesService from '../services/MoviesService';

const Add = () => {
    const [errorMessage, setErrorMessage] = useState(null);


    function addMovie(data) {
        // Envoyer "data" vers le serveur POST /movies
        MoviesService.add(data)
            .catch((err) => setErrorMessage(err.message));
    }

    return (
        <div>
            <Navbar />

            <h1 className="title-large">Ajouter un film à la bibliothèque</h1>
            
            {errorMessage && <div className='error'>{errorMessage}</div>}
            <Form onValidation={addMovie} />
        </div>
    );
};

export default Add;
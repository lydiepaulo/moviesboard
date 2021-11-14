import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Form from '../components/Form/Form';
import Navbar from '../components/Navbar/Navbar';
import MoviesService from '../services/MoviesService';

const Home = () => {
    const { id } = useParams();
    const [dataMovie, setDataMovie] = useState();
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        MoviesService.fetchMovies(id).then((apiResult) => setDataMovie(apiResult));
    }, [id]);

    function updateMovie(updatedMovie) {
        MoviesService.update(updatedMovie, id)
            .catch((err) => setErrorMessage(err.message));
    }



    return (
        <div className="pages-background">
            <Navbar />

            <div>
            {errorMessage && <div className='error'>{errorMessage}</div>}
            {dataMovie &&
                <Form onValidation={updateMovie} movie={dataMovie} />
            }
            </div>
        </div>
    );
};

export default Home;
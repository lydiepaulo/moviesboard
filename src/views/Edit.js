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
            {errorMessage && <div className='error'>{errorMessage}</div>}
            {dataMovie &&
                <div className="edit-main">
                    <h1 className="title-large">
                        <span>« {dataMovie.title} »</span>
                        <span>Modifier</span>
                    </h1>

                    <Form onValidation={updateMovie} movie={dataMovie} />
                </div>
            }
        </div >
    );
};

export default Home;
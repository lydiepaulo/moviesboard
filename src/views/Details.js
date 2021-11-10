import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import EditButton from '../components/EditButton';
import MoviesService from '../services/MoviesService';
import DeleteButton from '../components/DeleteButton';
import { useParams } from 'react-router';

const Home = () => {
    const { id } = useParams();

    const [cardData, setCardData] = useState(null);

    useEffect(() => {
        if (id) {
            MoviesService.fetchMovies(id)
                .then((apiResult) => {
                    setCardData(apiResult);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Navbar />
            {cardData && 
                <div>
                    <h1 className="title-large">{cardData.title}</h1>
                    {cardData.release_date}
                    {cardData.categories}
                    <img src={cardData.poster} alt="Couverture" />
                    <img src={cardData.backdrop} alt="Couverture" />

                    {/* actors */}
                    {cardData.actors.map((actors, id) => (
                            <span key={id}>{actors.name}</span>
                        ))
                    }

                    {/* similar movies */}
                    {cardData.similar_movies.map((movie, id) => (
                            <span key={id}>{movie.title}</span>
                        ))
                    }

                    <EditButton key={id} id={id} />
                    
                    <DeleteButton />
                </div>
            }
        </div>
    );
};

export default Home;
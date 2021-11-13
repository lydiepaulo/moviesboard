import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import EditButton from '../../components/Buttons/EditButton';
import MoviesService from '../../services/MoviesService';
import DeleteButton from '../../components/Buttons/DeleteButton';
import { useParams } from 'react-router';

const Home = () => {
    const { id } = useParams();

    const [cardData, setCardData] = useState(null);

    useEffect(() => {
        if (id) {
            MoviesService.fetchMovies(id)
                .then((apiResult) => {
                    setCardData(apiResult);
                    console.log('====================================');
                    console.log(apiResult);
                    console.log('====================================');
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="details pages-background">
            <Navbar />
            {cardData && 
                <div>
                    <div class="details-main">
                        <h1 className="title-large">{cardData.title}</h1>
                        {cardData.backdrop}
                        {cardData.release_date}
                        {cardData.categories}
                        <img src={cardData.poster} alt="Couverture" />

                        {/* actors */}
                        {cardData.actors.map((actors, id) => (
                                <div className="details-main__actor">
                                    <img src={actors.photo} alt={actors.name} />
                                    <span key={id}>{actors.name}</span>
                                    <span key={id}>{actors.character}</span>
                                </div>
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
                </div>
            }
        </div>
    );
};

export default Home;
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
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
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="details pages-background">
            {cardData &&
                <div className="details-bg" style={{ backgroundImage: `url(${cardData.backdrop})` }}>
                    <Navbar />
                    <div class="details-main">
                        <h1 className="title-large">{cardData.title}</h1>

                        <div className="details__swiper">
                            <div className="details__swiper--bg2" style={{ backgroundImage: `url(${cardData.backdrop})` }}></div>
                            <div className="details__swiper--container">
                                {/* TAB 1: informations */}
                                <div>
                                    <img src={cardData.poster} alt="Couverture" />
                                    {cardData.release_date}
                                    {cardData.categories}



                                    <EditButton key={id} id={id} />

                                    <DeleteButton />
                                </div>

                                {/* TAB 2: actors */}
                                <div>
                                    {cardData.actors.map((actors, id) => (
                                        <div className="details-main__actor">
                                            <img src={actors.photo} alt={actors.name} />
                                            <span key={id}>{actors.name}</span>
                                            <span key={id}>{actors.character}</span>
                                        </div>
                                    ))
                                    }
                                </div>
                                
                                {/* TAB 3: similar movies */}
                                <div>
                                    {cardData.similar_movies.map((movie, id) => (
                                        <span key={id}>{movie.title}</span>
                                    ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Home;
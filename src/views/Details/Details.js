import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import EditButton from '../../components/Buttons/EditButton';
import MoviesService from '../../services/MoviesService';
import DeleteButton from '../../components/Buttons/DeleteButton';
import { useParams } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import SwiperCore, { Autoplay } from 'swiper'
import { Navigation, Pagination } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/modules/navigation/navigation.scss';
import 'swiper/modules/pagination/pagination.scss';

const Home = () => {
    const { id } = useParams();
    SwiperCore.use([Autoplay]);

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
                            <Swiper
                                className="details__swiper--content"
                                modules={[Navigation, Pagination]}
                                centeredSlides= {true}
                                pagination={{
                                    "clickable": true
                                }}
                                navigation={true}
                                /* autoplay={{
                                    delay: 2000,
                                    disableOnInteraction: false,
                                    }} */
                                slidesPerView={1}
                                onSlideChange={() => console.log('slide change')}
                                onSwiper={(swiper) => console.log(swiper)}
                            >
                                {/* TAB 1: informations */}
                                <SwiperSlide>
                                    <img src={cardData.poster} alt="Couverture" />
                                    {cardData.release_date}
                                    {cardData.categories}

                                    <EditButton key={id} id={id} />

                                    <DeleteButton id={cardData.id} title={cardData.title} />
                                </SwiperSlide>

                                {/* TAB 2: actors */}
                                <SwiperSlide>
                                    {cardData.actors.map((actors, id) => (
                                        <div className="details-main__actor">
                                            <img src={actors.photo} alt={actors.name} />
                                            <span key={id}>{actors.name}</span>
                                            <span key={id}>{actors.character}</span>
                                        </div>
                                    ))
                                    }
                                </SwiperSlide>

                                {/* TAB 3: similar movies */}
                                <SwiperSlide>
                                    {cardData.similar_movies.map((movie, id) => (
                                        <span key={id}>{movie.title}</span>
                                    ))
                                    }
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Home;
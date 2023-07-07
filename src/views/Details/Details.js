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
import GlobalFunctions from '../../services/GlobalFunctions';

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
        <div>
            {cardData &&
                <div className="details pages-background">
                    <div className="details-bg" style={{ backgroundImage: `url(${cardData.backdrop})` }}></div>
                    <div className="details-structure">
                        <Navbar />
                        <div className="details-main">
                            <h1 className="title-large">{cardData.title}</h1>

                            <div className="details-buttons">
                                <EditButton key={id} id={id} />
                                <DeleteButton id={cardData.id} title={cardData.title} />
                            </div>

                            <div className="details__swiper">
                                <div className="details__swiper--bg2" style={{ backgroundImage: `url(${cardData.backdrop})` }}></div>
                                <Swiper
                                    className="details__swiper--content"
                                    modules={[Navigation, Pagination]}
                                    centeredSlides={true}
                                    pagination={{
                                        "clickable": true
                                    }}
                                    navigation={true}
                                    /* autoplay={{
                                        delay: 2000,
                                        disableOnInteraction: false,
                                        }} */
                                    slidesPerView={1}
                                >
                                    {/* TAB 1: informations */}
                                    <SwiperSlide>
                                        <div className="details__swiper--flex details__swiper--from-left">
                                            <div>
                                                <img src={cardData.poster} alt="Couverture" />
                                            </div>
                                            <div>
                                                <div className="title-medium">
                                                    {GlobalFunctions.formatDate(`${cardData.release_date}`)}
                                                </div>
                                                <div className="title-small">
                                                    {cardData.categories.join(", ")}
                                                </div>
                                                <div className="details__swiper--description">
                                                    {cardData.description}
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>

                                    {/* TAB 2: actors */}
                                    <SwiperSlide>
                                        <div className="details__swiper--flex2">
                                            {cardData.actors.map((actors, id) => (
                                                <div>
                                                    <img src={actors.photo} alt={actors.name} />
                                                    <span key={id}>{actors.name}</span>
                                                    <span key={id} className="title-small">{actors.character}</span>
                                                </div>
                                            ))
                                            }
                                        </div>
                                    </SwiperSlide>

                                    {/* TAB 3: similar movies */}
                                    <SwiperSlide>
                                        <div className="details__swiper--similar">
                                            <div>
                                                <div className="title-medium">
                                                    Films similaires :
                                                </div>

                                                <div className="details__swiper--similar-list">
                                                    {cardData.similar_movies.map((movie, id) => (
                                                        <p key={id}>{movie.title}</p>
                                                    ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Home;
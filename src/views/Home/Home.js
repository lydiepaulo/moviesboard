import React, { useEffect, useRef, useState } from 'react';
import Card from '../../components/Card/Card';
import Navbar from '../../components/Navbar/Navbar';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import 'swiper/modules/navigation/navigation.scss';
import 'swiper/modules/pagination/pagination.scss';
import MoviesService from '../../services/MoviesService';
import { Navigation, Pagination } from 'swiper';

const Home = () => {
    const [movies, setMovies] = useState(null)
    const [myMovies, setMyMovies] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const inputRef = useRef();
    const filterRef = useRef();

    //function : fetch all movies
    const displayAllMovies = () => {
        MoviesService.fetchMovies()
            .then((myApiResult) => {
                if (myApiResult !== "") {
                    setMyMovies(myApiResult);
                }
            })
            .catch((err) => setErrorMessage('Erreur serveur : Impossible de récupérer les films de la bibliothèque…'));
    }
    //display all movies by default
    useEffect(() => {
        displayAllMovies();
    }, []);

    //function : fetch by filter
    const displayFilteredMovies = (filter, searchValue) => {
        if (searchValue !== "") {
            MoviesService.fetchMovies(undefined, filter, searchValue)
                .then((myApiResult) => {
                    setMyMovies(myApiResult);
                });
        }
    };

    //select a filter method
    const filteredSearch = (e) => {
        filterRef.current.value = e.target.value;

        if (filterRef.current.value === "tout" || filterRef.current.value === "") {
            displayAllMovies();
        }

        else {
            if (inputRef.current.value !== "") {
                displayFilteredMovies(filterRef.current.value, inputRef.current.value)
            }
        }
    }

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            if (e.target.value !== "") {
                displayFilteredMovies(filterRef.current.value, inputRef.current.value)
            }
        }
    }

    // delete card
    function deleteMovie({ data, id }) {
        MoviesService.remove(id)
            .then(() => {
                const newMovieArray = movies.filter((data) => data.id !== id);
                setMovies(newMovieArray);
            })
            .catch((err) => console.error());
    }

    return (
        <div className="pages-background">
            <Navbar />
            <main className="home-main">
                <h1 className="title-large">
                    <span>My movies</span>
                    <span>board</span>
                </h1>

                <div className="home__search">
                    {/* <h2 class="title-medium">Consulter par filtres :</h2> */}
                    <input className="home__search-bar" ref={inputRef} onKeyDown={onKeyDown} type="search" placeholder="Titre, date de sortie, catégorie" id="search-bar" />
                    <select ref={filterRef} onChange={filteredSearch} name="filter" id="filter-select" className="home__search--select" multiple>
                        <option value="tout">Tout</option>
                        <option value="title_like">Titre</option>
                        <option value="release_date_like">Date de sortie</option>
                        <option value="categories_like">Catégories</option>
                    </select>
                </div>

                <div>
                    {/* GÉRER CAS D'ERREUR SERVEUR : ne fonctionne pas pour l'instant */}
                    {errorMessage && <div className='error'>{errorMessage}</div>}

                    {myMovies && (
                        <Swiper
                            className="home__horizontal-scroll"
                            modules={[Navigation, Pagination]}
                            spaceBetween={24}
                            pagination={{
                                "clickable": true
                            }}
                            navigation={true}
                            slidesPerView={1}
                            breakpoints={{
                                768: {
                                  width: 768,
                                  slidesPerView: 2,
                                },
                                1024: {
                                  width: 1024,
                                  slidesPerView: 3,
                                },
                            }}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                        >
                            {myMovies !== 0 &&
                                myMovies.map((data, slideContent, index) => (
                                    <SwiperSlide key={slideContent} virtualIndex={index}>
                                        <Card key={data.id} onDelete={deleteMovie} id={data.id} data={data} />
                                    </SwiperSlide>
                                ))
                            }
                            {myMovies.length === 0 &&
                                <h2 class="title-medium">Ce film n'est pas présent dans la bibliothèque…</h2>
                            }
                        </Swiper>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
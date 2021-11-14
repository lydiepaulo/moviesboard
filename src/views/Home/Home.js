import React, { useEffect, useRef, useState } from 'react';
import Card from '../../components/Card/Card';
import Navbar from '../../components/Navbar';
import MoviesService from '../../services/MoviesService';
import { LocomotiveScrollProvider } from 'react-locomotive-scroll'

const Home = () => {
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
                        <div className="home__horizontal-scroll">
                            {myMovies !== 0 &&
                                myMovies.map((data) => (
                                    <Card key={data.id} id={data.id} data={data} />
                                ))
                            }
                            {myMovies.length === 0 &&
                                <h2 class="title-medium">Ce film n'est pas présent dans la bibliothèque…</h2>
                            }
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
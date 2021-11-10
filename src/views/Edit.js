import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import MoviesService from '../services/MoviesService';

const Home = () => {
    // Données de la carte
    const [movieData, setMovieData] = useState(null);
    const [moreData, setMoreData] = useState(null);
    const inputRef = useRef();

    useEffect(() => {
        MoviesService.fetchMovieData()
            .then((apiResult) => {
                setMovieData(apiResult);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect((id) => {
        if (id) {
            MoviesService.fetchMovieData(id)
            .then((apiResult) => {
                setMoreData(apiResult);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(moreData);
    
    function changeSearchValue() {
        setMoreData(inputRef.current.value);
    }

    /* Add button */
    

    return (
        <div>
            <Navbar />

            {movieData &&
            <div>
                <form id="form1">
                    <div>
                        <label htmlFor="title">Titre du film</label>
                        <input ref={inputRef} list="title-id" id="title" name="title" required/>
                        <datalist id="title-id">
                            {movieData.results.map((movie, id) => (
                                    <option key={id} value={movie.title} />
                                ))
                            }
                        </datalist>
                    </div>
                    <div>
                        <label htmlFor="date">Date de sortie</label>
                        <input ref={inputRef} list="date-id" id="date" name="date" required/>
                        <datalist id="date-id">
                            {movieData.results.map((movie, id) => (
                                    <option key={id} value={movie.release_date} />
                                ))
                            }
                        </datalist>
                    </div>
                    <button type="button" onClick={changeSearchValue}>Rechercher</button>
                </form>
                
                <form id="form2">
                <div>
                    <label htmlFor="title-modified">Modifier le titre</label>
                    <input type="text" name="title-modified" id="title-modified" required/>
                </div>
                <div>
                    <label htmlFor="date-modified">Choisir une affiche</label>
                    <input type="text" name="date-modified" id="date-modified" />
                </div>
                <div>
                    <label htmlFor="affiche">Choisir une image d'arrière-plan</label>
                    <input type="url" name="arrière-plan" id="arrière-plan" placeholder="https://example.com" pattern="https://.*" size="30" />
                </div>
                <div>
                    <label htmlFor="actors">Acteurs (séparer par une virgule)</label>
                    <input list="actors-id" id="actors" name="actors" required/>
                    <datalist id="actors-id">
                        {movieData.results.map((movie, id) => (
                                <option key={id} value={movie.actors} />
                            ))
                        }
                    </datalist>
                    {/* Add button */}
                </div>
                <div>
                    <label htmlFor="movies">Films similaires</label>
                    <input type="text" name="movies" id="movies" />
                    {/* Add button */}
                </div>
            </form>
            </div>
            }
        </div>
    );
};

export default Home;
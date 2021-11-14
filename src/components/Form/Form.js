import React, { useEffect, useState } from 'react';
import { GrAddCircle, GrHome, GrPrevious } from "react-icons/gr";
import MoviesService from '../../services/MoviesService';
import axios from "axios";
import { Link } from 'react-router-dom';


const MAX_STEPS = 3;

const TMDB_CALL = `https://api.themoviedb.org/3/`;
const API_KEY = `?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;

const Form = (props) => {
    // FORM VARIABLES
    const [formStep, setFormStep] = useState(0);
    const [TmdbSearchedMovie, setTmdbSearchedMovie] = useState(null);
    const [TmdbSearchId, setTmdbSearchId] = useState(null);
    const [checked, setChecked] = useState(true);
    const [inputs, setInputs] = useState({
        title: "",
        release_date: "",
        description: "",
        categories: [],
        poster: "",
        backdrop: "",
        actors: [],
        similar_movies: []
    })

    const handleChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
        let searchValue = e.target.value;
        if (searchValue !== '') {
            MoviesService.fetchMovieData(undefined, searchValue)
                .then((apiResult) => {
                    setTmdbSearchedMovie(apiResult.results);
                });
        }
    }

    const onClickUl = (e) => {
        setTmdbSearchedMovie(null);
        setTmdbSearchId(e.target.id);
    }

    useEffect(() => {
        if (TmdbSearchId) {
            if (formStep === 0) {
                MoviesService.fetchMovieData(TmdbSearchId)
                    .then((apiResult) => {
                        const { title, release_date, overview, poster_path, backdrop_path, genres } = apiResult
                        let poster_url = "";
                        let backdrop_url = "";

                        if (poster_path) {
                            poster_url = `https://image.tmdb.org/t/p/original${poster_path}`;
                        }

                        if (backdrop_path) {
                            backdrop_url = `https://image.tmdb.org/t/p/original${backdrop_path}`;
                        }

                        const categories = apiResult.genres.map(({ name }) => name);

                        setInputs({
                            ...inputs,
                            title,
                            release_date,
                            description: apiResult.overview,
                            categories,
                            backdrop: backdrop_url,
                            poster: poster_url,
                        })
                    });
            } else {
                let fetchActors = `${TMDB_CALL}movie/${TmdbSearchId}/casts${API_KEY}`;
                let fetchSimilar = `${TMDB_CALL}movie/${TmdbSearchId}/similar${API_KEY}`;

                const requestFetchActors = axios.get(fetchActors);
                const requestFetchSimilar = axios.get(fetchSimilar);

                axios
                    .all([requestFetchActors, requestFetchSimilar])
                    .then(
                        axios.spread((...responses) => {
                            const responseFetchActors = responses[0].data.cast;
                            const responseFetchSimilar = responses[1].data.results;

                            // use/access the results
                            const actors = responseFetchActors.map(
                                ({ profile_path, name, character }) => (
                                    { photo: `https://image.tmdb.org/t/p/original${profile_path}`, name, character }
                                ));

                            const similar_movies = responseFetchSimilar.map(
                                ({ poster_path, title, release_date }) => (
                                    { poster: `https://image.tmdb.org/t/p/original${poster_path}`, title, release_date }
                                ));

                            setInputs({
                                ...inputs,
                                actors,
                                similar_movies,
                            })

                        })
                    )
                    .catch(errors => {
                        // react on errors.
                        console.error(errors);
                    });
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TmdbSearchId, formStep]);

    // FORM STEPS
    const previousFormStep = () => {
        setFormStep((cur) => cur - 1);
    };

    const completeFormStep = () => {
        setFormStep((cur) => cur + 1);
    };

    const backToFirstFormStep = () => {
        window.location.reload();
    };

    // FORM BUTTONS
    // prev
    const renderPrevButton = () => {
        if (formStep === 1) {
            return (
                <button
                    onClick={previousFormStep}
                    type="button"
                >
                    <GrPrevious />
                </button>
            );
        } else {
            return undefined;
        }
    };

    // add a new movie
    const newMovieButton = () => {
        return (
            <button
                onClick={backToFirstFormStep}
                type="button"
            >
                <GrAddCircle /> Ajouter un film
            </button>
        )
    }

    // go back to Homepage
    const backToHome = () => {
        return (
            <Link to={{ pathname: "/" }}>
                <GrHome /> Retourner à l'accueil
            </Link>
        )
    }

    // FORM FUNCTIONS
    // submit
    function onSubmit(e) {
        e.preventDefault();
        completeFormStep();
        if (formStep + 1 === 2) {
            props.onValidation(inputs);
        }
    }

    return (
        <div>
            <form onSubmit={onSubmit} action="#" className="form">
                {formStep < MAX_STEPS && (
                    <div>
                        {renderPrevButton()}
                        <span>Étape {formStep + 1} sur {MAX_STEPS}</span>
                    </div>
                )}

                {/* first step */}
                {formStep >= 0 && (
                    <section className={formStep === 0 ? "block" : "hidden"}>
                        <h2 className="title-small">
                            Trouver un film par titre ou date de sortie
                        </h2>
                        {/* title */}
                        <div>
                            <label htmlFor="title">Titre</label>
                            <input
                                type="text"
                                id="title-id"
                                name="title"
                                placeholder="Titre"
                                onChange={handleChange}
                                value={inputs.title}
                            />

                            {TmdbSearchedMovie && TmdbSearchedMovie.length !== 0 && (
                                <ul>
                                    {TmdbSearchedMovie.map((movie) =>
                                        <li key={movie.id} id={movie.id} onClick={onClickUl}>
                                            {movie.title}
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>

                        <div>
                            <label htmlFor="date">Date de sortie</label>
                            <input
                                type="text"
                                id="date"
                                name="release_date"
                                placeholder="12-12-2021"
                                onChange={handleChange}
                                value={inputs.release_date}
                            />
                        </div>
                    </section>
                )}

                {/* second step */}
                {formStep >= 1 && (
                    <section className={formStep === 1 ? "block" : "hidden"}>
                        <h2 className="title-small">Personnaliser l'ajout</h2>
                        {/* categories */}
                        <div>
                            <label key="key" htmlFor="categories">
                                <span>Catégories</span>
                                {inputs &&
                                    inputs.categories.map((categorie, id) => (
                                        <label key={id}>
                                            {categorie}
                                            <input
                                                name="categories"
                                                type="checkbox"
                                                value={categorie}
                                                defaultChecked={checked}
                                                onChange={() => setChecked(!checked)}
                                            />
                                        </label>
                                    ))}
                            </label>
                        </div>

                        {/* description */}
                        <div>
                            <label htmlFor="description">Description</label>
                            <input
                                type="textarea"
                                id="description"
                                name="description"
                                onChange={handleChange}
                                value={inputs.description}
                            />
                        </div>

                        {/* poster */}
                        <div>
                            <label htmlFor="poster">Affiche (url)</label>
                            <input
                                type="url"
                                name="poster"
                                id="poster"
                                placeholder="https://example.com"
                                pattern="https://.*"
                                onChange={handleChange}
                                value={inputs.poster}
                            />
                        </div>

                        {/* backdrop */}
                        <div>
                            <label htmlFor="backdrop">Bannière de fond (url)</label>
                            <input
                                type="url"
                                name="backdrop"
                                id="backdrop"
                                placeholder="https://example.com"
                                pattern="https://.*"
                                size="30"
                                onChange={handleChange}
                                value={inputs.backdrop}
                            />
                        </div>

                        {/* actors */}
                        <div>
                            <label htmlFor="actors">
                                <span>Acteur·ice·s</span>
                                {inputs.actors && inputs.actors.length !== 0 && (
                                    <ul>
                                        {inputs.actors.map((actors, index) =>
                                            <li key={index}>
                                                <span>Photo</span>
                                                <img src={actors.photo} alt={`${actors.name}`} width={100} />
                                                <span>Acteur·ice</span>
                                                <h3>{actors.name}</h3>
                                                <span>Rôle</span>

                                                <h3>{actors.character}</h3>
                                                <button type="button" onClick={() => {
                                                    setInputs({
                                                        ...inputs,
                                                        actors: inputs.actors.filter(actor => actor.name !== actors.name)
                                                    })
                                                }}>
                                                    Delete
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                )}

                            </label>
                        </div>

                        {/* similar movies */}
                        <div>
                            <label htmlFor="similar">
                                <span>Films du même genre</span>
                                {inputs.similar_movies && inputs.similar_movies.length !== 0 && (
                                    <ul>
                                        {inputs.similar_movies.map((movies, index) =>
                                            <li key={index}>

                                                <span>Poster</span>
                                                <img src={movies.poster} alt={`${movies.title}`} width={100} />

                                                <span>Titre</span>
                                                <h3>{movies.title}</h3>

                                                <span>Date</span>

                                                <h3>{movies.release_date}</h3>

                                                <button type="button" onClick={() => {
                                                    setInputs({
                                                        ...inputs,
                                                        similar_movies: inputs.similar_movies.filter(movie => movie.title !== movies.title)
                                                    })
                                                }}>
                                                    Delete
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                )}

                            </label>
                        </div>
                    </section>
                )}

                {/* third step */}
                {formStep === 2 ? (
                    <section>
                        <h2>Bien joué !</h2>
                        <p>Le film a été ajouté avec succès.</p>
                        {newMovieButton()}
                        {backToHome()}
                        
                    </section>
                )
                    : <button type="submit"> {formStep ? "Valider" : "Rechercher"}</button>
                }

            </form>
        </div>
    );
};

export default Form;
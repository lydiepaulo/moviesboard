import React, { useEffect, useState } from 'react';
import { GrAddCircle, GrHome, GrPrevious } from "react-icons/gr";
import MoviesService from '../../services/MoviesService';
import axios from "axios";
import { Link } from 'react-router-dom';

const MAX_STEPS = 2;

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
                    className="form__previous"
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

    // EDIT FORM : pre-fill
    useEffect(() => {
        if (props.movie) {
            setInputs({
                title: props.movie.title,
                release_date: props.movie.release_date,
                description: props.movie.description,
                categories: props.movie.categories,
                poster: props.movie.poster,
                backdrop: props.movie.backdrop,
                actors: props.movie.actors,
                similar_movies: props.movie.similar_movies,
            })

        }
    }, [props.movie]);


    // FORM FUNCTIONS
    // submit
    function onSubmit(e) {
        e.preventDefault();
        completeFormStep();
        if (formStep + 1 === 2) {
            props.onValidation(inputs);
        }
    }

    // go back to Homepage
    const backToHome = () => {
        return (
            <Link className="button" to={{ pathname: "/" }}>
                <GrHome /> Retourner à l'accueil
            </Link>
        )
    }

    return (
        <div>
            <form onSubmit={onSubmit} action="#" className="form">
                {formStep < MAX_STEPS && (
                    <div class="form__step">
                        {renderPrevButton()}
                        <span className="title-small"> {formStep + 1} sur {MAX_STEPS}</span>
                    </div>
                )}

                {/* first step */}
                {formStep >= 0 && (
                    <section className={formStep === 0 ? "block" : "hidden"}>
                        <div className="title-medium">
                            Sélectionner un film
                        </div>
                        {/* title */}
                        <div class="form__select">
                            <label className="title-small" htmlFor="title">Titre</label>
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
                            <label className="title-small" htmlFor="date">Date de sortie</label>
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
                        <h2 className="title-medium">Personnaliser l'ajout</h2>
                        {/* categories */}
                        <div>
                            <label className="title-small form__checkbox" key="key" htmlFor="categories">Catégories</label>
                            {inputs &&
                                inputs.categories.map((categorie, id) => (
                                    <label key={id}>
                                        <input
                                            name="categories"
                                            type="checkbox"
                                            value={categorie}
                                            defaultChecked={checked}
                                            onChange={() => setChecked(!checked)}
                                            />
                                        {categorie}
                                    </label>
                                ))}

                        </div>

                        {/* description */}
                        <div>
                            <label className="title-small" htmlFor="description">Description</label>
                            <textarea
                                type="textarea"
                                id="description"
                                name="description"
                                onChange={handleChange}
                                value={inputs.description}
                            >
                            </textarea>
                        </div>

                        {/* poster */}
                        <div>
                            <label className="title-small" htmlFor="poster">Affiche (url)</label>
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
                            <label className="title-small" htmlFor="backdrop">Bannière de fond (url)</label>
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
                                <label className="title-small" htmlFor="actors">Acteur·ice·s</label>
                                {inputs.actors && inputs.actors.length !== 0 && (
                                    <div className="form__actors">
                                        {inputs.actors.map((actors, index) =>
                                            <div key={index}>
                                                <img src={actors.photo} alt={`${actors.name}`} />
                                                <h3>{actors.name}</h3>
                                                <h3>{actors.character}</h3>
                                                <button type="button" onClick={() => {
                                                    setInputs({
                                                        ...inputs,
                                                        actors: inputs.actors.filter(actor => actor.name !== actors.name)
                                                    })
                                                }}>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>

                        {/* similar movies */}
                            <div>
                                <label className="title-small" htmlFor="similar">Films du même genre</label>
                                {inputs.similar_movies && inputs.similar_movies.length !== 0 && (
                                    <div className="form__actors">
                                        {inputs.similar_movies.map((movies, index) =>
                                            <div key={index}>

                                                <img src={movies.poster} alt={`${movies.title}`} width={100} />
                                                <h3>{movies.title}</h3>
                                                <h3>{movies.release_date}</h3>

                                                <button type="button" onClick={() => {
                                                    setInputs({
                                                        ...inputs,
                                                        similar_movies: inputs.similar_movies.filter(movie => movie.title !== movies.title)
                                                    })
                                                }}>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                    </section>
                )}

                {/* third step */}
                {formStep === 2 ? (
                    <section>
                        <div className="form__success">
                        <p>Bien joué !</p>
                        <p>Le film a été ajouté/modifié avec succès.</p>
                        {newMovieButton()}
                        {backToHome()}</div>

                    </section>
                )
                    : <button className="submit-button" type="submit"> {formStep ? "Valider" : "Rechercher"}</button>
                }

            </form>
        </div>
    );
};

export default Form;
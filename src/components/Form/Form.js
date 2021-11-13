import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { GrAddCircle, GrHome, GrPrevious } from "react-icons/gr";
import MoviesService from '../../services/MoviesService';

const MAX_STEPS = 5;

const Form = (props) => {
    // FORM VARIABLES
    const [formStep, setFormStep] = useState(0);
    const [checked, setChecked] = useState(true);
    const [TmdbSearchedMovie, setTmdbSearchedMovie] = useState(null);
    const [TmdbSearchId, setTmdbSearchId] = useState(null);
    const [TmdbMovie, setTmdbMovie] = useState(null);
    const [TmdbActors, setTmdbActors] = useState(null);
    const [TmdbSimilarMovies, setTmdbSimilarMovies] = useState(null);

    // FORM CONFIGURATION
    const {
        watch,
        control,
        setValue,
        register,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm({
        mode: "all",
        defaultValues: {
            title: "",
            release_date: "",
            description: "",
            categories: [],
            poster: "",
            backdrop: "",
            actors: [],
            similar_movies: []
        }
    });

    // DATA FROM TMDB

    // get the title
    const onInput = (e) => {
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
            MoviesService.fetchMovieData(TmdbSearchId)
                .then((apiResult) => {
                    setTmdbMovie(apiResult);
                    setValue("title", apiResult.title, {
                        shouldValidate: false
                    });

                    setValue("release_date", apiResult.release_date, {
                        shouldValidate: false
                    });

                    setValue("description", apiResult.overview);

                    if (apiResult.poster_path) {
                        let poster_url = `https://image.tmdb.org/t/p/original${apiResult.poster_path}`;
                        setValue("poster", poster_url);
                    }

                    if (apiResult.backdrop_path) {
                        let backdrop_url = `https://image.tmdb.org/t/p/original${apiResult.backdrop_path}`;
                        setValue("backdrop", backdrop_url);
                    }
                });

            MoviesService.fetchMoreData(TmdbSearchId, "casts")
                .then((apiResult) => {
                    setTmdbActors(apiResult.cast);

                    for (let i = 0; i < apiResult.cast.length; i++) {
                        let profile = `https://image.tmdb.org/t/p/original${apiResult.cast[i].profile_path}`;
                        setValue(`actors.${i}.photo`, profile);

                        setValue(`actors.${i}.name`, apiResult.cast[i].character);

                        setValue(`actors.${i}.character`, apiResult.cast[i].character);
                    }

                })

            MoviesService.fetchMoreData(TmdbSearchId, "similar")
                .then((apiResult) => {
                    setTmdbSimilarMovies(apiResult.results);

                    for (let i = 0; i < apiResult.results.length; i++) {
                        let poster = `https://image.tmdb.org/t/p/original${apiResult.results[i].backdrop_path}`;
                        setValue(`similar_movies.${i}.poster`, poster);

                        setValue(`similar_movies.${i}.title`, apiResult.results[i].title);

                        setValue(`similar_movies.${i}.release_date`, apiResult.results[i].release_date);
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TmdbSearchId, setValue]);

    // control : add and remove new fields from the server
    const controlActors = useFieldArray({
        name: 'actors',
        control,
    });

    const controlSimilarMovies = useFieldArray({
        name: 'similar_movies',
        control,
    });

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

    // next & submit
    const renderNextButton = () => {
        if (formStep === 0) {
            return (
                <button
                    disabled={!isValid}
                    onClick={completeFormStep}
                    type="button"
                >
                    Rechercher
                </button>
            );
        } else if (formStep === 1) {
            return (
                <button
                    disabled={isValid}
                    type="submit"
                >
                    Valider
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

    // FORM FUNCTIONS
    // submit
    /* const onSubmit = (e, data) => {
        e.preventDefault();
        completeFormStep();
        props.onValidation(data);
    } */

    function onSubmit(e, data) {
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        e.preventDefault();
        completeFormStep();
        props.onValidation(data);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} action="#" className="form">
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
                                {...register("title", {
                                    required: {
                                        value: "Required",
                                        message: "Veuillez entrer un titre de film."
                                    }
                                })}
                                onInput={onInput}
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
                            {errors.title?.type === "required" && <p className="form__error-message">{errors.title.message}</p>}
                        </div>

                        {/* release date */}
                        <div>
                            <label htmlFor="date">Date de sortie</label>
                            <input
                                type="text"
                                id="date"
                                name="date"
                                placeholder="12-12-2021"
                                {...register("release_date", {
                                    pattern: {
                                        value: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)\d{2})$/i,
                                        message: "Veuillez respecter le format : JJ-MM-AAAA."
                                    }
                                })}
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
                            <label htmlFor="categories">
                                <span>Catégories</span>
                                {TmdbMovie &&
                                    TmdbMovie.genres.map((genre) => (
                                        <label key={genre.id}>
                                            <input
                                                name="categories"
                                                type="checkbox"
                                                value={genre.name}
                                                defaultChecked={checked}
                                                onChange={() => setChecked(!checked)}
                                                {...register("categories")}
                                            />
                                            {genre.name}
                                        </label>
                                    ))}
                            </label>
                            {/* <button onClick={handleAddNewCategorie}>Ajouter une catégorie</button> */}
                            {errors.categories?.type === "required" && <p className="form__error-message">Veuillez sélectionner une ou plusieurs catégories.</p>}
                        </div>

                        {/* description */}
                        <div>
                            <label htmlFor="description">Description</label>
                            <input
                                type="textarea"
                                id="description"
                                name="description"
                                {...register("description", {
                                    required: {
                                        value: "Required",
                                        message: "Veuillez ajouter une description."
                                    }
                                })}
                            />
                            {errors.description?.type === "required" && <p className="form__error-message">{errors.description.message}</p>}
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
                                {...register("poster")}
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
                                {...register("backdrop")}
                            />
                        </div>

                        {/* actors */}
                        <div>
                            <label htmlFor="actors">
                                <span>Acteur·ice·s</span>
                                {TmdbActors && TmdbActors.length !== 0 && (
                                    <ul>
                                        {TmdbActors.map((actors, index) =>
                                            <li key={actors.id}>
                                                <span>Photo</span>
                                                <input
                                                    type="url"
                                                    placeholder="https://example.com"
                                                    pattern="https://.*"
                                                    id={`${index}`}
                                                    {...register(`actors.${index}.photo`)}
                                                />

                                                <span>Acteur·ice</span>
                                                <input
                                                    type="text"
                                                    id={`${index}`}
                                                    {...register(`actors.${index}.name`)} />

                                                <span>Rôle</span>
                                                <input
                                                    type="text"
                                                    id={`${index}`}
                                                    {...register(`actors.${index}.character`)}
                                                />
                                                <button type="button" onClick={() => controlActors.remove(index)}>
                                                    Delete
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                )}
                                <button
                                    type="button"
                                    onClick={() => controlActors.append({ photo: "", name: "", character: "" })}
                                >
                                    append
                                </button>

                            </label>
                            {/* <button onClick={handleAddNewActor}>Ajouter un acteur</button> */}
                            {errors.actors && <p className="form__error-message">Veuillez sélectionner un·e ou plusieurs acteur·ice·s.</p>}
                        </div>

                        {/* similar movies */}
                        <div>
                            <label htmlFor="similar">
                                <span>Films du même genre</span>
                                {TmdbSimilarMovies && TmdbSimilarMovies.length !== 0 && (
                                    <ul>
                                        {TmdbSimilarMovies.map((movies, index) =>
                                            <li key={movies.id}>
                                                <span>Poster</span>
                                                <input
                                                    type="url"
                                                    placeholder="https://example.com"
                                                    pattern="https://.*"
                                                    id={`${index}`}
                                                    {...register(`similar_movies.${index}.poster`)}
                                                />

                                                <span>Titre</span>
                                                <input
                                                    type="text"
                                                    id={`${index}`}
                                                    {...register(`similar_movies.${index}.title`)} />

                                                <span>Date de sortie</span>
                                                <input
                                                    type="text"
                                                    id={`${index}`}
                                                    placeholder="2012-12-12"
                                                    {...register(`similar_movies.${index}.release_date`)}
                                                />
                                                <button type="button" onClick={() => controlSimilarMovies.remove(index)}>
                                                    Delete
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                )}
                                <button
                                    type="button"
                                    onClick={() => controlSimilarMovies.append({ poster: "", title: "", release_date: "" })}
                                >
                                    append
                                </button>

                            </label>
                            {/* <button onClick={handleAddNewActor}>Ajouter un acteur</button> */}
                            {errors.actors && <p className="form__error-message">Veuillez sélectionner un·e ou plusieurs acteur·ice·s.</p>}
                        </div>
                    </section>
                )}

                {/* third step */}
                {formStep === 2 && (
                    <section>
                        <h2>Bien joué !</h2>
                        <p>Le film a été ajouté avec succès.</p>
                        {newMovieButton()}
                        <button>
                            <GrHome /> Retourner à l'accueil
                        </button>
                    </section>
                )}

                {/* final button */}
                {renderNextButton()}
                <pre>
                    {JSON.stringify(watch(), null, 2)}
                </pre>
            </form>
        </div>
    );
};

export default Form;
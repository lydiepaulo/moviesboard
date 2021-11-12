import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { GrAddCircle, GrHome, GrPrevious } from "react-icons/gr";
import MoviesService from '../services/MoviesService';

const MAX_STEPS = 2;

const Form = (props) => {
    // FORM VARIABLES
    const [formStep, setFormStep] = useState(0);
    const [checked, setChecked] = useState(true);
    const [TmdbSearchedMovie, setTmdbSearchedMovie] = useState(null);
    const [TmdbSearchId, setTmdbSearchId] = useState(null);
    const [TmdbMovie, setTmdbMovie] = useState(null);

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
    /* actors : { photo: "https://static1.ozap.com/articles/9/44/03/59/@/4441736-vanessa-paradis-128x128-1.jpg", name: "vanessa paradis", character: "joe le taxi" },{ photo: "https://static1.ozap.com/articles/9/44/03/59/@/4441736-vanessa-paradis-128x128-1.jpg", name: "vanessa paradis", character: "joe le taxi" } */
    /* similar : movies { poster: "https://m.media-amazon.com/images/I/510fWlbNvNL._AC_.jpg", title: "spider-bidule", release_date: "2012-12-12" } */


    // DATA FROM TMDB

    // get the title
    const onInput = (e) => {
        //let searchValue = searchRef.current.value;
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
                shouldValidate: true,
                shouldDirty: true
            });

            setValue("release_date", apiResult.release_date, {
                shouldValidate: true,
                shouldDirty: true
            });

            setValue("description", apiResult.overview, {
                shouldValidate: true,
                shouldDirty: true
            });
            
            if (apiResult.poster_path) {
                let poster_url = `https://image.tmdb.org/t/p/original${apiResult.poster_path}`;
                setValue("poster", poster_url, {
                    shouldValidate: true,
                    shouldDirty: true
                });
            }
            
            if (apiResult.backdrop_path) {
                let backdrop_url = `https://image.tmdb.org/t/p/original${apiResult.backdrop_path}`;
                setValue("backdrop", backdrop_url, {
                    shouldValidate: true,
                    shouldDirty: true
                });
            }
        });
       }
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
                    disabled={isValid}
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
    const onSubmit = (data) => {
        props.onValidation(data);
        completeFormStep()
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
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
                        <fieldset>
                            <label htmlFor="title">Titre</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Titre"
                                {...register("title")}
                                onInput={onInput}
                            />

                            {TmdbSearchedMovie && TmdbSearchedMovie.length !== 0 && (
                                <ul>
                                    {TmdbSearchedMovie.map((movie, key) =>
                                        <li key={key.id} id={movie.id} onClick={onClickUl}>
                                            {movie.title}
                                            <span>{movie.release_date.split('-')[0]}</span>
                                        </li>
                                    )}
                                </ul>
                            )}
                            {errors.title?.type === "required" && <p className="form__error-message">{errors.title.message}</p>}
                        </fieldset>

                        {/* release date */}
                        <fieldset>
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
                        </fieldset>
                    </section>
                )}

                {/* second step */}
                {formStep >= 1 && (
                    <section className={formStep === 1 ? "block" : "hidden"}>
                        <h2 className="title-small">Personnaliser l'ajout</h2>
                        {/* categories */}
                        <fieldset>
                            <label htmlFor="categories">
                                <span>Catégories</span>
                                {TmdbMovie && 
                                    TmdbMovie.genres.map((genre) => (
                                        <label key={genre.ids}>
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
                        </fieldset>

                        {/* description */}
                        <fieldset>
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
                        </fieldset>

                        {/* poster */}
                        <fieldset>
                            <label htmlFor="poster">Affiche (url)</label>
                            <input
                                type="url"
                                name="poster"
                                id="poster"
                                placeholder="https://example.com"
                                pattern="https://.*"
                                {...register("poster")}
                            />
                        </fieldset>

                        {/* backdrop */}
                        <fieldset>
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
                        </fieldset>

                        {/* actors */}
                        <fieldset>
                            <label htmlFor="actors">
                                <span>Acteur·ice·s</span>
                                <ul>
                                    {[].map((actors, index) => {
                                        return (
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
                                        );
                                    })}
                                </ul>
                                <button
                                    type="button"
                                    onClick={() => controlActors.append({ photo: "", name: "", character: "" })}
                                >
                                    append
                                </button>

                            </label>
                            {/* <button onClick={handleAddNewActor}>Ajouter un acteur</button> */}
                            {errors.actors && <p className="form__error-message">Veuillez sélectionner un·e ou plusieurs acteur·ice·s.</p>}
                        </fieldset>

                        {/* similar movies */}
                        <fieldset>
                            <label htmlFor="similar">
                                <span>Films du même genre</span>
                                <ul>
                                    {[].map((movies, index) => {
                                        return (
                                            <li key={movies.id}>
                                                <span>Poster</span>
                                                <input
                                                    type="url"
                                                    placeholder="https://example.com"
                                                    pattern="https://.*"
                                                    id={`${index}`}
                                                    {...register(`movies.${index}.poster`)}
                                                />

                                                <span>Titre</span>
                                                <input
                                                    type="text"
                                                    id={`${index}`}
                                                    {...register(`movies.${index}.title`)} />

                                                <span>Date de sortie</span>
                                                <input
                                                    type="text"
                                                    id={`${index}`}
                                                    placeholder="2012-12-12"
                                                    {...register(`movies.${index}.release_date`)}
                                                />
                                                <button type="button" onClick={() => controlSimilarMovies.remove(index)}>
                                                    Delete
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <button
                                    type="button"
                                    onClick={() => controlSimilarMovies.append({ poster: "", title: "", release_date: "" })}
                                >
                                    append
                                </button>

                            </label>
                            {/* <button onClick={handleAddNewActor}>Ajouter un acteur</button> */}
                            {errors.actors && <p className="form__error-message">Veuillez sélectionner un·e ou plusieurs acteur·ice·s.</p>}
                        </fieldset>
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
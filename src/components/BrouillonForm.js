import React, { useState } from "react";
import { useForm } from "react-hook-form";
/* import { useNavigate } from 'react-router-dom'; */
import { GrPrevious } from "react-icons/gr";

const MAX_STEPS = 2;

const Form = (props) => {
    // go back to home page once it's done
    /* const navigate = useNavigate(); */

    //VARIABLES :

    // check changes of the checkbox
    const [formStep, setFormStep] = useState(0);
    const defaultValues = props.movie;
    const [checked, setChecked] = useState(true);
    const [actors, setActors] = useState([
        {
            poster: 'https://cdn.citatis.com/img/a/8/2152.v5.jpg',
            name: 'vanessa paradis',
            character: 'joe le taxi',
        }
    ]);
    
    // STEPS 
    const {
        watch,
        register,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm({
        mode: "all",
        defaultValues,
    });

    // buttons
    const previousFormStep = () => {
        setFormStep((cur) => cur - 1);
    };

    const completeFormStep = () => {
        setFormStep((cur) => cur + 1);
    };

    // previous
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
                    disabled={!isValid}
                    type="submit"
                >
                    Valider
                </button>
            );
        } else {
            return undefined;
        }
    };

    // FUNCTIONS

    // add new actor
    function handleAddNewActor() {
        const updateActors = [
            ...actors,
            {
                poster: "",
                name: "",
                character: "",
            }
        ];
        // update the state to the updatedUsers
        setActors(updateActors);
      }

    // submit
    const onSubmit = (data) => {
        console.log('Le formulaire a été validé avec succès !', data);
        props.onValidation(data);
        completeFormStep()
        /* navigate("/"); */
    }


    return (
        <div>
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
                            <fieldset>
                                <label htmlFor="title">Titre</label>
                                <input
                                    list="title-id"
                                    id="title"
                                    name="title"
                                    {...register("title", {
                                        required: {
                                            value: "Required",
                                            message: "Veuillez préciser un titre."
                                        },
                                    })}
                                />
                                <datalist id="title-id">
                                    {/* {movieData.results.map((movie, id) => (
                                        <option key={id} value={movie.title} />
                                        ))
                                    } */}
                                    <option value="test">test</option>
                                    <option value="text">text</option>
                                </datalist>
                                {errors.title && <p className="form__error-message">{errors.title.message}</p>}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="date">Date de sortie</label>
                                <input
                  /* ref={inputRef} */ list="date-id"
                                    id="date"
                                    name="date"
                                    {...register("date", {
                                        required: {
                                            value: "Required",
                                            message: "Veuillez préciser une date de sortie.",
                                        },
                                    })}
                                />
                                <datalist id="date-id">
                                    {/* {movieData.results.map((movie, id) => (
                                        <option key={id} value={movie.release_date} />
                                        ))
                                    } */}
                                    <option value="test">test</option>
                                    <option value="text">text</option>
                                </datalist>
                                {errors.date && <p className="form__error-message">{errors.date.message}</p>}
                            </fieldset>
                        </section>
                    )}

                    {/* second step */}
                    {formStep >= 1 && (
                        <section className={formStep === 1 ? "block" : "hidden"}>
                            <h2 className="title-small">Personnaliser l'ajout</h2>
                            <fieldset>
                                <label htmlFor="categories">Catégories</label>
                                <label>
                                    <input
                                        name="categories"
                                        type="checkbox"
                                        value="catégorie 1"
                                        id="categorie1"
                                        defaultChecked={checked}
                                        onChange={() => setChecked(!checked)}
                                        {...register("categorie.0")}
                                    />
                                    <span>catégorie 1</span>
                                </label>
                                <label>
                                    <input
                                        name="categories"
                                        type="checkbox"
                                        value="catégorie 2"
                                        id="categorie2"
                                        defaultChecked={checked}
                                        onChange={() => setChecked(!checked)}
                                        {...register("categorie.1")}
                                    />
                                    <span>catégorie 2</span>
                                </label>
                                {/* {movieData.results.map((categories) => (
                                        <label key={categories.id}>
                                            <input
                                                name="categories"
                                                type="checkbox"
                                                value={categories.name}
                                                {...register("categories")}
                                            />{" "}
                                            {categories.name}
                                        </label>
                                    ))} */}
                                {errors.categories && <p className="form__error-message">Veuillez sélectionner une ou plusieurs catégories.</p>}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="date-modified">Description</label>
                                <input
                                    type="textarea"
                                    name="description"
                                    rows="4"
                                    id="description"
                                    placeholder="Description..."
                                    {...register("description", {
                                        required: {
                                            value: "Required",
                                            message: "Veuillez ajouter une description.",
                                        },
                                        maxLength: {
                                            value: 250,
                                            message: "La description ne doit pas excéder 250 caractères.",
                                        },
                                    })}
                                />
                                {errors.description && errors.description.type === "required" && <p className="form__error-message">{errors.description.message}</p>}
                                {errors.description && errors.description.type === "maxLength" && <p className="form__error-message">{errors.description.message}</p>}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="date-modified">Affiche (url)</label>
                                <input
                                    type="url"
                                    name="poster"
                                    id="poster"
                                    placeholder="https://example.com"
                                    pattern="https://.*"
                                    size="30"
                                    {...register("poster")}
                                />
                            </fieldset>
                            <fieldset>
                                <label htmlFor="date-modified">Bannière de fond (url)</label>
                                <input
                                    type="url"
                                    name="banner"
                                    id="banner"
                                    placeholder="https://example.com"
                                    pattern="https://.*"
                                    size="30"
                                    {...register("banner")}
                                />
                            </fieldset>
                            <fieldset>
                                <label htmlFor="similar">Films similaires</label>
                                <label>
                                    <input
                                        name="similar"
                                        type="checkbox"
                                        value="film 1"
                                        id="similar1"
                                        defaultChecked={checked}
                                        onChange={() => setChecked(!checked)}
                                        {...register("similar.0")}
                                    />
                                    <span>film 1</span>
                                </label>
                                <label>
                                    <input
                                        name="similar"
                                        type="checkbox"
                                        value="film 2"
                                        id="similar2"
                                        defaultChecked={checked}
                                        onChange={() => setChecked(!checked)}
                                        {...register("similar.1")}
                                    />
                                    <span>film 2</span>
                                </label>

                                {/* {movieData.results.map((similar) => (
                                        <label key={similar.id}>
                                            <input
                                                name="similar"
                                                type="checkbox"
                                                value={similar.name}
                                                {...register("similar")}
                                            />{" "}
                                            {similar.name}
                                        </label>
                                    ))} */}

                                {errors.similar && <p className="form__error-message">Veuillez sélectionner un ou plusieurs films.</p>}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="actors">Acteur·ice·s</label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="actors"
                                        id="actors"
                                        defaultChecked={checked}
                                    />
                                    <button onClick={handleAddNewActor}>Ajouter un acteur</button>
                                </label>

                                {/* {movieData.results.map((actors) => (
                                        <label key={actors.id}>
                                            <input
                                                name="actors"
                                                type="checkbox"
                                                value={actors.name}
                                                {...register("actors")}
                                            />{" "}
                                            {actors.name}
                                        </label>
                                    ))} */}

                                {errors.actors && <p className="form__error-message">Veuillez sélectionner un·e ou plusieurs acteur·ice·s.</p>}
                            </fieldset>
                        </section>
                    )}

                    {/* third step */}
                    {formStep === 2 && (
                        <section>
                            <h2>Bien joué !</h2>
                            <p>Le film a été ajouté avec succès.</p>
                        </section>
                    )}

                    {/* final button */}
                    {renderNextButton()}
                    <pre>
                        {JSON.stringify(watch(), null, 2)}
                    </pre>
                </form>
            </div>
        </div>
    );
};

export default Form;
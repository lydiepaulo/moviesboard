import React, { useState } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
/* import { GrPrevious } from "react-icons/gr"; */



const Form = (props) => {
    // FORM VARIABLES & CONFIGURATION
    /* const [formStep, setFormStep] = useState(0); */

    // data types
    /* const [formDataTypes, setFormDataTypes] = useState({
        title: "",
        release_date: "",
        description: "",
        categories: [],
        poster: "",
        backdrop: "",
        actors: [{ photo: "https://static1.ozap.com/articles/9/44/03/59/@/4441736-vanessa-paradis-128x128-1.jpg", name: "vanessa paradis", character: "joe le taxi" }],
        similar_movies: [{ poster: "https://m.media-amazon.com/images/I/510fWlbNvNL._AC_.jpg", title: "spider-bidule", release_date: "2012-12-12" }],
    }); */

    // update data
    /* const onUpdateData = event => {
        const target = event.target,
            value = target.value,
            name = target.name;

        const data = { ...formDataTypes };
        data[name] = value;
        setFormDataTypes(data);
    }; */

    const [checked, setChecked] = useState(true);

    // FORM STEPS
    const {
        watch,
        control,
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

    const { append, remove } = useFieldArray({
        name: 'actors',
        control,
    });

    const renderNextButton = () => {
        return (
            <button
                disabled={!isValid}
                type="submit"
            >
                Valider
            </button>
        );
    };

    // FORM FUNCTIONS

    // submit
    const onSubmit = (data) => {
        console.log('Le formulaire a été validé avec succès !', data);
        props.onValidation(data);
        /* completeFormStep() */
        /* navigate("/"); */
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                {/* title */}
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
                        {['Spider-man', 'Spider-cochon', 'il sait marcher au plafond'].map((item, key) =>
                            <option key={key} value={item} />
                        )}
                    </datalist>
                    {errors.title && <p className="form__error-message">{errors.title.message}</p>}
                </fieldset>

                {/* release date */}
                <fieldset>
                    <label htmlFor="date">Date de sortie</label>
                    <input
                        type="text"
                        id="date"
                        name="date"
                        placeholder="2012-12-12"
                        {...register("release_date", {
                            required: {
                                value: "Required",
                                message: "Veuillez préciser une date."
                            },
                        })}
                    />
                    {errors.date && <p className="form__error-message">{errors.date.message}</p>}
                </fieldset>

                {/* categories */}
                <fieldset>
                    <label htmlFor="categories">
                        <span>Catégories</span>
                        {["action", "science-fiction"].map((genre) => (
                            <label key={genre.id}>
                                <input
                                    name="categories"
                                    type="checkbox"
                                    value={genre}
                                    defaultChecked={checked}
                                    onChange={() => setChecked(!checked)}
                                    {...register("categories")}
                                />
                                {genre}
                            </label>
                        ))}
                    </label>
                    {/* <button onClick={handleAddNewCategorie}>Ajouter une catégorie</button> */}
                    {errors.categories && <p className="form__error-message">Veuillez sélectionner une ou plusieurs catégories.</p>}
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
                                message: "Veuillez préciser une date."
                            }
                        })}
                    />
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
                                        <button type="button" onClick={() => remove(index)}>
                                            Delete
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        <button
                            type="button"
                            onClick={() => append({ photo: "", name: "", character: "" })}
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
                        <span>Films similaires</span>
                        <input
                            type="text"
                            name="similar"
                            id="similar"
                        />
                    </label>
                    {/* <button onClick={handleAddNewSimilarMovie}>Ajouter un acteur</button> */}
                    {errors.similar && <p className="form__error-message">Veuillez sélectionner un ou plusieurs films.</p>}
                </fieldset>

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
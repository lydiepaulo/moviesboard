import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";
import { GrPrevious } from "react-icons/gr";

const MAX_STEPS = 2;

const Home = () => {
    const [formStep, setFormStep] = useState(0);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({ mode: "all" });

    // BUTTONS
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

    // function : SUBMIT

    const submitForm = (values) => {
        window.alert(JSON.stringify(values, null, 2))
        completeFormStep()
    }

    // FORM

    return (
        <div>
            <Navbar />

            {/* {movieData && */}
            <div>
                <h1 className="title-large">Ajouter un film à la bibliothèque</h1>
                <form onSubmit={handleSubmit(submitForm)} class="form">
                    {formStep < MAX_STEPS && (
                        <div>
                            {renderPrevButton()}
                            <span>Étape {formStep + 1} sur {MAX_STEPS}</span>
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
                                        required: "Required",
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
                                {errors.title && <p className="form__error-message">Veuillez préciser un titre.</p>}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="date">Date de sortie</label>
                                <input
                  /* ref={inputRef} */ list="date-id"
                                    id="date"
                                    name="date"
                                    {...register("date", {
                                        required: "Required",
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
                                {errors.date && <p className="form__error-message">Veuillez préciser une date de sortie.</p>}
                            </fieldset>
                        </section>
                    )}

                    {/* second step */}
                    {formStep >= 1 && (
                        <section className={formStep === 1 ? "block" : "hidden"}>
                            <h2 className="title-small">Personnaliser l'ajout</h2>
                            <fieldset>
                                <label htmlFor="categorie">Catégorie</label>
                                <input list="categorie-id"
                                    id="categorie"
                                    name="categorie"
                                    {...register("categorie", {
                                        required: "Required",
                                    })}
                                />
                                <datalist id="categorie-id">
                                    {/* {movieData.results.map((movie, id) => (
                                        <option key={id} value={movie.release_date} />
                                        ))
                                    } */}
                                    <option value="test">test</option>
                                    <option value="text">text</option>
                                </datalist>
                                {errors.description && <p className="form__error-message">Veuillez sélectionner une catégorie.</p>}
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
                                        required: "Required",
                                        maxLength: 250,
                                    })}
                                />
                                {errors.description && errors.description.type === "required" && <p className="form__error-message">Veuillez ajouter une description.</p>}
                                {errors.description && errors.description.type === "maxLength" && <p className="form__error-message">La description ne doit pas excéder 250 caractères.</p>}
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
                </form>
            </div>
            {/* } */}
        </div>
    );
};

export default Home;

import React from 'react';
import { Link } from 'react-router-dom';
import GlobalFunctions from '../../services/GlobalFunctions';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';

const Card = ({ data, movie, onDelete }) => {
    const movieDate = data.release_date;
    function clickDelete() {
        onDelete(movie);
    }

    return (
        <figure className="card smooth-apparition">
            <Link to={{ pathname: `/movies/${data.id}` }}>
                <img src={data.poster} alt="Couverture" />
            </Link>
            <figcaption>
                <Link to={{ pathname: `/movies/${data.id}` }}>
                    <h3 className="title-small">{data.title}</h3>
                </Link>
                <div>
                    <span>
                        {/* <LikeButton id={id} /> */}
                        <span className="title-small date">{GlobalFunctions.formatDate(movieDate)}</span>
                    </span>
                    <p className="card-description">
                        {data.description}
                    </p>
                    <EditButton />

                    {onDelete && (
                        <DeleteButton onClick={clickDelete} />
                    )}

                </div>
            </figcaption>
        </figure>
    );
};

export default Card;
import React from 'react';
import { Link } from 'react-router-dom';
import GlobalFunctions from '../services/GlobalFunctions';

const Card = ({ data }) => {
    const movieDate = data.release_date;

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
                        {GlobalFunctions.formatDate(movieDate)}
                    </span>
                    <p className="card-description">
                        {data.description}
                    </p>
                </div>
            </figcaption>
        </figure>
    );
};

export default Card;
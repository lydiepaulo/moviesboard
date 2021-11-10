import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ data }) => {
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
                        {data.release_date}
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
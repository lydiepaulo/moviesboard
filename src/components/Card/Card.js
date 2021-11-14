import React from 'react';
import { Link } from 'react-router-dom';
import GlobalFunctions from '../../services/GlobalFunctions';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';

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
                        <span className="title-small date">{GlobalFunctions.formatDate(movieDate)}</span>
                    </span>
                    <p className="card-description">
                        {data.description}
                    </p>
                    <div class="card-buttons">
                        <EditButton id={data.id} />
                        <DeleteButton id={data.id} title={data.title} />
                    </div>
                </div>
            </figcaption>
        </figure>
    );
};

export default Card;
import axios from 'axios';

const API_CALL = 'http://localhost:3000';
const TMDB_CALL = `https://api.themoviedb.org/3/`;
const API_KEY = `?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;

const MoviesService = {
    // PRIVATE API
    async fetchMovies(id, filter, value) {
        let url = `${API_CALL}/movies`;

        if (id) {
            url += `/${id}`;
        }

        else if (filter && value) {
            url += `?${filter}=${value}`;
        }

        try {
            const response = await axios
                .get(url);
            return response.data;

        } catch (err) {
            return errorHandler(err);
        }
    },

    // add a movie
    add(movie) {
        return axios
            .post(`${API_CALL}/movies`, movie)
            .then((response) => response.data)
            .catch(errorHandler);
    },

    // delete via ID
    remove(movieId) {
        return axios
            .delete(`${API_CALL}/movies/${movieId}`)
            .then((response) => response.data)
            .catch(errorHandler);
    },

    // edit a movie
    update(movie) {
        return axios
            .put(`${API_CALL}/movies/${movie.id}`, {
                gender: movie.gender,
                firstname: movie.firstname,
                lastname: movie.lastname,
                email: movie.email,
                phone: movie.phone,
                birthdate: movie.birthdate,
                city: movie.city,
                country: movie.country,
                photo: movie.photo,
            })
            .then((response) => response.data)
            .catch(errorHandler);
    },



    // THE MOVIE DATABASE
    async fetchMovieData(id, searchValue) {
        let url = `${TMDB_CALL}`;

        if (id) {
            url += `movie/${id}${API_KEY}`;
        }

        else {
            url += `search/movie${API_KEY}&query=${searchValue}`;
        }

        try {
            const response = await axios
                .get(url);
            return response.data;
        } catch (err) {
            return errorHandler(err);
        }
    },

    async fetchMoreData(movie_id) {
        
    },
}

const errorHandler = (err) => {
    console.log(err);
};

export default MoviesService;
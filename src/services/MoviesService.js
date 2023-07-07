import axios from 'axios';

const API_CALL = 'https://moviesboard-back.vercel.app';
const TMDB_CALL = `https://api.themoviedb.org/3/`;
const API_KEY = `?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;

const MoviesService = {
    // PRIVATE API
    async fetchMovies(id, filter, value) {
        let url = `${API_CALL}/movies?_sort=id&_order=desc`;

        if (id) {
            url = `${API_CALL}/movies/${id}`;
        }

        else if (filter && value) {
            url = `${API_CALL}/movies?${filter}=${value}`;
        }

        try {
            const response = await axios
                .get(url);

            return response.data;

        } catch (err) {
            console.log(err)
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
    update(movie, id) {
        return axios
            .put(`${API_CALL}/movies/${id}`, movie)
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
    }
}

const errorHandler = (err) => {
    console.log(err);
    return "error";
};

export default MoviesService;
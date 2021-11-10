import axios from 'axios';

const API_CALL = 'http://localhost:3000';
const TMDB_CALL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;

const MoviesService = {
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

    async fetchMovieData(id) {
        let url = `${TMDB_CALL}&query=Venom`;

        if (id) {
            url += `${TMDB_CALL}/${id}-venom`;
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
};

export default MoviesService;
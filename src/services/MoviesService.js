import axios from 'axios';

const API_CALL = 'http://localhost:3000';

const MoviesService = {
    async fetchMovies() {
        let url = `${API_CALL}/movies`;
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
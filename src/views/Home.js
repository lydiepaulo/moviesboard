import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MoviesService from '../services/MoviesService';
import Card from '../components/Card';

const Home = () => {
    const [myMovies, setMyMovies] = useState(null);

    useEffect(() => {
        MoviesService.fetchMovies()
            .then((myApiResult) => {
                setMyMovies(myApiResult);
            });
    }, []);

    console.log(myMovies);

    return (
        <div class="pages-background">
            <Navbar />
            <main className="home-main">
                <h1 className="title-large">Test</h1>
                <div className="home__horizontal-scroll">
                    {myMovies &&
                        myMovies.map((data) => (
                            <Card key={data.id} id={data.id} data={data} />
                        ))
                    }
                </div>
            </main>
        </div>
    );
};

export default Home;
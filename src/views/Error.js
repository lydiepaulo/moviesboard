import React from 'react';
import Navbar from '../components/Navbar';

const Error = () => {
    return (
        <div className="pages-background">
            <Navbar />
            <h1 className="title-large">
                <span>404</span>
                <span>Erreur</span>
            </h1>            
        </div>
    );
};

export default Error;
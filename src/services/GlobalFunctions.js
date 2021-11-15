const GlobalFunctions = {

    formatDate(str){
        const options = {
            year: "numeric",
            month:"long",
            day:"numeric"
        };
        const dateAndHour = new Date(str).toLocaleString('fr-FR', options);

        return dateAndHour;
    }
};

export default GlobalFunctions;
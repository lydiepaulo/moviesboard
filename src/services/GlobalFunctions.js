const GlobalFunctions = {

    formatDate(string) {
        const dateAndHour = new Date(string).toLocaleString('fr-FR').slice(0, -3).replace(/:/g, "h");
        return dateAndHour;
    },

    headerScroll() {
        let departScroll = window.pageYOffset;

        window.onscroll = function () {
            let currentScrollpos = window.pageYOffset;

            if (window.innerWidth > 480) {
                if (window.pageYOffset === 0) {
                    document.getElementById("nav").style.top = "0";
                    document.getElementById("nav").classList.remove('nav-apparate');
                }
                else if (departScroll > currentScrollpos) {
                    document.getElementById("nav").style.top = "0";
                }
                else {
                    document.getElementById("nav").style.top = "-84px";
                    document.getElementById("nav").classList.add('nav-apparate');
                }
                departScroll = currentScrollpos;
            }
        }
    }
};

export default GlobalFunctions;
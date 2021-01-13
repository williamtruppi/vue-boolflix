let app = new Vue ({

  el: ".wrapper",

  data: {
    searchArray: [],
    moviePoster: "",
    movieInput: "",
    moveRating: null,
  },

  methods: {

    /* Funzione che cerca il film e lo inserisce in un array */
    searchMovies () {
      console.log(this.movieInput);

      Promise.all([this.getMoviesRequest(), this.getTvShowRequest()])
        .then(values => {
          console.log(values);
          let movieArray = values[0].data.results;
          let tvShowArray = values[1].data.results;
          console.log(movieArray);
          console.log(tvShowArray);
          this.searchArray = tvShowArray.concat(movieArray);

          /* ciclo che inserisce il valore di original_language nell'api di COUNTRY FLAGS */
          this.searchArray.forEach(elem => {
            elem.flagUrl = "";
            return elem.flagUrl = `https://www.countryflags.io/${elem.original_language}/flat/64.png`;
          })
          
          this.voteToStars();
          this.completePosterUrl();
          console.log(this.searchArray);

      });
    },

    completePosterUrl () {
      this.searchArray.forEach(elem => {
        elem.imageURL = "";
        return elem.imageURL = `https://image.tmdb.org/t/p/w92${elem.poster_path}`
      })
    },

    /* funzione che ottiene la chiamata all'API movies */
    getMoviesRequest (){
      return axios.get(`https://api.themoviedb.org/3/search/movie?api_key=3030b6d5014e4fc8b4997cc050050d0a&language=it-IT&query=${this.movieInput}`);
    },

    /* funzione che ottiene la chiamata all'API Tv Show */
    getTvShowRequest (){
      return axios.get(`https://api.themoviedb.org/3/search/tv?api_key=3030b6d5014e4fc8b4997cc050050d0a&language=it-IT&query=${this.movieInput}`);
    },

    /* funzione che trasforma il voto da 1 a 5 e crea un array di stelline da stampare */
    voteToStars () {
      this.searchArray.forEach(elem =>{
        this.moveRating = Math.ceil(elem.vote_average);
        /* console.log(this.moveRating); */
        
        let votein5 = Math.floor((this.moveRating * 5) / 10);
        /* console.log(votein5); */

        elem.voteInStars = [];
        /* console.log(this.searchArray); */
        for(let i = 0; i < 5; i++){
          if (i < votein5){
            elem.voteInStars.push("full");
          } else {
            elem.voteInStars.push("empty");
          }
        }
      })
    }
  },



})
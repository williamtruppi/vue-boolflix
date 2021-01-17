let app = new Vue ({

  el: ".wrapper",

  data: {
    searchArray: [],
    moviePoster: "",
    movieInput: "",
    moveRating: null,
    movieGenres: [],
    tvGenres: [],
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
          
          /* ciclo che verifica se un oggetto è un film o serie tv ed applica, poi, la relativa funzione */
          this.searchArray.forEach(elem => {
            if (elem.hasOwnProperty("original_name")) {
              this.getTVCast(elem.id, elem);
              this.getTvGenres(elem.genre_ids);
            } else if(elem.hasOwnProperty("original_title")){
              this.getMovieCast(elem.id, elem);
              this.getMovieGenres(elem.genre_ids);
            }
          })
       
          this.voteToStars();
          this.completePosterUrl();
          console.log(this.searchArray);

      });
    },

    completePosterUrl () {
      this.searchArray.forEach(elem => {
        elem.imageURL = "";
          return elem.imageURL = `https://image.tmdb.org/t/p/w342${elem.poster_path}`
      })
    },
    
    getMovieCast (elem_id, elem) {
          let movieCastArray = [];
          axios.get(`https://api.themoviedb.org/3/movie/${elem_id}/credits?api_key=3030b6d5014e4fc8b4997cc050050d0a`)
          .then(response => {   
            let tempCast = response.data.cast;  
            if(tempCast && tempCast.length > 0){
              for(let i = 0; i < 5; i++){
                movieCastArray.push(tempCast[i].name);
              }
            } else {
              movieCastArray.push("no cast");
            }
          })
          .catch((error) => {
              console.log(error);
          });
          Vue.set(elem, "cast", movieCastArray);
          /* avengers endgame */
    },

    getTVCast (elem_id, elem) {
          let tvCastArray = [];
          axios.get(`https://api.themoviedb.org/3/tv/${elem_id}/credits?api_key=3030b6d5014e4fc8b4997cc050050d0a`)
          .then(response => {   
            let tempCast = response.data.cast;  
            if(tempCast && tempCast.length > 0){
              for(let i = 0; i < 5; i++){
                tvCastArray.push(tempCast[i].name);
              }
            } else {
              tvCastArray.push("no cast");
            }
          })
          .catch((error) => {
              console.log(error);
          });
          Vue.set(elem, "cast", tvCastArray);
          /* avengers endgame */
    },

    getMovieGenres (elem_genre_ids) {
      axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=3030b6d5014e4fc8b4997cc050050d0a&language=it-IT`)
        .then(response => {  
        let genresName = [];
        let tempGenres = response.data.genres;
   /*      console.log(tempGenres);
        console.log(elem_genre_ids); */
        tempGenres.forEach(item => {
          if (elem_genre_ids.includes(item.id)){
            genresName.push(item.name);
            /* console.log(genresName); */
          }
        })
        Vue.set(elem_genre_ids, "name", genresName);
      })
    },

    getTvGenres (elem_genre_ids) {
      axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=3030b6d5014e4fc8b4997cc050050d0a&language=it-IT`)
        .then(response => {  
        let genresName = [];
        let tempGenres = response.data.genres;
        /* console.log(tempGenres);
        console.log(elem_genre_ids); */
        tempGenres.forEach(item => {
          if (elem_genre_ids.includes(item.id)){
            genresName.push(item.name);
            /* console.log(genresName); */
          }
        })
        Vue.set(elem_genre_ids, "name", genresName);
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
    },


  },

   mounted () {
    
    }
  
})

$(function () {

  $(window).scroll(function () {
  if ($(window).scrollTop() >= 650) {
    $("#navtest").css('background','#221F20');
  } else {
    $("#navtest").css('background','transparent');
  }
});

});

let app = new Vue ({

  el: ".wrapper",

  data: {
    searchArray: [],
    moviePoster: "",
    movieInput: "",
  },

  methods: {

    searchMovies () {
      console.log(this.movieInput);
      axios.get(`https://api.themoviedb.org/3/search/movie?api_key=3030b6d5014e4fc8b4997cc050050d0a&language=it-IT&query=${this.movieInput}`)
      .then(response => {    
        console.log(response.data.results);
        this.searchArray = response.data.results;
        console.log(this.searchArray);
      })
    }
  }
})
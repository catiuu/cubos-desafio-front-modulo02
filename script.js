const body = document.querySelector("body");
const movies = document.querySelector(".movies");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const input = document.querySelector(".input");
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal__close");
const modalTitle = document.querySelector(".modal__title");
const modalImg = document.querySelector(".modal__img");
const modalDescription = document.querySelector(".modal__description");
const modalGenres = document.querySelector(".modal__genres");
const modalAverage = document.querySelector(".modal__average");

let currentPage = 0;
let currentMovies = [];

function createElements() {
  movies.textContent = "";

  for (let i = currentPage * 5; i < (currentPage + 1) * 5; i++) {
    const movie = currentMovies[i];

    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie");
    movieContainer.style.backgroundImage = `url('${movie.poster_path}')`;

    movieContainer.addEventListener("click", function () {
      loadMovie(movie.id);
    });

    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie__info");

    const title = document.createElement("span");
    title.classList.add("movie__title");
    title.textContent = movie.title;

    const rating = document.createElement("span");
    rating.classList.add("movie__rating");

    const img = document.createElement("img");
    img.src = "./assets/estrela.svg";
    img.alt = "Estrela";

    rating.append(img, movie.vote_average);
    movieInfo.append(title, rating);
    movieContainer.append(movieInfo);
    movies.append(movieContainer);
  }
}

function loadMovies() {
  fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
  ).then((response) => {
    const promiseBody = response.json();
    promiseBody.then((body) => {
      currentMovies = body.results;
      createElements();
    });
  });
}

btnPrev.addEventListener("click", function () {
  if (currentPage === 0) {
    currentPage = 3;
  } else {
    currentPage--;
  }
  createElements();
});

btnNext.addEventListener("click", function () {
  if (currentPage === 3) {
    currentPage = 0;
  } else {
    currentPage++;
  }
  createElements();
});

function search() {
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    currentPage = 0;

    if (!input.value) {
      return loadMovies();
    }

    fetch(
      `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`
    ).then((response) => {
      const promiseBody = response.json();
      promiseBody.then((body) => {
        currentMovies = body.results;
        createElements();
      });
    });
    input.value = "";
  });
}

function loadHighlight() {
  fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
  ).then((resposta) => {
    const promiseDoBody = resposta.json();
    promiseDoBody.then((body) => {
      const {
        backdrop_path,
        title,
        vote_average,
        genres,
        release_date,
        overview,
      } = body;

      const highlightVideo = document.querySelector(".highlight__video");
      highlightVideo.style.background = `linear-gradient(rgba(0, 0, 0, 0.6) 100%, rgba(0, 0, 0, 0.6) 100%), url(${backdrop_path}) no-repeat center / cover`;

      const highlightTitle = document.querySelector(".highlight__title");
      highlightTitle.textContent = title;

      const highlightRating = document.querySelector(".highlight__rating");
      highlightRating.textContent = vote_average;

      const highlighGenres = document.querySelector(".highlight__genres");
      highlighGenres.textContent = genres.map((genre) => genre.name).join(", ");

      const highlightLaunch = document.querySelector(".highlight__launch");
      highlightLaunch.textContent = new Date(release_date).toLocaleDateString(
        "pt-BR",
        { year: "numeric", month: "long", day: "numeric" }
      );

      const highlightDescription = document.querySelector(
        ".highlight__description"
      );
      highlightDescription.textContent = overview;
    });
  });
}

function linkVideo() {
  fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
  ).then((response) => {
    const promiseBody = response.json();
    promiseBody.then((body) => {
      const key = body.results[0].key;
      const highlightLink = document.querySelector(".highlight__video-link");
      highlightLink.href = `${"https://www.youtube.com/watch?v=" + key}`;
    });
  });
}

function loadMovie(id) {
  modal.classList.remove("hidden");
  body.style.overflow = "none";
  fetch(
    `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`
  ).then((response) => {
    const promiseBody = response.json();
    promiseBody.then((body) => {
      modalTitle.textContent = body.title;
      modalImg.src = body.backdrop_path;
      modalImg.alt = body.title;
      modalDescription.textContent = body.overview;
      modalAverage.textContent = body.vote_average;

      modalGenres.textContent = "";

      body.genres.forEach(function (genre) {
        const modalGenre = document.createElement("span");
        modalGenre.textContent = genre.name;
        modalGenre.classList.add("modal__genre");

        modalGenres.append(modalGenre);
      });
    });
  });
}

function closeModal() {
  modal.classList.add("hidden");
  body.style.overflow = "auto";
}

modal.addEventListener("click", closeModal);

modalClose.addEventListener("click", closeModal);

loadMovies();
search();
loadHighlight();
linkVideo();

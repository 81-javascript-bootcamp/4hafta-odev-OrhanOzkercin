import data from './data.js';
import { searchMovieByTitle, makeBgActive } from './helpers.js';

class MoviesApp {
  constructor(options) {
    const { root, searchInput, searchForm, yearHandler, yearSubmitter, genreSubmitter } = options;
    this.$tableEl = document.getElementById(root);
    this.$tbodyEl = this.$tableEl.querySelector('tbody');
    this.$filterYearContainer = document.querySelector('.year-inputs-container');
    this.$filterGenreContainer = document.querySelector('.genre-inputs-container');

    this.$searchInput = document.getElementById(searchInput);
    this.$searchForm = document.getElementById(searchForm);
    this.yearHandler = yearHandler;
    this.$yearSubmitter = document.getElementById(yearSubmitter);
    this.$genreSubmitter = document.getElementById(genreSubmitter);
  }

  createMovieEl(movie) {
    const { image, title, genre, year, id } = movie;
    return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`;
  }

  fillYearFilterOptions = () => {
    const movieYears = [];
    data.forEach((movie, index) => {
      if (index === 0) {
        movieYears.push({ data: movie.year, length: 1 });
      } else {
        const existYear = movieYears.find((year) => year.data == movie.year);
        if (existYear) {
          existYear.length++;
        } else {
          movieYears.push({ data: movie.year, length: 1 });
        }
      }
    });

    movieYears.forEach((year) => {
      this.$filterYearContainer.innerHTML += `<div class="form-check ">
        <input class="form-check-input" type="radio" name="year" id="year1" value=${year.data} />
        <label class="form-check-label" for="year1"> ${year.data} </label>
        <span class="badge ">${year.length}</span>
        </div>`;
    });
  };

  fillGenreFilterOptions = () => {
    const genres = [];
    data.forEach((movie, index) => {
      if (index === 0) {
        genres.push({ data: movie.genre, length: 1 });
      } else {
        const existYear = genres.find((genre) => genre.data == movie.genre);
        if (existYear) {
          existYear.length++;
        } else {
          genres.push({ data: movie.genre, length: 1 });
        }
      }
    });

    genres.forEach((genre) => {
      this.$filterGenreContainer.innerHTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value=${genre.data} id=${genre.data} />
                <label class="form-check-label" for=${genre.data}> ${genre.data} </label>
                <span class="badge ">${genre.length}</span>
            </div>`;
    });
  };

  fillTable() {
    /* const moviesHTML = data.reduce((acc, cur) => {
            return acc + this.createMovieEl(cur);
        }, "");*/
    const moviesArr = data
      .map((movie) => {
        return this.createMovieEl(movie);
      })
      .join('');
    this.$tbodyEl.innerHTML = moviesArr;
  }

  reset() {
    this.$tbodyEl.querySelectorAll('tr').forEach((item) => {
      item.style.background = 'transparent';
    });
  }

  handleSearch() {
    this.$searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.reset();
      const searchValue = this.$searchInput.value;
      data
        .filter((movie) => {
          return searchMovieByTitle(movie, searchValue);
        })
        .forEach(makeBgActive);
      this.$searchInput.value = '';
    });
  }

  handleYearFilter() {
    this.$yearSubmitter.addEventListener('click', () => {
      this.reset();
      const selectedYear = document.querySelector(`input[name='${this.yearHandler}']:checked`).value;
      data
        .filter((movie) => {
          return movie.year === selectedYear;
        })
        .forEach(makeBgActive);
    });
  }

  handleGenreFilter() {
    this.$genreSubmitter.addEventListener('click', () => {
      this.reset();
      const selectedGenres = document.querySelectorAll(`input[type='checkbox']:checked`);
      selectedGenres.forEach((item) => {
        data
          .filter((movie) => {
            return movie.genre === item.value;
          })
          .forEach(makeBgActive);
      });
    });
  }

  init() {
    this.fillTable();
    this.fillYearFilterOptions();
    this.fillGenreFilterOptions();
    this.handleSearch();
    this.handleYearFilter();
    this.handleGenreFilter();
  }
}

let myMoviesApp = new MoviesApp({
  root: 'movies-table',
  searchInput: 'searchInput',
  searchForm: 'searchForm',
  yearHandler: 'year',
  yearSubmitter: 'yearSubmitter',
  genreSubmitter: 'genreSubmitter',
});

myMoviesApp.init();

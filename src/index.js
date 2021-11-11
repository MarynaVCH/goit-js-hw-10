import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
// import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchbox: document.querySelector('#search-box'),
  country: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.searchbox.addEventListener('input', debounce(inputCountry, DEBOUNCE_DELAY));

function inputCountry() {
  createMarkup();
  const value = refs.searchbox.value.trim();
  if (!value) {
    return;
  }

  fetchCountries(value)
    .then(response => {
      if (!response.ok) {
        throw Notify.failure('Oops, there is no country with that name');
      }
      return response.json();
    })
    .then(countries => {
      if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      if (countries.length >= 2 && countries.length <= 10) {
        return countryList(countries);
      }
      if (countries.length === 1) {
        return countryCard(countries);
      }
    })
    .catch(console.log);
}

function createMarkup() {
  refs.country.innerHTML = '';
  refs.info.innerHTML = '';
}

function countryCard(country) {
  const { flags, name, capital, languages, population } = country[0];
  const language = Object.values(languages).join(', ');
  return (refs.info.innerHTML = `
<h1><img src="${flags.svg}" alt="${name.official} width="30" height="20"">${name.official}</h1>
<ul>
<li class="country-list"><b>Capital:</b><span>${capital}</span></li>
<li class="country-list"><b>Population:</b><span>${population}</span></li>
<li class="country-list"><b>Languages:</b><span >${language}</span></li>
</ul>`);
}

function countryList(countries) {
  refs.country.innerHTML = countries
    .map(
      ({ name, flags }) => `<li>
<img src="${flags.svg}" alt="${name.official} width="30" height="20">
<span>${name.official}</span>
</li>`,
    )
    .join('');
}

import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const bodyEl = document.querySelector('body');
const inputEl = document.getElementById('search-box');
const countryListEl = document.getElementById('country-list');
const countryInfoEl = document.getElementById('country-info');

inputEl.addEventListener('input', _.debounce(searchCountry, DEBOUNCE_DELAY));
countryListEl.addEventListener('click', chooseCountry);

function chooseCountry(event) {
  if (event.target.nodeName !== 'LI') {
    return;
  }
  const countryName = event.target.textContent;
  inputEl.value = countryName;
  inputEl.focus();
}

function searchCountry(event) {
  fetchCountries(event.target.value.trim())
    .then(countryList => {
      if (countryList.length > 10) {
        Notify.info(
          ` Too many matches found. Please enter a more specific name.`
        );
        clineMarkUp(countryListEl);
        clineMarkUp(countryInfoEl);
        return;
      } else if (countryList.length !== 1) {
        return markUpListOfCountries(countryList);
      } else if (countryList.length === 1) {
        markUpCountryInformation(countryList);
      }
    })
    .catch(() => {
      clineMarkUp(countryInfoEl);
      clineMarkUp(countryListEl);
      Notify.failure(` "Oops, there is no country with that name" `);
    });
}

function markUpListOfCountries(countryList) {
  clineMarkUp(countryInfoEl);

  const list = countryList.reduce((acc, { name, flags }) => {
    acc += `<li><img src="${flags.svg}"
  alt= "flag ${name.official}" width='45' height='30'> ${name.official}</li>`;
    return acc;
  }, '');
  countryListEl.insertAdjacentHTML('beforeend', list);
}

function markUpCountryInformation(countryList) {
  const { name, population, flags, languages, capital } = countryList[0];

  clineMarkUp(countryListEl);
  bodyEl.style.backgroundImage = `url(${flags.svg})`;

  countryInfoEl.insertAdjacentHTML(
    'beforeend',
    `<img src="${flags.svg}"
  alt= "flag ${name.official}" width='90' height='90'>
  <h2>${name.official}</h2>
  <h3>Population : ${population}</h3
  <h3>Capital : ${capital}</h3>
  <h3>Languages : ${Object.values(languages).join(', ')}</h3>
  `
  );
}

function clineMarkUp(element) {
  element.innerHTML = '';
  bodyEl.style.background = 'none';
}

import { theme } from './modules/theme.js';
window.addEventListener('DOMContentLoaded', () => {
  theme();
  const $countriesLoader = document.getElementById('countriesLoader');
  const $containerContries = document.getElementById('containerCountries');
  const $countryTemplate = document.getElementById('countryTemplate').content.querySelector('.main__country');
  const $select = document.getElementById('select');
  const $searchInput = document.getElementById('searchInput');
  const $modal = document.getElementById('modal');
  const $containerInputs = document.querySelector('.main__container-top')
  let countries = null;

  // This function sets the num given with dots.
  function formatNumber(num) {
    const str = num.toString().split('.');
    if (str[0].length >= 5) str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1.');
    if (str[1] && str[1].length >= 5) str[1] = str[1].replace(/(\d{3})/g, '$1.');
    return str.join('.');
  }

  // This function filters the countries depending on the value of the search input and the select value.
  const filter = () => {
    countries.forEach(country => {
      const $country = document.querySelector(`[data-country="${country.name.common}"`);
      const searchValue = $searchInput.value.trim().toLowerCase();
      const countryName = country.name.common?.trim().toLowerCase();
      const countryRegion = country.region.trim().toLowerCase();
      const selectValue = $select.value === 'All' ? 'africa asia america europe oceania' : $select.value.trim().toLowerCase();
      countryName.startsWith(searchValue) && selectValue.includes(countryRegion) ? $country.classList.remove('hide-country') : $country.classList.add('hide-country');
    });
  };

  // This function renders the countries that we get from the request.
  const renderCountries = () => {
    const fragment = new DocumentFragment();
    countries.forEach(({ name, population, capital, region, flags }) => {
      const $newCountry = $countryTemplate.cloneNode(true);
      const [$population, $region, $capital] = $newCountry.querySelectorAll('li');
      $newCountry.setAttribute('data-country', name.common);
      $newCountry.querySelector('[data-id="name"]').textContent = name.common;
      $newCountry.querySelector('[data-id="flag"]').src = flags.png;
      $region.querySelectorAll('span')[1].textContent = region;
      $population.querySelectorAll('span')[1].textContent = formatNumber(population);

      if (capital) $capital.querySelectorAll('span')[1].textContent = `${capital.join(', ')}`;
      fragment.append($newCountry);
    });
    $countriesLoader.classList.add('hide');
    $containerContries.append(fragment);
  };


  // Request for the countries
  (async () => {
    try {     
      $countriesLoader.classList.remove('hide');
      const request = await fetch('https://restcountries.com/v3.1/all');
      if (!request.ok) throw request;
      countries = await request.json();
      renderCountries()
    } catch (err) {
      document.getElementById('h2Error').textContent = `Error: ${err.status}`;
      document.getElementById('h2Error').classList.remove('hide');
      console.error(err);
    }
  })();


  // This function will find the country by the find method and will render it in a modal
  const renderModal = (value, property) => {
    $modal.classList.remove('hide');
    $containerContries.classList.add('hide');
    $containerInputs.classList.add('hide')

    let country = null;
    property === 'name' ? (country = countries.find(({ name }) => value === name.common)) : (country = countries.find(({ cca3 }) => value === cca3));
    const { name, population, region, subregion, tld, currencies, languages, capital, flags, borders } = country;

    $modal.querySelector('[data-id="modal-flag"]').src = flags.svg;
    $modal.querySelector('[data-id="modal-flag"]').alt = name.common;
    $modal.querySelector('[data-id="modal-name"]').textContent = name.common;
    $modal.querySelector('[data-id="modal-nativeName"]').textContent = name.nativeName.common ?? 'Unknown';
    $modal.querySelector('[data-id="modal-population"]').textContent = formatNumber(population);
    $modal.querySelector('[data-id="modal-region"]').textContent = region;
    $modal.querySelector('[data-id="modal-subregion"]').textContent = subregion;
    $modal.querySelector('[data-id="modal-domain"]').textContent = tld.join(', ');
    $modal.querySelector('[data-id="modal-currencies"]').textContent = Object.values(Object.values(currencies))[0].name;
    $modal.querySelector('[data-id="modal-domain"]').textContent = tld.join(', ');
    $modal.querySelector('[data-id="modal-languages"]').textContent = languages ? Object.values(languages).join(', ') : '';
    $modal.querySelector('[data-id="modal-capital"]').textContent = capital?.join(', ') ?? '';

    if (borders) {
      const fragment = new DocumentFragment();
      borders.forEach(border => {
        const $newSpan = document.createElement('span');
        $newSpan.classList.add('main__modal-border-country');
        $newSpan.setAttribute('data-cca3', border);
        $newSpan.textContent = border;
        fragment.append($newSpan);
      });
      $modal.querySelector('[data-id="border-countries-ul"]').replaceChildren(fragment);
    }
  };

  // Events 
  $select.addEventListener('input', filter);
  $searchInput.addEventListener('input', filter);
  $containerContries.addEventListener('click', e => renderModal(e.target.dataset.country, 'name'));
  $modal.addEventListener('click', e => {
    if (e.target.matches('#backBtn')) {
      $modal.classList.add('hide');
      $containerContries.classList.remove('hide');
      $containerInputs.classList.remove('hide')
    } else if (e.target.matches('.main__modal-border-country')) renderModal(e.target.dataset.cca3, 'cca3');
  });
});

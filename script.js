var URL = 'https://restcountries.eu/rest/v2/all';
var countries = [];

let currentPage = 1;
let recordsPerPage = 5;

var sortFlag = true;

renderCountries(currentPage);

async function fetchData() {
  try {
    let response = await fetch(URL);
    let data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function renderCountries (currentPage) {
  var allCountriesData = await fetchData();
  countries = allCountriesData.map((country, index) => [ index, country.name, country.alpha3Code, country.capital || '-', country.population || 0, country.area || 0 ]);
  changePage(currentPage);
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    changePage(currentPage);
  }
}

function nextPage() {
  if (currentPage < numPages()) {
    currentPage++;
    changePage(currentPage);
  }
}

function compare(index, type) {
  sortFlag = !sortFlag;
  return function(a, b) {
    if (type === 'desc') {
      return a[index] < b[index] ? 1 : a[index] > b[index] ? -1 : 0;
    } else {
      return a[index] < b[index] ? -1 : a[index] > b[index] ? 1 : 0;
    }
  };
}

function sortBy(index) {
  if (sortFlag) {
    countries = countries.sort(compare(index, 'desc'));
  } else {
    countries = countries.sort(compare(index, 'asc'));
  }
  changePage(currentPage);
}

function changePage(page) {
  let btnNext = document.getElementById("btn-next");
  let btnPrev = document.getElementById("btn-prev");
  let table = document.getElementById('countries-body');
  let page_span = document.getElementById("page");

  if (page < 1) page = 1;
  if (page > numPages()) page = numPages();

  table.innerHTML = "";

  for (var i = (page-1) * recordsPerPage; i < (page * recordsPerPage) && i < countries.length; i++) {
    let row = document.createElement('tr');
    for (var j = 0; j < 6; j++) {
      let cell = document.createElement('td');
      cell.innerHTML = countries[i][j];
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  page_span.innerHTML = page + " /" + numPages();

  if (page == 1) {
      btnPrev.style.visibility = "hidden";
  } else {
      btnPrev.style.visibility = "visible";
  }

  if (page == numPages()) {
      btnNext.style.visibility = "hidden";
  } else {
      btnNext.style.visibility = "visible";
  }
}

function numPages() {
  return Math.ceil(countries.length / recordsPerPage);
}

function changeEntry (value) {
  recordsPerPage = value;
  renderCountries(currentPage);
}

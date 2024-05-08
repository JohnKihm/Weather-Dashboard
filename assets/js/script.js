const APIKey = '2e9e578d780591495092dea32c4a362d';
const inputFormEl = $('#form');
const recentSearchesContainer = $('recent-searches');
const currentConditionsContainer = $('#current-conditions');
const forecastContainer = $('#five-day-forecast');

function handleFormSubmit(event) {
    event.preventDefault();

    const cityInput = $('#city').val().trim();
    console.log(cityInput);
    const searchQuery = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${APIKey}`;

    fetch(searchQuery)
        .then(function (response) {
            if (!response.ok) {
                alert(response.status + ' ' + response.statusText);
                return;
            }
            return response.json();
        })
        .then(function (searchResult) {
            console.log(searchResult);
            console.log(searchResult[0].lat);
            console.log(searchResult[0].lon);

            const newCity = searchResult[0];
            console.log(newCity);
            console.log(newCity.lat);
            console.log(newCity.lon);
            //const cities = loadRecentSearches();
            //cities.push(newCity);
            //saveRecentSearches(cities);
            displayCurrentWeather(newCity);
            displayForecast(newCity);
            //displayRecentSearches();
        })
}

function displayCurrentWeather(city) {
    const searchQuery = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${APIKey}&units=imperial`;

    fetch(searchQuery)
        .then(function (response) {
            if (!response.ok) {
                alert(response.status + ' ' + response.statusText);
                return;
            }
            return response.json();
        })
        .then(function (searchResult) {
            console.log(searchResult);
        })
}

function displayForecast(city) {
    const searchQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${APIKey}&units=imperial`;

    fetch(searchQuery)
        .then(function (response) {
            if (!response.ok) {
                alert(response.status + ' ' + response.statusText);
                return;
            }
            return response.json();
        })
        .then(function (searchResult) {
            console.log(searchResult);
        })
}

inputFormEl.on('submit', handleFormSubmit);
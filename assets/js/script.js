const APIKey = '2e9e578d780591495092dea32c4a362d';
const inputFormEl = $('#form');
const recentSearchesContainer = $('recent-searches');
const currentWeatherContainer = $('#current-weather');
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
            const newCity = searchResult[0];
            //const cities = loadRecentSearches();
            //cities.push(newCity);
            //saveRecentSearches(cities);
            displayCurrentWeather(newCity);
            //displayForecast(newCity);
            //displayRecentSearches();
        })
    $('#city').val('');
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
            currentWeatherContainer.empty();

            const iconURL = `https://openweathermap.org/img/wn/${searchResult.weather[0].icon}@2x.png`;
            const date = dayjs.unix(searchResult.dt).format('M/D/YYYY');

            const weatherDisplay = $('<div>');
            const displayHeader = $('<div>');
            const headerText = $('<h2>').text(`${searchResult.name} (${date})`);
            const weatherIcon = $('<img>').attr('src', iconURL);
            const displayBody = $('<ul>');
            const displayTemp = $('<li>').text(`Temp: ${searchResult.main.temp}°F`);
            const displayWind = $('<li>').text(`Wind: ${searchResult.wind.speed} MPH`);
            const displayHumidity = $('<li>').text(`Humidity: ${searchResult.main.humidity}%`);

            displayHeader.append(headerText, weatherIcon);
            displayBody.append(displayTemp, displayWind, displayHumidity);
            weatherDisplay.append(displayHeader, displayBody);
            currentWeatherContainer.append(weatherDisplay);
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
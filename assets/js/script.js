const APIKey = '2e9e578d780591495092dea32c4a362d';
const inputFormEl = $('#form');
const recentSearchesContainer = $('#recent-searches');
const currentWeatherContainer = $('#current-weather');
const forecastContainer = $('#forecast');

function loadRecentSearches() {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches'));
    if (!recentSearches) {
        recentSearches = [];
    }
    return recentSearches;
}

function saveRecentSearches(recentSearches) {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

function handleFormSubmit(event) {
    event.preventDefault();

    const cityInput = $('#city').val().trim();
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
            displayCurrentWeather(newCity);
            displayForecast(newCity);
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
            const date = dayjs.unix(searchResult.dt).format('M/D/YYYY h:mm A');

            const weatherDisplay = $('<div>').addClass('border border-3 p-2');
            const displayHeader = $('<ul>').addClass('list-inline weather-header');
            const displayCity = $('<li>').addClass('list-inline-item').text(searchResult.name);
            const displayDate = $('<li>').addClass('list-inline-item').text(`(${date})`);
            const weatherIcon = $('<img>').addClass('list-inline-item').attr('src', iconURL);
            const displayBody = $('<ul>').addClass('list-unstyled h4');
            const displayTemp = $('<li>').addClass('mb-3').text(`Temp: ${searchResult.main.temp}°F`);
            const displayWind = $('<li>').addClass('mb-3').text(`Wind: ${searchResult.wind.speed} MPH`);
            const displayHumidity = $('<li>').text(`Humidity: ${searchResult.main.humidity}%`);

            displayHeader.append(displayCity, displayDate, weatherIcon);
            displayBody.append(displayTemp, displayWind, displayHumidity);
            weatherDisplay.append(displayHeader, displayBody);
            currentWeatherContainer.append(weatherDisplay);

            city.name = searchResult.name;
            const recentSearches = loadRecentSearches();
            for (search of recentSearches) {
                if (city.name === search.name) {
                    return;
                }
            }
            recentSearches.push(city);
            saveRecentSearches(recentSearches);
            displayRecentSearches();
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
            const timeOfDay = searchResult.list[39].dt_txt.split(' ')[1];
            forecastContainer.empty();
            const days = [];

            for (item of searchResult.list) {
                if (item.dt_txt.split(' ')[1] === timeOfDay) {
                    days.push(item);
                }
            }

            $('#forecast-header').text('5-Day Forecast:');

            for (day of days) {
                const iconURL = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
                const date = dayjs.unix(day.dt).format('M/D/YYYY');
                const time = dayjs.unix(day.dt).format('h:mm a');
                const forecastCard = $('<div>').addClass('card custom-card px-5 py-3 text-center');
                const cardHeader = $('<div>');
                const cardDate = $('<h4>').text(date);
                const cardTime = $('<h4>').text(time);
                const weatherIcon = $('<img>').attr('src', iconURL);
                const cardBody = $('<ul>').addClass('list-unstyled');
                const cardTemp = $('<li>').text(`Temp: ${day.main.temp}°F`);
                const cardWind = $('<li>').text(`Wind: ${day.wind.speed} MPH`);
                const cardHumidity = $('<li>').text(`Humidity: ${day.main.humidity}%`);

                cardHeader.append(cardDate, cardTime, weatherIcon);
                cardBody.append(cardTemp, cardWind, cardHumidity);
                forecastCard.append(cardHeader, cardBody);
                forecastContainer.append(forecastCard);
            }
        })
}

function displayRecentSearches() {
    recentSearchesContainer.empty();
    const cities = loadRecentSearches();

    for (city of cities) {
        const recentSearchButton = $('<btn>').addClass('btn custom-btn form-control my-1').text(city.name).attr('data-city-name', city.name);
        recentSearchButton.on('click', resubmitRecentSearch);
        recentSearchesContainer.append(recentSearchButton);
    }
}

function resubmitRecentSearch() {
    const cityName = $(this).attr('data-city-name');
    const cities = loadRecentSearches();
    
    for (city of cities) {
        if (cityName === city.name) {
            displayCurrentWeather(city);
            displayForecast(city);
        }
    }
}

displayRecentSearches();

inputFormEl.on('submit', handleFormSubmit);
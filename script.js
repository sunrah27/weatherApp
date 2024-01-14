document.addEventListener('DOMContentLoaded', () => {
    function setBodyHeightToViewportHeight() {
        document.body.style.height = window.innerHeight + 'px';
    }
    setBodyHeightToViewportHeight();
    window.addEventListener('resize', setBodyHeightToViewportHeight);

    const apiKey = "60845a864801beea747cb04a9eda31d6";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

    const searchBox = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const weatherIcon = document.getElementById('weatherIcon');
    const tempHeader = document.getElementById('tempHeader');
    const weatherDescription = document.getElementById('weatherDescription');
    const minTemp = document.getElementById('minTemp');
    const feelTemp = document.getElementById('feelTemp');
    const maxTemp = document.getElementById('maxTemp');
    const cityHeader = document.getElementById('cityHeader');
    const humidity = document.getElementById('humidity');
    const windSpeed =  document.getElementById('windSpeed')
    var apiData;

    async function checkWeather(city){
        try {
            const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
            apiData = await response.json();
            updateWeatherCard(apiData);
        } catch (error) {
            console.error('Error fetching API data:', error.message);
        }
    }

    function updateWeatherCard(apiData) {
        weatherIcon.src = `${getWeatherIconUrl(apiData.weather[0].id)}`;
        weatherIcon.alt = apiData.weather[0].main;
        tempHeader.innerText = Math.round(apiData.main.temp) + "°c";
        weatherDescription.innerText = apiData.weather[0].main;
        minTemp.innerText = Math.round(apiData.main.temp_min) + "°c";
        feelTemp.innerText = Math.round(apiData.main.feels_like) + "°c";
        maxTemp.innerText = Math.round(apiData.main.temp_max) + "°c";
        cityHeader.innerText = apiData.name + ", " + apiData.sys.country;   
        humidity.innerText = apiData.main.humidity + "%";
        windSpeed.innerText = apiData.wind.speed + " m/s";
    }

    function getWeatherIconUrl(id) {
        const weatherIcons = {
            200: ['11d@2x.png'],
            201: ['11d@2x.png'],
            202: ['11d@2x.png'],
            210: ['11d@2x.png'],
            211: ['11d@2x.png'],
            212: ['11d@2x.png'],
            221: ['11d@2x.png'],
            230: ['11d@2x.png'],
            231: ['11d@2x.png'],
            232: ['11d@2x.png'],
            300: ['09d@2x.png'],
            301: ['09d@2x.png'],
            302: ['09d@2x.png'],
            310: ['09d@2x.png'],
            311: ['09d@2x.png'],
            312: ['09d@2x.png'],
            313: ['09d@2x.png'],
            314: ['09d@2x.png'],
            321: ['09d@2x.png'],
            500: ['10d@2x.png'],
            501: ['10d@2x.png'],
            502: ['10d@2x.png'],
            503: ['10d@2x.png'],
            504: ['10d@2x.png'],
            511: ['13d@2x.png'],
            520: ['09d@2x.png'],
            521: ['09d@2x.png'],
            522: ['09d@2x.png'],
            531: ['09d@2x.png'],
            600: ['13d@2x.png'],
            601: ['13d@2x.png'],
            602: ['13d@2x.png'],
            611: ['13d@2x.png'],
            612: ['13d@2x.png'],
            613: ['13d@2x.png'],
            615: ['13d@2x.png'],
            616: ['13d@2x.png'],
            620: ['13d@2x.png'],
            621: ['13d@2x.png'],
            622: ['13d@2x.png'],
            701: ['50d@2x.png'],
            711: ['50d@2x.png'],
            721: ['50d@2x.png'],
            731: ['50d@2x.png'],
            741: ['50d@2x.png'],
            751: ['50d@2x.png'],
            761: ['50d@2x.png'],
            762: ['50d@2x.png'],
            771: ['50d@2x.png'],
            781: ['50d@2x.png'],
            800: ['01d@2x.png'],
            801: ['02d@2x.png'],
            802: ['03d@2x.png'],
            803: ['04d@2x.png'],
            804: ['04d@2x.png']
        };
    
        return `https://openweathermap.org/img/wn/${weatherIcons[id] ? weatherIcons[id][0] : '01d@2x.png'}`;
    }
    

    searchBtn.addEventListener('click', (event) =>{
        event.preventDefault();
        checkWeather(searchBox.value);
    });

    searchBox.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkWeather(searchBox.value);
        }
    });
});
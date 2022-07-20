const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const CurrentWeatherItemsEl = document.getElementById("current-weather-items");
const timeZone = document.getElementById("time-zone");
const contryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const days = [`domingo`,`lunes`,`martes`,`miercoles`,`jueves`,`viernes`,`sabado`];
const months = [`ene`,`feb`,`mar`,`abr`,`mayo`,`jun`,`jul`,`ago`,`sep`,`oct`,`nov`,`dic`];

const API_KEY = `11105b816c22f98f6c8d409720beef1d`;

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? `PM` : `AM`

    timeEl.innerHTML = (hoursIn12HrFormat < 10? `0` + hoursIn12HrFormat : hoursIn12HrFormat) + `:`+ (minutes < 10 ? `0`+ minutes: minutes) + ` ` + `<span id="am-pm">${ampm} </span>`

    dateEl.innerHTML = days[day] + `, ` + date + ` ` + months[month]

}, 1000);


getWeatherData()
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) =>{
        
        let{latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`,).then(res => res.json()).then(data => {
                console.log(data);
                showWeatherData(data);
            })
    })
}


function showWeatherData(data){
    let {humidity, pressure, wind_speed} = data.current;

    timeZone.innerHTML = data.timezone;

    CurrentWeatherItemsEl.innerHTML = 
    `
    <div class="weather-item">
        <div>humedad</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>viento</div>
        <div>${wind_speed}Km/h</div>
    </div>
    <div class="weather-item">
        <div>presion</div>
        <div>${pressure}</div>
    </div>

    `;

    let otherDayforcast =``;
    data.daily.forEach((day, idx) =>{
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format(`ddd`)}</div>
                <div class="temp">noche ${day.temp.night}C</div>
                <div class="temp">dia ${day.temp.day}C</div>
            </div>
            `
        }else{
            otherDayforcast +=`
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format(`ddd`)} </div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">noche ${day.temp.night}C</div>
                <div class="temp">dia  ${day.temp.day}C</div>
        </div>
            `
        }
    })
    weatherForecastEl.innerHTML = otherDayforcast;
}


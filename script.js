const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const tempEl = document.getElementById("temp");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timeZoneEl = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Noviembre",
  "Diciembre",
];

const apiKey = "3fa0f591a653264d619986f2c14b8507";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const minutes = time.getMinutes();
  const minutesok = minutes < 10 ? `0${minutes}` : minutes;
  const hourIn12HsFormat = hour >= 13 ? hour % 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";

  console.log(date);
  timeEl.innerHTML =
    hourIn12HsFormat +
    ":" +
    minutesok +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    const lat = success.coords.latitude;
    const lon = success.coords.longitude;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  const { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  const sunriseDate = new Date(sunrise * 1000);
  const sunriseok =
    sunriseDate.getMinutes() < 10
      ? sunriseDate.getHours() + ":" + `0${sunriseDate.getMinutes()}`
      : sunriseDate.getHours() + ":" + sunriseDate.getMinutes();

  const sunsetDate = new Date(sunset * 1000);
  const sunsetok =
    sunsetDate.getMinutes() < 10
      ? sunsetDate.getHours() + ":" + `0${sunsetDate.getMinutes()}`
      : sunsetDate.getHours() + ":" + sunsetDate.getMinutes();

  timeZoneEl.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + "N" + data.lon + "E";

  currentWeatherItemsEl.innerHTML = `<div class="weather-item">
<div>Temperature</div>
<div>${data.current.temp} &#176;C</div>
</div>
<div class="weather-item">
    <div>Humidity</div>
    <div>${humidity} %</div>
</div>
<div class="weather-item">
    <div>Wind Speed</div>
    <div>${wind_speed}</div>
</div>
<div class="weather-item">
    <div>Sunrise</div>
    <div>${sunriseok} AM</div>
</div>
<div class="weather-item">
    <div>Sunset</div>
    <div>${sunsetok} PM</div>
</div>`;

  let otherDayForecast = "";
  let currenttemp = "";

  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      const dayok = new Date(day.dt * 1000);
      const dayName = days[dayok.getDay()];
      currenttemp += `
        <div class="today" id="current-temp">
        
        <div class="todayName">Today</div>
        <div >
        <div class="items">
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="" class="w-icon">
        <div class="other">
            
            <div class="temp">Day - ${day.temp.day}&#176;C</div>
            <div class="temp">Night -  ${day.temp.night}&#176;C</div>
           
        </div>
        </div>
       
        </div>`;
    } else {
      const dayok = new Date(day.dt * 1000);
      const dayName = days[dayok.getDay()];
      otherDayForecast += `
        <div class="weather-forecast-item">
        <div class="day">${dayName}</div>
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="" class="w-icon">
        <div class="temp">Day - ${day.temp.day}&#176;C</div>
        <div class="temp">Night - ${day.temp.night}&#176;C</div>
        
    </div>`;
    }
  });

  weatherForecastEl.innerHTML = otherDayForecast;
  currentTempEl.innerHTML = currenttemp;
}

getWeatherData();

// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

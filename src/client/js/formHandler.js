/* Run this function below after user press submit button */
const handleSubmit = (event) => {
  event.preventDefault();
  const MS_IN_ONE_DAY = 86400000;
  const locationName = document.getElementById("name").value;
  const comeDay = document.getElementById("day").value;
  const comeMonth = document.getElementById("month").value;
  const comeYear = document.getElementById("year").value;

  /* Validate input if empty show popup require user type all the field */
  if (
    !Client.checkEmptyField(locationName) ||
    !Client.checkEmptyField(comeDay) ||
    !Client.checkEmptyField(comeMonth) ||
    !Client.checkEmptyField(comeYear)
  ) {
    return;
  }
  let apiWeather, apiImage;
  let dateNow = new Date();
  let inputUserDate = new Date();
  let dateResult = new Date();
  inputUserDate.setDate(comeDay);
  inputUserDate.setMonth(comeMonth - 1);
  inputUserDate.setFullYear(comeYear);
  let diff = inputUserDate.getTime() - dateNow.getTime();
  if (diff < 0) {
    alert(
      `The time you come ${locationName} smaller than the present time. Please re-enter!`
    );
    return;
  }
  dateResult.setTime(diff);
  let dayRemaining = diff / MS_IN_ONE_DAY; // 1 day = 86400000 ms

  /* Get key to call api from server localhost */
  const getApiKey = async (url) => {
    try {
      const apiReturn = await fetch(url);
      const apiWeatherAndImage = await apiReturn.json();
      console.log("apiWeatherAndImage:", apiWeatherAndImage);
      apiWeather = apiWeatherAndImage.application_key_weather;
      apiImage = apiWeatherAndImage.application_key_image;
    } catch (err) {
      console.log(err);
    }
  };

  /* Get latitude and longitude of the place visitor will come */
  const getLatLongLocation = async () => {
    try {
      const responseLatLong = await fetch(
        `http://api.geonames.org/searchJSON?q=${locationName}&maxRows=10&username=luunguyen`
      );
      const newData = await responseLatLong.json();
      console.log("new Data:", newData);
      return newData;
    } catch (err) {
      console.log(err);
      return;
    }
  };
  /* Get weather the place after has longitude and latitude */
  const getNameWeather = async (countryName, lat, lng) => {
    console.log("countryName:", countryName);
    console.log("lat:", lat);
    console.log("lng:", lng);
    try {
      if (dayRemaining <= 7) { // If the number of day visitor come smaller or equal 7 day (from day now to day come) 
        const responseWeather = await fetch(
          `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${apiWeather}`
        );
        const weatherData = await responseWeather.json();
        console.log("weatherData:", weatherData);
        const dataAfterGetWeather = {
          place: countryName,
          weatherData: weatherData,
        };
        return dataAfterGetWeather;
      } else { // If the number of day visitor come bigger than 7 day (from day now to day come) 
        const responseWeather = await fetch(
          `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${apiWeather}`
        );
        const weatherData = await responseWeather.json();
        console.log("weatherData:", weatherData);
        const dataAfterGetWeather = {
          place: countryName,
          weatherData: weatherData,
        };
        return dataAfterGetWeather;
      }
    } catch (err) {
      console.log(err);
      return;
    }
  };

  /* Get image of that place */
  const getImageLocation = async (locationName) => { 
    console.log("this locationName:", locationName);
    const imgLocation = await fetch(
      `https://pixabay.com/api/?key=${apiImage}&q=${locationName}&image_type=photo`
    );
    try {
      const responseImg = await imgLocation.json();
      console.log("responseImg:", responseImg);
      document
        .getElementById("locationImg")
        .setAttribute("src", responseImg.hits[0].largeImageURL);
    } catch (err) {
      document
        .getElementById("locationImg")
        .setAttribute("alt", "No photos found for this place!");
      return;
    }
  };

  /* Use the functions defined above */
  getApiKey("http://localhost:8082/APIkey");
  getLatLongLocation().then((data) => {
    console.log("hello data:", data);
    if (data && data.geonames.length) {
      getNameWeather(
        data.geonames[0].toponymName,
        data.geonames[0].lat,
        data.geonames[0].lng
      ).then((dataGetWeather) => {
        console.log("dataGetWeather:", dataGetWeather);
        getImageLocation(dataGetWeather.place);
        document.getElementById("infoShow").innerHTML = `
          <h1>WEATHER FORECAST</h1>
          <div class="container">
            <div class="container__img-and-info">
              <div class="location-img">
                  <img id="locationImg" width="300px" height="200px" alt=' '>
              </div>
              <div class="location-info">
                <div class="location-info__detail">
                    <span>Destination: </span>
                    <div id="locationName"></div>
                </div>
                <div class="location-info__detail">
                    <span>Come day: </span>
                    <div id="commingDateInfo"></div>
                </div>
                <div class="location-info__detail">
                    <span>Number of days left: </span>
                    <div id="remainingDateInfo"></div>
                </div>
              </div>
            </div>
            <div class="temp-and-status"></div>
          </div>
          `;
        if (dayRemaining <= 7) {
          document.querySelector(".temp-and-status").innerHTML = `
            <div class="location-info__detail">
              <span>Average temperature: </span>
              <div id="tempInfo">${dataGetWeather.weatherData.data[0].temp}°C</div>
            </div>
            <div class="location-info__detail">
              <span>Weather status: </span>
              <div id="weatherStatus">${dataGetWeather.weatherData.data[0].weather.description}</div>
            </div>
          `;
        } else {
          let tableBody = "";
          for (let i = 0; i < dataGetWeather.weatherData.data.length; i++) {
            tableBody = tableBody + `<tr class="table-content-row${i}"></tr>`;
          }
          document.querySelector(".temp-and-status").innerHTML = `
            <table>
              <tr>
                <th>Time</th>
                <th>Lowest temperature (°C)</th>
                <th>Highest temperature (°C)</th>
                <th>Weather status</th>
              </tr>
              ${tableBody}
            </table>
            `;
          for (let i = 0; i < dataGetWeather.weatherData.data.length; i++) {
            document.querySelector(`.table-content-row${i}`).innerHTML = `
              <td>${dataGetWeather.weatherData.data[i].datetime}</td>
              <td>${dataGetWeather.weatherData.data[i].min_temp}</td>
              <td>${dataGetWeather.weatherData.data[i].max_temp}</td>
              <td>${dataGetWeather.weatherData.data[i].weather.description}</td>
            `;
          }
        }
        document.getElementById("locationName").innerText =
          dataGetWeather.place;
        document.getElementById(
          "commingDateInfo"
        ).innerText = `${comeYear}-${comeMonth}-${comeDay}`;
        document.getElementById("remainingDateInfo").innerText = dayRemaining;
      });
    } else {
      alert("Sorry no have data for this place. Please enter another place!");
      document.getElementById("infoShow").innerHTML = null;
    }
  });
}

export { handleSubmit };

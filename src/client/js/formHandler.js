function handleSubmit(event) {
    event.preventDefault();
    const locationName = document.getElementById('name').value;
    const comeDay = document.getElementById('day').value;
    const comeMonth = document.getElementById('month').value;
    const comeYear = document.getElementById('year').value;
    let dateNow = new Date();
    let inputUserDate = new Date();
    let dateResult = new Date();
    inputUserDate.setDate(comeDay);
    inputUserDate.setMonth(comeMonth - 1); // setMonth run 0 -> 11: 0 -> jan, 1 -> feb ...
    inputUserDate.setFullYear(comeYear);
    let diff = inputUserDate.getTime() - dateNow.getTime();
    if (diff < 0) {
      alert(`Thời gian bạn đến ${locationName} đang nhỏ hơn thời gian hiện tại. Xin mời nhập lại!`);
      return;
    }
    dateResult.setTime(diff);
    let dayRemaining = diff / 86400000; // 1 day =  86400000 ms
    console.log('dayRemaining:', dayRemaining);
    console.log('dateResult:', dateResult)
    console.log('diff:', diff)
    console.log('inputUserDate:', inputUserDate)
    console.log('dateNow:', dateNow)
    console.log('comeDay:', comeDay);
    console.log('comeMonth:', comeMonth);
    console.log('comeYear:', comeYear);
    if (!Client.checkForName(locationName)) {
        return;
    }

    const getLatLongLocation = async (url = `http://api.geonames.org/searchJSON?q=${locationName}&maxRows=10&username=luunguyen`) => {
      const responseLatLong = await fetch(url);
      try {
        const newData = await responseLatLong.json();
        console.log('new Data:', newData)
        return newData
      } catch(error) {
      console.log("error", error);
      return;
      } 
    }

    const getNameWeather = async (countryName, lat, lng) => {
      console.log('countryName:', countryName);
      console.log('lat:', lat);
      console.log('lng:', lng);
      if (dayRemaining <= 7) {
        try {
          alert('<= 7');
          const responseWeather = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=48a36dbf3a014b158d124c25326fe906`);
          const weatherData = await responseWeather.json();
          console.log('weatherData:', weatherData);
          const dataAfterGetWeather = {place: countryName, weatherData: weatherData}
          return dataAfterGetWeather;
        } catch(err) {
          console.log('error call api weather:', err);
          return;
        }
      } else {
        try {
          alert('> 7');
          const responseWeather = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=48a36dbf3a014b158d124c25326fe906`);
          const weatherData = await responseWeather.json();
          console.log('weatherData:', weatherData);
          const dataAfterGetWeather = {place: countryName, weatherData: weatherData}
          return dataAfterGetWeather;
        } catch(err) {
          console.log('error call api weather:', err);
          return;
        }
      }
    }

    const getImageLocation = async (locationName) => {
      console.log('this locationName memeem:',locationName)
      const imgLocation = await fetch(`https://pixabay.com/api/?key=28657331-249566aa6376c5f79e4e8ef8b&q=${locationName}&image_type=photo`)
      try {
        const responseImg = await imgLocation.json();
        // show on UI
        console.log('responseImg:', responseImg)
        document.getElementById('locationImg').setAttribute('src', responseImg.hits[0].largeImageURL)
      } catch (err) {
        console.log('error when call api take image location:', err);
        return;
      }
    }

  getLatLongLocation()
  .then(data => {
    console.log('hello data:', data);
    if (data && data.geonames.length) {
      document.getElementById('infoShow').innerHTML = `
      <h1>Dự báo thời tiết</h1>
                <div>
                    <div class="location-img">
                        <img id="locationImg" width="300px" height="200px">
                    </div>
                    <div class="location-info">
                        <div class="location-info__detail">
                            <span>Địa điểm đến: </span>
                            <div id="locationName"></div>
                        </div>
                        <div class="location-info__detail">
                            <span>Ngày đến (mm-dd-yyyy): </span>
                            <div id="commingDateInfo"></div>
                        </div>
                        <div class="location-info__detail">
                            <span>Số ngày còn lại: </span>
                            <div id="remainingDateInfo"></div>
                        </div>
                        <div class="location-info__detail">
                            <span>Nhiệt độ trung bình: </span>
                            <div id="tempInfo"></div>
                        </div>
                        <div class="location-info__detail">
                            <span>Trạng thái: </span>
                            <div id="weatherStatus"></div>
                        </div>
                    </div>
                </div>
      `;
      getNameWeather(data.geonames[0].toponymName, data.geonames[0].lat, data.geonames[0].lng)
      .then(dataGetWeather => {
        getImageLocation(dataGetWeather.place);
        document.getElementById('locationName').innerText = dataGetWeather.place;
        document.getElementById('commingDateInfo').innerText = `${comeMonth}-${comeDay}-${comeYear}`;
        document.getElementById('remainingDateInfo').innerText = dayRemaining;
        document.getElementById('tempInfo').innerText = `${dataGetWeather.weatherData.data[0].temp}°C`;
        document.getElementById('weatherStatus').innerText = dataGetWeather.weatherData.data[0].weather.description;
      });
    } else {
      alert('khong co data');
      if (document.getElementById('infoShow').innerHTML) {
        document.getElementById("locationImg").setAttribute("src", '');
        document.getElementById("locationImg").setAttribute("alt", 'No photos found for this place!');
      }
      document.getElementById('infoShow').innerHTML = null;
    }
  })
}

export { handleSubmit }

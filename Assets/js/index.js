moment().format();
// searching section 
const textArea = document.getElementById('userInputText');
const searchBtn = document.getElementById('searchBtn');
// history List 
const historyUl = document.querySelector('.history');
let historyBlockLi = document.querySelectorAll('.block')
const historyClearBtn = document.getElementById('clearHistory')

// section one
// title 
const s1 = document.getElementById('secOne')
const s1cityName = document.getElementById('cityName');
const s1cityDate = document.getElementById('cityDate');
const s1cityIcon = document.getElementById('cityIcon');
const s1cityCountry = document.getElementById('subCountry')
const s1MainDiv = document.querySelector('.sec1-main');
const s1MainPreloader = document.querySelector('.load-container')
// stats
const tempP = document.getElementById('temp');
const windP = document.getElementById('wind');
const humidP = document.getElementById('humidity');
const uvIndexP = document.getElementById('uvIndex');

// section two
const cards = document.querySelectorAll('.weather-card')

function getStoredBlocks() {
  let blocks = JSON.parse(localStorage.getItem('cityBlock'))
  if (blocks === null) {
    return
  } else {
    for (i = 0; i < blocks.length; i++) {
      let block = blocks[i]
      let li = document.createElement('li')
      li.classList.add('block')
      li.textContent = block
      historyUl.append(li)
    }
  }
}
getStoredBlocks()

function searchCity() {
  
  // get the user's message 
  let textValue = textArea.value
  let storedHistory = JSON.parse(localStorage.getItem('cityBlock'));

  if (storedHistory === null) {
    storedHistory = []
  }

  // check if it's null before sending value to weatherAPI 
  if (textValue === '') {
    return
  } else {
    weatherApi(textValue)
    if (storedHistory.length > 7 || storedHistory.includes(textValue)) {
      textArea.value = ''
      return
    } else {
      let li = document.createElement('li')
      li.classList.add('block')
      li.textContent = textValue
      historyUl.append(li)
      storedHistory.push(textValue)
      localStorage.setItem('cityBlock', JSON.stringify(storedHistory))
    }
    textArea.value = ''
  }
}

function weatherApi(location) {
  let apiKey = `a1d94660e7da91b5ead6e3196cf26420`
  let url1 = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`

  // call api 
  fetch(url1)
    .then(res => {
      if (!res.ok) {
        s1cityDate.textContent = 'Hmm... We got an Error'
        return
      } else {
        return res.json();
      }
    })
    .then(data => {
      s1MainDiv.style.display = 'none'
      s1MainPreloader.style.display = 'flex'
      // console.log(data)

      let country = data[0].country;
      let state = data[0].state;
      let name = data[0].name;
      let lat = data[0].lat;
      let lon = data[0].lon;

      let url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=imperial&appid=${apiKey}`

      // call 2nd api 
      fetch(url2)
        .then(res => {
          return res.json();
        })
        .then(data => {
          console.log(data)
          let humidity = data.current.humidity
          let temp = data.current.temp
          let uvi = data.current.uvi
          let wind_speed = data.current.wind_speed
          let icon = data.current.weather[0].icon

          // get date 
          let today = new Date();
          let dd = String(today.getDate()).padStart(2, '0');
          let mm = String(today.getMonth() + 1).padStart(2, '0');
          let yyyy = today.getFullYear();
          today = `(${mm}/${dd}/${yyyy})`;

          if (state === undefined) {
            s1cityName.textContent = `${name}`;
          } else {
            s1cityName.textContent = `${name}, ${state}`;
          }
          s1cityDate.textContent = `${today}`;
          s1cityCountry.textContent = country;
          s1cityIcon.src = `http://openweathermap.org/img/wn/${icon}.png`
          tempP.textContent = temp;
          windP.textContent = wind_speed
          humidP.textContent = humidity
          uvIndexP.textContent = uvi

          // check UVIndex to change colors 
          let uviNum = Math.floor(uvi)
          if (uviNum <= 2) {
            uvIndexP.style.backgroundColor = 'var(--green-clr)';
          } else if (uviNum >= 3 && uviNum <= 5) {
            uvIndexP.style.backgroundColor = 'var(--yellow-clr)';
          } else if (uviNum == 6 || uviNum == 7) {
            uvIndexP.style.backgroundColor = 'var(--orange-clr)';
          } else if (uviNum >= 8) {
            uvIndexP.style.backgroundColor = 'var(--red-clr)';
          }

          // take off preloaders 
          setTimeout(() => {
            s1MainDiv.style.display = 'block'
            s1MainPreloader.style.display = 'none'
          }, 500)

          // 5 Day Forecast
          for (i = 0; i < cards.length; i++) {

            // each day 
            let day = data.daily[i]
            let dayTemp = day.temp.day
            let dayWind = day.wind_speed
            let dayHumd = day.humidity
            let dayIcon = day.weather[0].icon

            // each card 
            let cardTemp = document.querySelectorAll('.cardTemp');
            let cardWind = document.querySelectorAll('.cardWind');
            let cardHmdy = document.querySelectorAll('.cardHmdy');
            let cardIcon = document.querySelectorAll('.weather-card-icon');

            // change each with new data 
            cardIcon[i].src = `http://openweathermap.org/img/wn/${dayIcon}.png`
            cardTemp[i].textContent = dayTemp
            cardWind[i].textContent = dayWind
            cardHmdy[i].textContent = dayHumd
          }

          // add dates on each card 
          let cardDate = document.querySelectorAll('.weather-card-date');
          for (j = 0; j < cardDate.length; j++) {
            cardDate[j].textContent = moment().add(j + 1, 'd').format("M/D/YYYY");
          }
        })

  })
}

historyClearBtn.addEventListener('click', () => {
  localStorage.removeItem('cityBlock')
  location.reload()
})

document.addEventListener('click', (e) => {
  if (e.target.className.includes('block')) {
    weatherApi(e.target.textContent)
    if (window.innerWidth < 540) {
      s1.scrollIntoView()
    }
  }
});

searchBtn.addEventListener('click', searchCity)
textArea.addEventListener('keyup',(e) => {
  if (e.code === "Enter") {
    searchCity()
    if (window.innerWidth < 540) {
      s1.scrollIntoView()
    }
  }
})

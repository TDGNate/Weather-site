// searching section 
const textArea = document.getElementById('userInputText');
const searchBtn = document.getElementById('searchBtn');
// history List 
const historyUl = document.querySelector('.history');
let historyBlockLi = document.querySelectorAll('.block')

// section one
// title 
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


function getStoredBlocks() {
  let blocks = JSON.parse(localStorage.getItem('cityBlock'))
  for (i = 0; i < blocks.length; i++) {
    let block = blocks[i]
    let li = document.createElement('li')
    li.classList.add('block')
    li.textContent = block
    historyUl.append(li)
  }
}
getStoredBlocks()

function searchCity() {
  
  // get the user's message 
  let textValue = textArea.value
  let storedHistory = [];

  // check if it's null before sending value to weatherAPI 
  if (textValue === '') {
    return
  } else {
    weatherApi(textValue)
    if (historyBlockLi.length >= 8 || storedHistory.includes(textValue)) {
      return
    } else {
      let li = document.createElement('li')
      li.classList.add('block')
      li.textContent = textValue
      historyUl.append(li)
      storedHistory.push(textValue)
      localStorage.setItem('cityBlock', JSON.stringify(storedHistory))
      textArea.value = ''
    }
  }
}

function weatherApi(location) {
  let apiKey = `a1d94660e7da91b5ead6e3196cf26420`
  let url1 = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`

  // call api 
  fetch(url1)
    .then(res => {
      return res.json();
    })
    .then(data => {
      s1MainDiv.style.display = 'none'
      s1MainPreloader.style.display = 'flex'
      // console.log(data)

      let country = data[0].country;
      if (country === undefined) {
        s1cityDate.textContent = 'Hmm... Please try again'
      }
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
          tempP.textContent = temp;
          windP.textContent = wind_speed
          humidP.textContent = humidity
          uvIndexP.textContent = uvi

          setTimeout(() => {
            s1MainDiv.style.display = 'block'
            s1MainPreloader.style.display = 'none'
          }, 500)
        })

  })
}

document.addEventListener('click', (e) => {
  if (e.target.className.includes('block')) {
    console.log('clicked', e.target.textContent)
  }
});

searchBtn.addEventListener('click', searchCity)
textArea.addEventListener('keyup',(e) => {
  if (e.code === "Enter") {
    searchCity()
  }
})

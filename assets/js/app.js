let long;
let lat;

const APP_ID = '73af23c1d247a435aa8dce19fc83c958';
const DEFAULT_VALUE = '--';
const searchInput = document.querySelector('#search-input');
const cityName = document.querySelector('.city-name');
const weatherState = document.querySelector('.weather-state');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');


const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');

const microphone = document.querySelector('.microphone');

// window.addEventListener('change', () => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(position => {
//             // console.log(position);
//             long = position.coords.longitude;
//             lat = position.coords.latitude;
//             console.log(long);
//             console.log(lat);

//         });
//     }
// });


searchInput.addEventListener('change', (e) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
        .then(async res => {
            const data = await res.json();
            console.log(data);
            console.log('[Search Input]', data);
            cityName.innerHTML = data.name || DEFAULT_VALUE;
            weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
            weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;

            sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE;
            sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE;
            humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
            windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE;
        });
});

// Tr??? l?? ???o b???ng gi???ng n??i
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;

recognition.lang = 'vi-VI';         // Nh???n di???n ti???ng vi???t
recognition.continuous = false;     // K???t qu??? tr??? v??? lu??n - results are returned for each recognition, or only a single result.

microphone.addEventListener('click', (e) => {
    e.preventDefault;

    recognition.start();
    microphone.classList.add('recording');
})

recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove('recording');
}

recognition.onerror = (err) => {
    console.log(err);
    microphone.classList.remove('recording');
}

recognition.onresult = (e) => {
    console.log('onresult', e);
    const text = e.results[0][0].transcript;
    handleVoice(text);
}

const handleVoice = (text) => {
    console.log('text:', text);

    const handleText = text.toLowerCase();
    // H???i th???i ti???t t???i ????u theo ki???u "th???i ti???t t???i " + t??n th??nh ph???
    if (handleText.includes('th???i ti???t t???i')) {
        speak('Please wait 3 seconds!')

        setTimeout(() => {
            const location = handleText.split('t???i')[1].trim();

            console.log('location:', location);
            searchInput.value = location;
            const changeEvent = new Event('change');
            searchInput.dispatchEvent(changeEvent);
        }, 3 * 1000);
    }
    // Kh??ng ????ng th??
    else {
        speak('Try again!');
    }
}

const speak = (text) => {
    if (synth.speaking) {
        console.log('Busy. Speaking... ');
        return;
    }

    const utter = new SpeechSynthesisUtterance(text);

    utter.onend = () => {
        console.log('SpeechSynthesisUtterance.onend');
    }

    utter.onerror = (err) => {
        console.log('SpeechSynthesisUtterance.onerror', err);
    }

    synth.speak(utter);
}











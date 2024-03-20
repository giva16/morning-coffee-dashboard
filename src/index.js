// Entry point for our source codes
import './css/style.css';
import ApiHandler from './ApiHandler';

const DisplayController = (() => {
  const _renderCrypto = async () => {
    const coins = ['ethereum', 'bitcoin'];
    const cryptoListEl = document.querySelector('.crypto');

    coins.forEach(async (coin) => {
      const coinData = await ApiHandler.getCryptoData(coin);
      const coinEl = document.createElement('div');
      const iconNameContainer = document.createElement('div');
      const iconEl = document.createElement('img');
      const coinNameEl = document.createElement('div');
      const priceEl = document.createElement('div');

      // add classes
      coinEl.classList.add('coin');
      iconNameContainer.classList.add('icon-name');
      iconEl.classList.add('icon');
      coinNameEl.classList.add('name');
      priceEl.classList.add('price');

      //set text and image
      coinNameEl.textContent = coinData.name;
      iconEl.setAttribute('src', coinData.image['small']);
      priceEl.textContent = `$${coinData.market_data.current_price.usd}`;

      //structure the elements
      iconNameContainer.appendChild(iconEl);
      iconNameContainer.appendChild(coinNameEl);
      coinEl.appendChild(iconNameContainer);
      coinEl.appendChild(priceEl);

      //add to DOM
      cryptoListEl.appendChild(coinEl);
    });
  };

  const _renderTime = () => {
    const timeEl = document.querySelector('.time');
    const date = new Date();

    // format time as Hours:Minutes AM/PM
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    timeEl.textContent = time;
  };

  const _buildWeatherIcon = (iconURL) => {
    const iconEl = document.createElement('img');

    iconEl.classList.add('icon-weather');
    iconEl.setAttribute('src', iconURL);

    return iconEl;
  };

  const _buildWeatherDetails = (city, temp) => {
    const detailsEl = document.createElement('div');
    const cityEl = document.createElement('div');
    const tempEl = document.createElement('div');

    detailsEl.classList.add('details-weather');
    cityEl.classList.add('city');
    tempEl.classList.add('temp');

    cityEl.textContent = city;
    tempEl.textContent = Math.ceil(temp) + String.fromCharCode(176);

    detailsEl.appendChild(tempEl);
    detailsEl.appendChild(cityEl);

    return detailsEl;
  };

  const _renderWeather = () => {
    //use geolocation API to get current lat and long
    ApiHandler.getWeather('metric')
      .then((weatherData) => {
        const weatherEl = document.querySelector('.weather');
        const iconEl = _buildWeatherIcon(weatherData.iconURL);
        const detailsEl = _buildWeatherDetails(weatherData.city, weatherData.temp);

        weatherEl.appendChild(iconEl);
        weatherEl.appendChild(detailsEl);
      })
      .catch((error) => console.log(error));
    // pass lat and long to openweather api to get the weather based on location
  };

  const _preloadImages = async () => {
    let i = 0;
    const images = [];
    while (i < 20) {
      const imageData = await ApiHandler.getImage();
      const author = imageData.author;
      const imageURL = imageData.imageURL;

      images.push({ imageURL: `url(${imageURL})`, author: author });
      i++;
    }

    return images;
  };

  const _renderAuthor = (author) => {
    const authorEl = document.querySelector('.author');

    // format author's name
    const authorName = author
      .split(' ')
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(' ');

    authorEl.textContent = `Image Taken By: ${authorName}`;
  };

  const _renderImage = async () => {
    const images = await _preloadImages();
    document.body.style.backgroundImage = images[0].imageURL;
    _renderAuthor(images[0].author);

    setInterval(() => {
      const i = Math.floor(Math.random() * 20);
      document.body.style.backgroundImage = images[i].imageURL;
      _renderAuthor(images[i].author);
    }, 60000);
    //document.body.style.backgroundImage = `url(${imageURL})`;
    //_renderAuthor(author);
  };

  const render = async () => {
    _renderImage();
    _renderCrypto();
    _renderWeather();
    setInterval(_renderTime, 1000); // run render time every second to keep time updated
  };

  return { render };
})();

DisplayController.render();

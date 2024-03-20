// Entry point for our source codes
import './css/style.css';
import ApiHandler from './ApiHandler';

const DisplayController = (() => {
  const renderAuthor = (author) => {
    const footer = document.querySelector('footer');
    const divEl = document.createElement('div');

    // format author's name
    const authorName = author
      .split(' ')
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(' ');

    divEl.classList.add('author');
    divEl.textContent = `Image Taken By: ${authorName}`;
    footer.appendChild(divEl);
  };

  const renderCrypto = async () => {
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

  const renderTime = () => {
    const timeEl = document.querySelector('.time');
    const date = new Date();

    // format time as Hours:Minutes AM/PM
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    timeEl.textContent = time;
  };

  const renderWeather = () => {
    //use geolocation API to get current lat and long
    ApiHandler.getWeather('metric')
      .then((weatherData) => console.log(weatherData))
      .catch((error) => alert(error));
    // pass lat and long to openweather api to get the weather based on location
  };

  const render = async () => {
    const imageData = await ApiHandler.getImage();
    const imageURL = imageData.imageURL;
    const author = imageData.author;

    document.body.style.background = `url(${imageURL})`;
    renderAuthor(author);
    renderCrypto();
    setInterval(renderTime, 1000); // run render time every second to keep time updated
  };

  return { render, renderTime, renderWeather };
})();

DisplayController.render();
DisplayController.renderTime();
DisplayController.renderWeather();

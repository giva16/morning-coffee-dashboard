const ApiHandler = (() => {
  const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const _fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.statusText}`);

      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  };

  const getImage = async () => {
    try {
      const data = await _fetchData('https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=city');

      if (data instanceof Error) throw new Error(data);

      return { imageURL: data.urls.full, author: data.user.name };
    } catch (error) {
      console.log(error);
      return {
        imageURL:
          'https://images.unsplash.com/photo-1707929591972-43d4060c3377?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        author: 'Jonny Gios',
      };
    }
  };

  // get user's location and pass it to the openweather api
  const getWeather = (units) =>
    new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      };

      const success = async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const response = await fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}`);

        if (!response.ok) {
          throw new Error('No weather data available');
        }

        const data = await response.json();

        const temp = data.main.temp;
        const city = data.name;
        const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; // get icon url

        resolve({ city, temp, iconURL });
      };

      const error = () => reject('Sorry, no weather data available');

      navigator.geolocation.getCurrentPosition(success, error, options);
    });

  const getCryptoData = async (cryptoName) => {
    // get id of each coins, then search for the coin based on the id
    try {
      const data = await _fetchData(`https://api.coingecko.com/api/v3/search?query=${cryptoName}`);

      // sleep to prevent error 429 (too many requests)
      await _sleep(1000);

      if (data instanceof Error) throw new Error(data);

      const id = data.coins[0].id;
      const coin = await _fetchData(`https://api.coingecko.com/api/v3/coins/${id}`);

      return coin;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return { getImage, getCryptoData, getWeather };
})();

export default ApiHandler;

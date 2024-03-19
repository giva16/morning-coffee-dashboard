const ApiHandler = (() => {
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
      const data = await _fetchData('https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature');

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

  const getCryptoData = async (cryptoName) => {
    // get id of each coins, then search for the coin based on the id
    try {
      const data = await _fetchData(`https://api.coingecko.com/api/v3/search?query=${cryptoName}`);

      if (data instanceof Error) throw new Error(data);

      const id = data.coins[0].id;
      const coin = await _fetchData(`https://api.coingecko.com/api/v3/coins/${id}`);

      return coin;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return { getImage, getCryptoData };
})();

export default ApiHandler;

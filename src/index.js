// Entry point for our source codes
import './css/style.css';

const fetchData = async (url) => {
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
    const data = await fetchData('https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature');

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

const getCryptoInfo = async (...cryptoNames) => {
  const coins = [];

  // get id of each coins, then search for the coin based on the id
  cryptoNames.forEach(async (cryptoName) => {
    try {
      const data = await fetchData(`https://api.coingecko.com/api/v3/search?query=${cryptoName}`);

      if (data instanceof Error) throw new Error(data);

      const id = data.coins[0].id;
      const coin = await fetchData(`https://api.coingecko.com/api/v3/coins/${id}`);
      coins.push(coin);

      //Timeout to avoid error 429 (too many request)
      setTimeout(() => {}, 100);
    } catch (error) {
      console.log(error);
      return;
    }
  });
  console.log(coins);
  return coins;
};

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

const renderCrypto = (crypto) => {};

const render = async () => {
  const imageData = await getImage();
  const imageURL = imageData.imageURL;
  const author = imageData.author;
  const coins = getCryptoInfo('ethereum', 'bitcoin', 'dogecoin', 'litecoin');

  //render background image
  document.body.style.background = `url(${imageURL})`;

  // render author name
  renderAuthor(author);

  //render crypto
};

render();

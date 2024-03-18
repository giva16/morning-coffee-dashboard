// Entry point for our source codes
import './css/style.css';

const fetchData = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${response.statusText}`);
    }

    const data = await response.json();
    return { imageURL: data.urls.full, author: data.user.name };
  } catch (error) {
    console.log('Error', error);
    return {
      imageURL:
        'https://images.unsplash.com/photo-1707929591972-43d4060c3377?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      author: 'Jonny Gios',
    };
  }
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

const render = async () => {
  const data = await fetchData('https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature');
  const imageURL = data.imageURL;
  const author = data.author;

  //render image
  console.log(imageURL);
  document.body.style.background = `url(${imageURL})`;

  // render author name
  renderAuthor(author);
};

render();

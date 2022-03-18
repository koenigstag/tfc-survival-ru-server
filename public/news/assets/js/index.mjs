import './constants.mjs';
import App from "./app.mjs";
import Spinner from "./components/spinner/index.mjs";
import { getVKNews } from "./api/vk.mjs";

window.HTML_Container = document.querySelector("#container");

if (!HTML_Container) {
  throw new Error("Html container not found");
}

(async function () {
  HTML_Container.innerHTML = `
  <span>
    ${Spinner()}
  </span>
  <span>
    Загрузка ленты VK.com
  </span>
  `;
  
  let news;

  async function loadNews() {
    const { data } = await getVKNews();
    news = data;
    localStorage.setItem('timestamp', Date.now());
    localStorage.setItem('news-cache', JSON.stringify(data));
  }
  
  const storageNews = JSON.parse(localStorage.getItem('news-cache'));
  const timestamp = localStorage.getItem('timestamp');
  
  if (!storageNews || !timestamp || timestamp + 60000 * 60 * 24 < Date.now()) {
      await loadNews();
  } else {
    news = storageNews;
  }

  if (Array.isArray(news)) {
    HTML_Container.innerHTML = App({ news });
  }
})();

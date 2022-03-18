import './constants.mjs';
import App from "./app.mjs";
import Spinner from "./components/spinner/index.mjs";
import { getNews } from "./api/vk.mjs";

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

  const { data } = await getNews();

  if (Array.isArray(data)) {
    HTML_Container.innerHTML = App(data);
  }

})();

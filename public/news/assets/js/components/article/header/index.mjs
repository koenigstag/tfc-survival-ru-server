import { formatDate } from "../../../utils/date.mjs";
import Logo from "../../logo/index.mjs";

export default function ArticleHead(props) {
  console.log(props);

  return `
    <header style="display: flex; align-items: center; margin-bottom: 10px;">
      <div style="margin-right: 30px;">
        <a target="_blank" rel="noreferrer noopener" href="${VK_LINK}/${123}">${Logo()}</a>
      </div>
      <div>
        <div>
          <a style="text-decoration: none;" target="_blank" rel="noreferrer noopener" href="${VK_LINK}/${123}">TFC-survival.ru</a>
        </div>
        <div style="color: grey; font-size: 0.8em; margin-top: 3px;">
          ${formatDate(props.date)}
        </div>
      </div>
    </header>
  `
}
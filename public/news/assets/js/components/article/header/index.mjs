import { formatDate } from "../../../utils/date.mjs";

export default function ArticleHead() {
  return `
    <header>
      <div>
        <a target="_blank" rel="noreferrer noopener" href="${VK_LINK}/${123}">${logo()}</a>
      </div>
      <div>
        <div>
          <a target="_blank" rel="noreferrer noopener" href="${VK_LINK}/${123}">Tfc-survival.ru</a>
        </div>
        <div>
          ${formatDate()}
        </div>
      </div>
    </header>
  `
}
import Article from "../article/index.mjs";

export const articles = [];

export default function NewsFeed(props) {

  for(const data of props.news) {
    articles.push(Article(data));
  }

  return `
    ${articles.join('')}
  `;
}

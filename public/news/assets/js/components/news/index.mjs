import Article from "../article/index.mjs";

export const news = [];
export const articles = [];

export default function NewsFeed(data) {
  news.concat(data);

  for(const data of news) {
    articles.push(Article(data));
  }

  return `
    ${articles.join('')}
  `;
}

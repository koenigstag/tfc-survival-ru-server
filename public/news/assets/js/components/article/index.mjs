import ArticleContent from './content/index.mjs';
import ArticleHead from './header/index.mjs';

export default function Article(data) {
  const { ...rest } = data;
  console.log(rest);

  return `
    <article>
      ${ArticleHead()}
      ${ArticleContent()}
    </article>
  `
}
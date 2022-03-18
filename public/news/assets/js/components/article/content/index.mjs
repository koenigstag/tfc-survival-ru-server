export default function ArticleContent({ text }) {
  return `
    <section>
      {text.replaceAll('\n', '<br/>')}
      text
    </section>
  `;
}
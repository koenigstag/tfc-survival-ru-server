export default function ArticleContent(props) {
  return `
    <section>
      ${props.text.replaceAll('\n', '<br/>')}
    </section>
  `;
}
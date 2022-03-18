import NewsFeed from "./components/news/index.mjs";

// main
export default function App(data) {
  return `
    ${NewsFeed(data)}
  `
}

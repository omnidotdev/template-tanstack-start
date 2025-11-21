import { app } from "../config/app.config";

export const seo = ({
  title,
  description,
  image,
  keywords,
  url,
}: {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  url?: string;
} = {}) => {
  const displayedTitle = title ? `${title} | ${app.name}` : app.name;

  const tags = [
    { title: displayedTitle },
    { name: "description", content: description ?? app.description },
    { name: "keywords", content: keywords },
    {
      name: "twitter:title",
      content: displayedTitle,
    },
    { name: "twitter:description", content: description ?? app.description },
    { name: "twitter:creator", content: "@omnidotdev" },
    { name: "twitter:site", content: "@omnidotdev" },
    { name: "twitter:url", content: url ?? app.url },
    { name: "og:type", content: "website" },
    { name: "og:title", content: displayedTitle },
    { name: "og:description", content: description ?? app.description },
    { name: "og:url", content: url ?? app.url },
    { name: "twitter:image", content: image ?? "/favicon.ico" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "og:image", content: image ?? "/favicon.ico" },
  ];

  return tags;
};

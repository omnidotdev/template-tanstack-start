import { app } from "../config/app.config";

export const seo = ({
  title,
  description,
  keywords,
  image,
}: {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
} = {}) => {
  const tags = [
    { title: title ?? app.name },
    { name: "description", content: description ?? app.description },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description ?? app.description },
    { name: "twitter:creator", content: "@omnidotdev" },
    { name: "twitter:site", content: "@omnidotdev" },
    { name: "og:type", content: "website" },
    { name: "og:title", content: title ?? app.name },
    { name: "og:description", content: description ?? app.description },
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "og:image", content: image },
        ]
      : []),
  ];

  return tags;
};

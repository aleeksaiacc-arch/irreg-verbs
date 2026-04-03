import { ScrollViewStyleReset } from "expo-router/html";
import { createElement, type PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Irregular verbs</title>
        <ScrollViewStyleReset />
        {createElement("script", {
          async: true,
          src: "https://www.googletagmanager.com/gtag/js?id=G-B9MN97HSDS",
        })}
        {createElement("script", {
          dangerouslySetInnerHTML: {
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B9MN97HSDS');
            `,
          },
        })}
      </head>
      <body>{children}</body>
    </html>
  );
}

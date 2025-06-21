import { DefaultSeoProps } from "next-seo";

export const defaultSEO: DefaultSeoProps = {
  title: "VotoElectronico",
  description: "La plataforma que te ofrece los mejores servicios, rapido y confiable.",
  canonical: "https://bramacafrontend.vercel.app/",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://bramacafrontend.vercel.app/",
    siteName: "VotoElectronico",
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Microsoft_Word_logo_%282013-2019%29.png",
        width: 1200,
        height: 630,
        alt: "VotoElectronico",
      },
    ],
  },
  twitter: {
    handle: "@yourtwitterhandle",
    site: "@site",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content:
        "VotoElectronico, ui VotoElectronico, VotoElectronico Votar, VotoElectronico Candidatos, VotoElectronico Partidos, VotoElectronico Votar, VotoElectronico Candidatos, VotoElectronico Partidos",
    },
  ],
};

export const getSEO = (pageSEO?: Partial<DefaultSeoProps>): DefaultSeoProps => {
  return {
    ...defaultSEO,
    ...pageSEO,
    openGraph: {
      ...defaultSEO.openGraph,
      ...pageSEO?.openGraph,
    },
    twitter: {
      ...defaultSEO.twitter,
      ...pageSEO?.twitter,
    },
  };
};

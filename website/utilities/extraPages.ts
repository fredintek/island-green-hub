export const getExtraPages = (slug: string) => {
  switch (slug) {
    case "about":
      return [
        {
          id: "careers",
          slug: "careers",
          link: "about/careers",
          title: {
            en: "Careers",
            tr: "Kariyer",
            ru: "Карьера",
          },
        },
      ];

    default:
      return [];
  }
};

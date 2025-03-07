export interface Section {
  id: number;
  page: Page; // This will reference the Page entity
  type: string;
  sortId: number;
  content: any; // You can replace `any` with a more specific type if needed (e.g., `Record<string, unknown>`)
}

export interface MultiLanguage {
  en: string;
  ru: string;
  tr: string;
}

export interface ProjectHouse {
  id: number;
  projectPage: Page;
  title: {
    en: string;
    ru: string;
    tr: string;
  };
  coverImage: {
    publicId: string;
    url: string;
  };
  displayImage: {
    publicId: string;
    url: string;
  };
  generalInfo: {
    en: string;
    ru: string;
    tr: string;
  };
  features?: {
    en: string;
    ru: string;
    tr: string;
  };
  optionalFeatures?: {
    en: string;
    ru: string;
    tr: string;
  };
  gallery?: Array<{
    imageUrl: {
      publicId: string;
      url: string;
    };
    tag: string;
  }>;
  homeText?: {
    en: string;
    ru: string;
    tr: string;
  };
  isHomePage: boolean;
  homeImages?: Array<{
    publicId: string;
    url: string;
  }>;
}

export interface Page {
  id: number;
  title: MultiLanguage;
  slug: string;
  parentPage: Page | null;
  subPages: Page[];
  sections: Section[];
  projectHouse: ProjectHouse[];
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Faq {
  id: number;
  question: MultiLanguage;
  answer: MultiLanguage;
}

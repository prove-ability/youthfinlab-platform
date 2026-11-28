export const BRAND = {
  name: "유스핀랩",
  url: "https://www.youthfinlab.com",
  instagram: "https://www.instagram.com/youthfinlab/",
  title: "유스핀랩 | 금융교육 전문기업",
  description:
    "금융교육 전문기업 유스핀랩은 청소년, 청년, 일반인을 위한 맞춤형 금융교육 프로그램을 제공합니다. 체계적인 커리큘럼과 전문 강사진이 함께합니다.",
  image: "/brand/social-card.png",
} as const;

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": BRAND.url + "/#organization",
  name: BRAND.name,
  alternateName: "YouthFinLab",
  url: BRAND.url,
  logo: BRAND.url + "/android-chrome-512x512.png",
  description: BRAND.description,
  email: "contact@youthfinlab.com",
  sameAs: [BRAND.instagram],
};

export const brandOpenGraph = {
  title: BRAND.title,
  description: BRAND.description,
  siteName: BRAND.name,
  locale: "ko_KR",
  type: "website" as const,
  images: [{ url: BRAND.image, width: 1200, height: 630, alt: BRAND.title }],
};

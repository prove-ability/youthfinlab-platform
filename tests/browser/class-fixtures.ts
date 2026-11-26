export const attempts = {
  classes: 0,
  generations: [] as { classId: string }[],
};
Object.assign(window, { attempts });
export const getClasses = async () =>
  attempts.classes
    ? { success: false, message: "offline" }
    : {
        success: true,
        data:
          location.search === "?seed" ? [{ id: "course", name: "테스트" }] : [],
      };
export const createClass = async () => ({
  data: { id: "class-" + ++attempts.classes },
  message: "created",
});
export const getClientsAndManagers = async () => ({
  clients: [{ id: "client", name: "고객사" }],
  managers: [{ id: "manager", clientId: "client", name: "담당자" }],
});
export const getStocks = async () => [
  {
    id: "stock",
    name: "테스트종목",
    marketCountryCode: "KR",
    industrySector: "IT",
  },
];
export const generateGameData = async (params: { classId: string }) => {
  attempts.generations.push(params);
  if (attempts.generations.length === 1) throw Error("응답 연결 끊김");
  return { success: true };
};
export const EditClassModal = () => null;
export const ClassListItem = () => null;
export { generateQRToken } from "./qr-token";

const seedWrites = {
  news: [] as { day: number }[],
  prices: [] as { day: number }[],
};
Object.assign(window, { seedWrites });
export const createNews = async (article: { day: number }) => {
  seedWrites.news.push(article);
  return article;
};
export const createStockPrice = async (price: { day: number }) => {
  seedWrites.prices.push(price);
};

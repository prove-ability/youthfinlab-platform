"use server";

import { lockEditableGame } from "../lib/market-scenario-guard";
import { eq } from "drizzle-orm";
import {
  db,
  dbWithTransaction,
  gameDataGenerations,
  classStockPrices,
  news,
} from "@repo/db";
import { withAuth } from "@/lib/safe-action";

interface StockInfo {
  id: string;
  name: string;
  marketCountryCode: string;
  industrySector: string;
}

interface GeneratedGameData {
  days: {
    day: number;
    news: {
      title: string;
      content: string;
      relatedStockIds: string[];
    }[];
    prices: {
      stockId: string;
      price: number;
    }[];
  }[];
}

function gameDataResponseFormat(stockIds: string[]) {
  const stockId = { $ref: "#/$defs/stockId" };
  const object = (properties: Record<string, unknown>) => ({
    type: "object",
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  });
  const array = (items: unknown) => ({ type: "array", items });
  const article = object({
    title: { type: "string" },
    content: { type: "string" },
    relatedStockIds: array(stockId),
  });
  const day = object({
    day: { type: "integer" },
    news: array(article),
    prices: array(object({ stockId, price: { type: "number" } })),
  });
  return {
    type: "json_schema",
    json_schema: {
      name: "game_data",
      strict: true,
      schema: {
        ...object({ days: array(day) }),
        $defs: { stockId: { type: "string", enum: stockIds } },
      },
    },
  };
}
/**
 * 난이도별 AI 프롬프트 생성
 */
function buildPrompt(
  difficulty: "normal" | "easy",
  totalDays: number,
  stocks: StockInfo[],
): string {
  const stockList = stocks
    .map(
      (s) =>
        `- "${s.id}" → ${s.name} (${s.marketCountryCode}/${s.industrySector})`,
    )
    .join("\n");

  const commonJson = `
**응답 형식 (JSON):**
{
  "days": [
    {
      "day": 1,
      "news": [
        {
          "title": "뉴스 제목",
          "content": "뉴스 내용",
          "relatedStockIds": ["⚠️ 위 '사용 가능한 주식 ID 목록'에서 복사한 정확한 UUID만 사용!"]
        }
      ],
      "prices": [
        {
          "stockId": "⚠️ 위 '사용 가능한 주식 ID 목록'에서 복사한 정확한 UUID만 사용!",
          "price": 가격숫자
        }
      ]
    }
  ]
}

**🚨 절대 규칙:**
1. stockId와 relatedStockIds에는 반드시 위 '사용 가능한 주식 ID 목록'의 정확한 UUID를 복사해서 사용하세요.
2. 절대로 임의의 UUID를 생성하지 마세요!
3. 주식 이름이나 심볼이 아닌, 위에 나열된 UUID 문자열을 그대로 사용하세요.
4. 반드시 유효한 JSON 형식으로만 응답하고, 다른 텍스트는 포함하지 마세요.
`;

  if (difficulty === "easy") {
    return `
당신은 초등학교 4학년(10살) 어린이를 위한 주식 투자 교육 게임 데이터를 만드는 선생님입니다.
아래 주식 정보를 바탕으로 ${totalDays}일간의 게임 데이터를 만들어 주세요.

**⚠️ 매우 중요: 주식 ID는 아래 목록의 정확한 UUID만 사용하세요!**

**사용 가능한 주식 ID 목록 (이 ID들만 사용! 절대로 다른 주식은 포함하지 마세요!):**
${stockList}

**🚨 절대 금지:**
- 위 목록에 없는 주식 ID를 절대로 사용하지 마세요!
- 위 목록에 있는 주식만 가격 정보를 생성하세요!
- 위 목록에 있는 주식만 뉴스의 relatedStockIds에 포함하세요!

**[쉬움 난이도 요구사항]**
1. 각 날짜마다 6개의 뉴스를 만들되, 마지막 날(${totalDays}일)은 뉴스가 없어야 합니다.
2. 각 뉴스는 다음날 주식 가격에 영향을 줘야 합니다.
3. 뉴스 작성 규칙:
   - 초등학교 4학년이 이해할 수 있는 쉬운 말을 쓰세요. 어려운 경제 용어는 쓰지 마세요.
   - 뉴스 제목은 15자 이내의 짧은 문장으로 만드세요.
   - 뉴스 내용은 50~80자로 짧고 명확하게 쓰세요.
   - 주가가 오르는 이유를 직접적으로 설명하세요. 예: "○○ 회사 아이스크림이 여름에 많이 팔려서 돈을 많이 벌었어요."
   - 일상에서 친숙한 소재(아이스크림, 게임, 문구, 음식, 장난감 등)를 사용하세요.
   - 반말 없이 친근한 설명체를 써주세요. (예: "~했어요", "~랍니다")
   - 뉴스 제목이 느낌표(!)로 끝나지 않아야 합니다.
   - 각 뉴스는 관련 주식을 1개만 지정하세요.
4. 주식 가격 규칙:
   - 첫날 가격은 실제 주가와 비슷하게 설정하세요.
   - 가격 변동폭은 작게 유지하세요:
     - 한국 주식: 하루에 최대 ±10% 이내
     - 미국·해외 주식: 하루에 최대 ±20% 이내
   - 가격은 천원 단위로 맞춰주세요. (예: 5,000원, 12,000원)
   - 해외 주식은 환율을 적용해 원화로 변환 후 천원 단위로 저장하세요.
   - 뉴스가 좋으면 다음날 가격이 오르고, 뉴스가 나쁘면 다음날 가격이 내려가도록 명확하게 연결해 주세요.
5. 가격 변동과 뉴스의 관계가 어린이도 쉽게 이해할 수 있도록 명확해야 합니다.
6. 위 목록에 있는 주식만 매일 가격 정보를 생성하세요.
${commonJson}`;
  }

  // 보통(normal) 난이도 — 기존 프롬프트
  return `
당신은 투자 교육 게임을 위한 데이터를 생성하는 전문가입니다.
아래 주식 정보를 바탕으로 ${totalDays}일간의 현실적인 게임 데이터를 생성해주세요.

**⚠️ 매우 중요: 주식 ID는 아래 목록의 정확한 UUID만 사용하세요!**

**사용 가능한 주식 ID 목록 (이 ID들만 사용! 절대로 다른 주식은 포함하지 마세요!):**
${stockList}

**🚨 절대 금지:**
- 위 목록에 없는 주식 ID를 절대로 사용하지 마세요!
- 위 목록에 있는 주식만 가격 정보를 생성하세요!
- 위 목록에 있는 주식만 뉴스의 relatedStockIds에 포함하세요!

**요구사항:**
1. 각 날짜마다 8개의 뉴스를 생성하되, 마지막 날(${totalDays}일)은 뉴스가 없어야 합니다.
2. 각 뉴스는 다음날 주식 가격에 영향을 줘야 합니다.
3. 뉴스는 현실적이고 교육적이어야 하며, 긍정적/부정적 영향을 골고루 포함해야 합니다.
4. 각 뉴스는 1-2개의 관련 주식을 지정해야 합니다.
   - 모든 뉴스는 관련 주식이 반드시 포함되어야 합니다.
   - 모든 뉴스 콘텐츠를 청소년이 뉴스를 보고 투자 학습에 사용되는 뉴스로 적절한 문구를 사용해야 합니다.
   - 모든 뉴스는 존댓말을 사용해야 합니다.
   - 모든 뉴스는 제목이 느낌표(!)로 끝나지 않아야 해.
5. 주식 가격은 다음 규칙을 따라주세요:
   - 처음 주식 가격이 실제 가격이랑 비슷하게 해줘
   - 가격 변동폭: 
     - 한국 주식은 20% ~ +20% 범위 내에서
     - 미국 주식은 40% ~ +40% 범위 내에서
   - 가격이 최대한 천원 단위로 밑은 없었으면 좋겠어
   - 주식 가격은 첫날을 제외하고 전날 관련 뉴스 영향을 받아야 해
   - 해외 주식의 경우 환율을 고려해서 원화로 수정한 뒤 값을 저장해줘, 이떄 최소 단위는 천원 단위로 부탁해
6. 뉴스의 영향력이 다음날 가격에 명확히 반영되어야 합니다.
7. 위 목록에 있는 주식만 매일 가격 정보를 생성하세요. 목록에 없는 주식은 절대 포함하지 마세요.
${commonJson}`;
}

/**
 * OpenAI API를 사용하여 게임 데이터 생성
 */
export const generateGameData = withAuth(
  async (
    user,
    params: {
      classId: string;
      totalDays: number;
      stocks: StockInfo[];
      difficulty?: "normal" | "easy";
    },
  ): Promise<{
    success: boolean;
    message: string;
    data?: GeneratedGameData;
  }> => {
    try {
      const { classId, totalDays, stocks, difficulty = "normal" } = params;

      const alreadySaved = {
        success: true,
        message: "이미 저장된 게임 데이터입니다.",
      };
      const [completed] = await db
        .select({ classId: gameDataGenerations.classId })
        .from(gameDataGenerations)
        .where(eq(gameDataGenerations.classId, classId));
      if (completed) return alreadySaved;

      if (!process.env.OPENAI_API_KEY) {
        throw new Error("관리자 서버에 OPENAI_API_KEY를 설정해 주세요.");
      }
      const validStockIds = new Set(stocks.map((stock) => stock.id));
      if (!validStockIds.size)
        throw new Error("게임에 사용할 종목을 선택해 주세요.");
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: process.env.OPENAI_GAME_MODEL || "gpt-4.1-mini",
            messages: [
              {
                role: "user",
                content: buildPrompt(difficulty, totalDays, stocks),
              },
            ],
            response_format: gameDataResponseFormat([...validStockIds]),
            store: false,
          }),
        },
      );
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (body?.error?.code === "insufficient_quota") {
          throw new Error("OpenAI API 사용 한도를 확인한 뒤 재시도해 주세요.");
        }
        throw new Error(
          `OpenAI API 요청 실패 (HTTP ${response.status}). 서버 설정과 API 상태를 확인해 주세요.`,
        );
      }
      const completion = (await response.json()).choices?.[0];
      if (
        completion?.finish_reason !== "stop" ||
        !completion.message?.content
      ) {
        throw new Error("AI 응답이 완성되지 않았습니다. 다시 시도해 주세요.");
      }
      const gameData: GeneratedGameData = JSON.parse(
        completion.message.content,
      );

      // 데이터 검증
      if (!gameData.days || !Array.isArray(gameData.days)) {
        throw new Error("올바른 게임 데이터 형식이 아닙니다.");
      }

      if (gameData.days.length !== totalDays) {
        throw new Error(`${totalDays}일치 데이터가 생성되지 않았습니다.`);
      }

      // stockId 검증
      for (const dayData of gameData.days) {
        if (dayData.prices) {
          for (const priceItem of dayData.prices) {
            if (!validStockIds.has(priceItem.stockId)) {
              throw new Error(
                "선택한 종목과 일치하지 않는 게임 데이터입니다. 다시 시도해 주세요.",
              );
            }
          }
        }
        if (dayData.news) {
          for (const newsItem of dayData.news) {
            if (newsItem.relatedStockIds) {
              for (const stockId of newsItem.relatedStockIds) {
                if (!validStockIds.has(stockId)) {
                  throw new Error(
                    "선택한 종목과 일치하지 않는 게임 데이터입니다. 다시 시도해 주세요.",
                  );
                }
              }
            }
          }
        }
      }

      // 마지막 날 뉴스 체크
      const lastDay = gameData.days[totalDays - 1];
      if (lastDay && lastDay.news && lastDay.news.length > 0) {
        lastDay.news = []; // 마지막 날은 뉴스 제거
      }

      // DB에 저장 (선택된 주식만 필터링하여 저장)
      const saved = await dbWithTransaction.transaction(async (tx) => {
        await lockEditableGame(tx, classId, user.id);
        const [claimed] = await tx
          .insert(gameDataGenerations)
          .values({ classId })
          .onConflictDoNothing()
          .returning({ classId: gameDataGenerations.classId });
        if (!claimed) return false;

        for (const dayData of gameData.days) {
          // 뉴스 저장 (마지막 날 제외, 선택된 주식과 관련된 뉴스만)
          if (dayData.news && dayData.news.length > 0) {
            for (const newsItem of dayData.news) {
              // 뉴스의 relatedStockIds가 선택된 주식 중 하나라도 포함되어 있는지 확인
              const hasValidStock = newsItem.relatedStockIds?.some((stockId) =>
                validStockIds.has(stockId),
              );

              // 선택된 주식과 관련된 뉴스만 저장
              if (hasValidStock) {
                // relatedStockIds를 선택된 주식만 필터링
                const filteredRelatedStockIds = newsItem.relatedStockIds.filter(
                  (stockId) => validStockIds.has(stockId),
                );

                await tx.insert(news).values({
                  classId,
                  day: dayData.day,
                  title: newsItem.title,
                  content: newsItem.content,
                  relatedStockIds: filteredRelatedStockIds,
                  createdBy: user.id,
                  updatedAt: new Date(),
                });
              }
            }
          }

          // 가격 정보 저장 (선택된 주식만)
          for (const priceItem of dayData.prices) {
            // 선택된 주식인지 확인
            if (validStockIds.has(priceItem.stockId)) {
              await tx.insert(classStockPrices).values({
                classId,
                stockId: priceItem.stockId,
                day: dayData.day,
                price: priceItem.price.toString(),
                updatedAt: new Date(),
              });
            }
          }
        }
        return true;
      });
      if (!saved) return alreadySaved;

      return {
        success: true,
        message: "게임 데이터가 성공적으로 생성되었습니다.",
        data: gameData,
      };
    } catch (error) {
      console.error("게임 데이터 생성 실패:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "게임 데이터 생성 중 오류가 발생했습니다.",
      };
    }
  },
);

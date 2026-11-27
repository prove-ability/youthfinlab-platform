import { classes, classMarketScenarios, dbWithTransaction } from "@repo/db";
import { and, eq } from "drizzle-orm";
export type GameTransaction = Parameters<
  Parameters<typeof dbWithTransaction.transaction>[0]
>[0];
export async function lockEditableGame(
  tx: GameTransaction,
  classId: string,
  userId: string,
) {
  const [course] = await tx
    .select()
    .from(classes)
    .where(and(eq(classes.id, classId), eq(classes.createdBy, userId)))
    .for("update");
  if (!course) throw new Error("수업 접근 권한이 없습니다.");
  const scenario = await tx.query.classMarketScenarios.findFirst({
    where: eq(classMarketScenarios.classId, classId),
  });
  if (scenario)
    throw new Error("이벤트 수업의 가격·뉴스는 확정되어 수정할 수 없습니다.");
  return course;
}
export async function editGameData<T>(
  classId: string,
  userId: string,
  action: (tx: GameTransaction) => Promise<T>,
): Promise<T> {
  return dbWithTransaction.transaction(async (tx) => {
    await lockEditableGame(tx, classId, userId);
    return action(tx);
  });
}

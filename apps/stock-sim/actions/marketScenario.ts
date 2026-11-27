"use server";
import {
  db,
  dbWithTransaction,
  classes,
  guests,
  classMarketScenarios,
  marketEventDecisions,
  marketPortfolioReviews,
} from "@repo/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { withAuth } from "@/lib/with-auth";
import { studentMarketView } from "@repo/db/crisis-engine";

export const getStudentMarketScenario = withAuth(async (user) => {
  const guest = await db.query.guests.findFirst({
    where: and(eq(guests.id, user.id), eq(guests.classId, user.classId)),
  });
  if (!guest) throw new Error("학생 정보를 확인할 수 없습니다.");
  const [course, configured] = await Promise.all([
    db.query.classes.findFirst({ where: eq(classes.id, guest.classId) }),
    db.query.classMarketScenarios.findFirst({
      where: eq(classMarketScenarios.classId, guest.classId),
    }),
  ]);
  if (!configured) return null;
  if (!course || course.status === "setting")
    throw new Error("수업이 아직 시작되지 않았습니다.");
  const decisions = await db
    .select({
      day: marketEventDecisions.day,
      reason: marketEventDecisions.reason,
      note: marketEventDecisions.note,
    })
    .from(marketEventDecisions)
    .where(
      and(
        eq(marketEventDecisions.guestId, user.id),
        eq(marketEventDecisions.classId, guest.classId),
      ),
    );
  const reviews = await db.query.marketPortfolioReviews.findMany({
    where: and(
      eq(marketPortfolioReviews.guestId, user.id),
      eq(marketPortfolioReviews.classId, guest.classId),
    ),
  });
  const view = studentMarketView(
    configured.scenario,
    course.currentDay,
    course.status,
    decisions,
  );
  return {
    ...view,
    history: view.history.map((h) => ({
      ...h,
      portfolio: reviews.find((r) => r.day === h.day)?.snapshot ?? null,
    })),
  };
});

const decisionSchema = z.object({
  day: z.number().int().min(1),
  reason: z.enum(["cash", "spread", "value", "wait", "maintain", "other"]),
  note: z.string().trim().max(500),
});
export const saveMarketDecision = withAuth(
  async (user, input: z.infer<typeof decisionSchema>) => {
    const value = decisionSchema.parse(input);
    await dbWithTransaction.transaction(async (tx) => {
      // Same lock as the teacher's Day advancement: a stale form cannot rewrite a past decision.
      const [course] = await tx
        .select()
        .from(classes)
        .where(eq(classes.id, user.classId))
        .for("share");
      const guest = await tx.query.guests.findFirst({
        where: and(eq(guests.id, user.id), eq(guests.classId, user.classId)),
      });
      const mode = await tx.query.classMarketScenarios.findFirst({
        where: eq(classMarketScenarios.classId, user.classId),
      });
      if (!guest || !mode || !course || course.status !== "active")
        throw new Error("진행 중인 이벤트 수업에서만 기록할 수 있습니다.");
      if (value.day >= mode.scenario.days.length)
        throw new Error("마지막 Day에는 이유 기록을 마감합니다.");
      if (course.currentDay !== value.day)
        throw new Error(
          "수업 Day가 바뀌었습니다. 새로고침 후 현재 속보를 확인해 주세요.",
        );
      await tx
        .insert(marketEventDecisions)
        .values({ ...value, classId: course.id, guestId: user.id })
        .onConflictDoUpdate({
          target: [
            marketEventDecisions.classId,
            marketEventDecisions.guestId,
            marketEventDecisions.day,
          ],
          set: {
            reason: value.reason,
            note: value.note,
            updatedAt: new Date(),
          },
        });
    });
    return { success: true as const };
  },
);

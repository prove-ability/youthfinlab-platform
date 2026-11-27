"use server";
import { prepareMarketScenario } from "../lib/prepare-market-scenario";
import {
  db,
  dbWithTransaction,
  classes,
  guests,
  classMarketScenarios,
  marketEventDecisions,
} from "@repo/db";
import { and, eq } from "drizzle-orm";
import { withAuth } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

export const configureMarketScenario = withAuth(
  async (user, input: Parameters<typeof prepareMarketScenario>[2]) => {
    await dbWithTransaction.transaction((tx) =>
      prepareMarketScenario(tx, user.id, input),
    );
    revalidatePath("/protected/game-management");
    return { success: true as const };
  },
);

export const getMarketScenarioAdmin = withAuth(
  async (user, classId: string) => {
    const course = await db.query.classes.findFirst({
      where: and(eq(classes.id, classId), eq(classes.createdBy, user.id)),
    });
    if (!course) throw new Error("수업 접근 권한이 없습니다.");
    const configured = await db.query.classMarketScenarios.findFirst({
      where: eq(classMarketScenarios.classId, classId),
    });
    const decisions = configured
      ? await db
          .select({
            day: marketEventDecisions.day,
            guestId: marketEventDecisions.guestId,
            reason: marketEventDecisions.reason,
            note: marketEventDecisions.note,
            name: guests.name,
          })
          .from(marketEventDecisions)
          .innerJoin(guests, eq(guests.id, marketEventDecisions.guestId))
          .where(eq(marketEventDecisions.classId, classId))
      : [];
    const participants = configured
      ? await db
          .select({ id: guests.id })
          .from(guests)
          .where(eq(guests.classId, classId))
      : [];
    const completed = new Set(
      decisions
        .filter((d) => d.day === course.currentDay)
        .map((d) => d.guestId),
    ).size;
    return {
      currentDay: course.currentDay,
      participation: {
        total: participants.length,
        completed,
        missing: participants.length - completed,
      },
      scenario: configured?.scenario ?? null,
      decisions,
      status: course.status,
    };
  },
);

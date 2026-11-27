// Local UI boundary fixtures; actual server actions are tested against PGlite.
import { state, stocks } from "./fixtures";
export const audit = {
  calls: [] as unknown[],
  payments: 0,
  failNext: false,
  loseResponse: false,
  creates: [] as Record<string, FormDataEntryValue>[],
  aiCalls: 0,
};
Object.assign(window, { eventAudit: audit });
export const getGameManagementData = async () => ({
  classes: [
    {
      id: "preview-course",
      name: "체험 수업",
      client: { id: "client", name: "검수 고객사" },
      currentDay: state.day,
      totalDays: 10,
      status: "active",
    },
  ],
  stocks: [],
  prices: [],
  gameProgress: { maxDay: 10 },
  eventMode: true,
});
export const incrementDayAndPayAllowance = async (
  id: string,
  day: number,
  override = false,
) => {
  audit.calls.push({ id, day, override });
  if (audit.failNext) {
    audit.failNext = false;
    throw Error("연결 실패 · 다시 시도하세요.");
  }
  if (day !== state.day)
    return { success: false, error: "수업 Day가 이미 변경되었습니다." };
  if (!override)
    return {
      success: false,
      needsConfirmation: true,
      message: "아직 3명이 이유를 남기지 않았습니다. 그대로 진행할까요?",
    };
  state.day++;
  audit.payments++;
  if (audit.loseResponse) {
    audit.loseResponse = false;
    throw Error("응답 연결이 끊겼습니다. 현재 Day를 확인하세요.");
  }
  return { success: true, newDay: state.day };
};
export const updateClassCurrentDay = async () => {
  throw Error("이벤트에서는 되돌릴 수 없습니다.");
};
export const createClass = async (data: FormData) => {
  audit.creates.push(Object.fromEntries(data));
  return { message: "이벤트 수업 준비 완료", data: { id: "created" } };
};
export const getClientsAndManagers = async () => ({
  clients: [{ id: "client", name: "검수 고객사" }],
  managers: [{ id: "manager", clientId: "client", name: "담당 강사" }],
});
export const getStocks = async () => stocks;
export const generateGameData = async () => {
  audit.aiCalls++;
  return { success: true };
};

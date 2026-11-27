const mode = new URLSearchParams(location.search).get("mode") || "fail";
window.loadingTest = { calls: {}, fail: false, navigation: null };
window.loadingRequest = async (name, args) => {
  const state = window.loadingTest;
  state.calls[name] = (state.calls[name] || 0) + 1;
  await new Promise((r) =>
    setTimeout(r, state.delay || (mode === "slow" ? 5000 : 500)),
  );
  const fail =
    state.fail ||
    mode === "always-fail" ||
    (mode === "fail" && state.calls[name] === 1);
  if (fail) {
    if (name === "getClients")
      return { success: false, data: [], message: "Simulated failure" };
    throw Error("Simulated read failure");
  }
  if (name === "getClients")
    return {
      success: true,
      data: [{ id: "test-client", name: "검증용 교육기관", managers: [] }],
    };
  if (name === "getClasses") return { success: true, data: [] };
  if (name === "getStocks") return [];
  if (name === "getGameManagementData")
    return {
      classes: ["a", "b"].map((id) => ({
        id,
        name: "검증 수업 " + id,
        client: { id: "client", name: "검증 고객사" },
        currentDay: 1,
        totalDays: 5,
      })),
      stocks: [],
      prices: [],
      gameProgress: null,
    };
  if (name === "getDashboardAll")
    return {
      success: true,
      data: {
        stats: {
          totalClients: 1,
          totalClasses: 0,
          totalGuests: 0,
          totalSurveys: 0,
          totalTransactions: 0,
          activeGames: 0,
          averageRating: 0,
          recentClassesCount: 0,
        },
        recentClasses: [],
        recentGuests: [],
        classProgress: [],
        recentSurveys: [],
      },
    };
  if (name === "getOrCreateSimulation")
    return {
      id: "test-sim",
      currentStep: 1,
      profile: null,
      savingsInvestmentResult: null,
      pensionResult: null,
      investmentTendency: null,
    };
  if (name === "getDashboardData")
    return {
      currentDay: 1,
      totalDays: 5,
      className: "검증 수업",
      userName: "샘플",
      totalAssets: 100000,
      balance: 100000,
      totalHoldingValue: 0,
      profit: 0,
      profitRate: 0,
      holdingStocks: [],
      latestBenefit: null,
    };
  if (name === "getAllNews") return { news: [], currentDay: 1 };
  if (name === "getClassRanking") return { rankings: [], currentDay: 1 };
  if (name === "getStocksForInvest")
    return {
      stocks: [],
      balance: 100000,
      currentDay: 1,
      totalDays: 5,
      profit: 0,
      profitRate: 0,
    };
  if (name === "getTransactionHistory") return [];
  throw Error("Write or unsupported action blocked in preview: " + name);
};
document.getElementById("refresh-fail").onclick = () => {
  window.loadingTest.fail = true;
  window.queryClient.invalidateQueries();
};
document.getElementById("refresh-ok").onclick = () => {
  window.loadingTest.fail = false;
  window.queryClient.invalidateQueries();
};

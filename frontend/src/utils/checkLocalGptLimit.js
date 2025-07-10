// src/utils/checkLocalGptLimit.js
export const checkLocalGptLimit = () => {
  const max = 5; // 1일 최대 호출 수
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem("gptLimit") || "{}");

  if (saved.date !== today) {
    localStorage.setItem("gptLimit", JSON.stringify({ date: today, count: 1 }));
    return true;
  }

  if (saved.count >= max) {
    return false;
  }

  saved.count += 1;
  localStorage.setItem("gptLimit", JSON.stringify(saved));
  return true;
};


export const getRemainingGptCalls = () => {
  const max = 5;
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem("gptLimit") || "{}");
  if (saved.date !== today) return max;
  return Math.max(0, max - (saved.count || 0));
};

const sessionsStore = new Map();

export const sessionsRepository = {
  createSession: (token, userId) => {
    sessionsStore.set(token, String(userId));
    return token;
  },
  getUserIdByToken: (token) => sessionsStore.get(token) ?? null,
  deleteSession: (token) => sessionsStore.delete(token),
  clearAll: () => sessionsStore.clear(),
};

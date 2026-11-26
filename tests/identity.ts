import { randomUUID } from "node:crypto";
export const admin = { id: randomUUID() };
export const stackServerApp = { getUser: async () => admin };
export let student;
export const createSession = async (user) => {
  student = user;
};
export const getSession = async () => student;
export const withAuth =
  (action) =>
  (...args) =>
    action(student, ...args);
export const deleteSession = async () => {
  student = null;
};

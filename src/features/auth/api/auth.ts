import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import type { Therapist } from "@/entities/user/model";
import { http } from "@/shared/api/http";
import { queryKeys } from "@/shared/api/queryKeys";
import { sessionStore } from "@/shared/api/sessionStore";

type Tokens = { accessToken: string; refreshToken: string; user?: Therapist };

const saveTokens = (tokens: Tokens) => {
  sessionStore.setSession(tokens.accessToken, tokens.refreshToken);
};

export const login = async (email: string, password: string) => {
  const data = await http<Tokens>("/auth/login", {
    method: "POST",
    auth: false,
    clinic: false,
    body: { email, password },
  });
  saveTokens(data);
  return data;
};

export const signup = async (email: string, password: string) => {
  const data = await http<Tokens>("/auth/signup", {
    method: "POST",
    auth: false,
    clinic: false,
    body: { email, password },
  });
  saveTokens(data);
  return data;
};

export const confirmAccount = async (confirmationToken: string) => {
  const data = await http<Tokens>("/auth/confirm-account", {
    method: "POST",
    auth: false,
    clinic: false,
    body: { confirmationToken },
  });
  saveTokens(data);
};

export const resendConfirmation = (email: string) =>
  http<unknown>("/auth/resend-confirmation-token", {
    method: "POST",
    auth: false,
    clinic: false,
    body: { email },
  });

export const requestPasswordReset = (email: string) =>
  http<unknown>("/auth/request-password-reset", {
    method: "POST",
    auth: false,
    clinic: false,
    body: { email },
  });

export const validateResetToken = (email: string, token: string) =>
  http<unknown>("/auth/validate-reset-token", {
    method: "POST",
    auth: false,
    clinic: false,
    body: { email, token },
  });

export const resetPassword = (email: string, token: string, newPassword: string) =>
  http<unknown>("/auth/reset-password", {
    method: "POST",
    auth: false,
    clinic: false,
    body: { email, token, newPassword },
  });

export const fetchMe = () => http<Therapist>("/user/me", { clinic: false });

export const submitOnboarding = (body: { firstName: string; lastName: string; specialty: string }) =>
  http<unknown>("/user/onboarding-submit", { method: "POST", clinic: false, body });

export const uploadMyAvatar = (file: File) => {
  const body = new FormData();
  body.append("avatar", file);
  return http<unknown>("/user/me/avatar", { method: "PUT", clinic: false, body });
};

export const deleteMyAvatar = () => http<unknown>("/user/me/avatar", { method: "DELETE", clinic: false });

export const deleteAccount = () => http<unknown>("/user/me", { method: "DELETE", clinic: false });

export const logout = async () => {
  const refreshToken = sessionStore.getRefresh();
  sessionStore.clear();
  if (!refreshToken) return;
  await http<unknown>("/auth/logout", {
    method: "POST",
    auth: false,
    clinic: false,
    body: { refreshToken },
  }).catch(() => undefined);
};

export const useHasSession = () =>
  useSyncExternalStore(
    sessionStore.subscribe,
    () => Boolean(sessionStore.getRefresh()),
    () => false,
  );

export const useAccount = () => {
  const hasSession = useHasSession();
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    enabled: hasSession,
  });
};

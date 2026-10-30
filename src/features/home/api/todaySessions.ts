import { listSessions } from "@/features/sessions/api/sessions";

export const fetchLastSessions = (userId: string, page: number) =>
  listSessions({
    page,
    path: "/session/last-sessions",
    therapistIds: [userId],
  });

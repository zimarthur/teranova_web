import { patientInitials } from "@/entities/patient/model";

export const PatientAvatar = ({
  firstName,
  lastName,
  avatarUrl,
  size = "sm",
}: {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  size?: "sm" | "lg";
}) => {
  const box = size === "lg" ? "h-20 w-20 text-2xl" : "h-9 w-9 text-xs";
  if (avatarUrl) {
    return <img src={avatarUrl} alt="" className={`${box} shrink-0 rounded-full object-cover`} />;
  }
  return (
    <span className={`${box} inline-flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand`}>
      {patientInitials({ firstName, lastName })}
    </span>
  );
};

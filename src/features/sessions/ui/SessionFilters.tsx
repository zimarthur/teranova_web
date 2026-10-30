import { datePresetLabel, presetRange, type DatePreset } from "@/entities/session/model";

export type SessionFilterValue = {
  therapistIds: string[];
  patientIds: string[];
  preset: DatePreset | null;
  mine: boolean;
};

export const SessionFilters = ({
  value,
  onChange,
}: {
  value: SessionFilterValue;
  onChange: (value: SessionFilterValue) => void;
}) => (
  <div className="flex flex-wrap items-center gap-2 text-sm">
    <button type="button" aria-pressed={value.mine} className={`min-h-11 rounded-md border px-4 ${value.mine ? "border-soil bg-soil text-sheet" : "border-line bg-sheet"}`} onClick={() => onChange({ ...value, mine: !value.mine })}>
      {value.mine ? "Mostrando as minhas sessões" : "Só as minhas sessões"}
    </button>
    {(Object.keys(datePresetLabel) as DatePreset[]).map((preset) => (
      <button
        key={preset}
        type="button"
        aria-pressed={value.preset === preset}
        className={`min-h-11 rounded-md border px-4 ${value.preset === preset ? "border-soil bg-soil text-sheet" : "border-line bg-sheet"}`}
        onClick={() => onChange({ ...value, preset: value.preset === preset ? null : preset })}
      >
        {datePresetLabel[preset]}
      </button>
    ))}
    <button type="button" className="min-h-11 px-2 text-quiet" onClick={() => onChange({ therapistIds: [], patientIds: [], preset: null, mine: false })}>Limpar</button>
    <span className="sr-only">{value.preset ? presetRange(value.preset).from : ""}</span>
  </div>
);

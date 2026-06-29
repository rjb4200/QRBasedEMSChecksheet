import type { RestockingGroup } from "@/lib/restocking-list";

export type DailyUnitCheckStatus = "checked" | "incomplete" | "not_started" | "not_required";

export type DailyUnitException = {
  targetName: string;
  itemName: string;
  issue: string;
  actual: string;
  expected: string;
};

export type ArchiveSearchParams = {
  unitId?: string;
  from?: string;
  to?: string;
};

export type SectionComment = {
  sourceName: string;
  comment: string;
};

export type DailyUnitRecord = {
  archiveId: string | null;
  date: string;
  shiftPeriod: string;
  operationalDate: string;
  shiftName: string;
  unitId: string;
  unitName: string;
  unitStatus: string;
  archived: boolean;
  statusNote: string;
  archiveStatus: string;
  checkStatus: DailyUnitCheckStatus;
  completedCompartments: number;
  totalCompartments: number;
  completionPercentage: number;
  exceptions: DailyUnitException[];
  restockingList: RestockingGroup[];
  sectionComments: SectionComment[];
  providerNames: string;
  comments: string;
  crewLocked: boolean;
  startedAt: string | null;
  submittedAt: string | null;
  lastActivityAt: string | null;
  timeToCompleteSeconds: number | null;
  checkedByName: string;
  hasArchive: boolean;
};

export type DailyArchiveReport = {
  date: string;
  generatedAt: string;
  records: DailyUnitRecord[];
};

export type DailyRecordGroup = {
  date: string;
  completedInServiceUnits: number;
  totalInServiceUnits: number;
  records: DailyUnitRecord[];
};

export type UnitRow = {
  id: string;
  name: string;
  status: string;
  unit_compartments?: { id: string }[] | null;
  unit_kits?: { id: string }[] | null;
};

export type LedgerRow = {
  id: string;
  shift_date: string;
  shift_period: string;
  unit_id: string;
  unit_name: string;
  unit_status: string;
  total_compartments: number;
  archived: boolean | null;
  status_note: string | null;
};

export type ArchiveRow = {
  id: string;
  shift_date: string;
  shift_period: string;
  unit_id: string;
  status: string;
  completion_percentage: number | null;
  completed_compartments: number | null;
  total_compartments: number | null;
  operational_date: string | null;
  started_at: string | null;
  submitted_at: string | null;
  last_activity_at: string | null;
  time_to_complete_seconds: number | null;
  shift_calendar?: { shift_name: string } | { shift_name: string }[] | null;
  users?: { full_name: string | null; email: string | null } | { full_name: string | null; email: string | null }[] | null;
  units?: { name: string } | { name: string }[] | null;
};

export type CheckRow = {
  shift_date: string;
  shift_period: string;
  unit_id: string;
  compartment_id?: string | null;
  unit_kit_id?: string | null;
  status: string;
  completed_at?: string | null;
  updated_at?: string | null;
  item_data?: Record<string, unknown> | null;
  units?: UnitRow | UnitRow[] | null;
  unit_compartments?: { name: string } | { name: string }[] | null;
  unit_kits?: { kits: { name: string } | { name: string }[] | null } | { kits: { name: string } | { name: string }[] | null }[] | null;
};

export type ItemRow = {
  id: string;
  par_level: number | null;
  input_type: "quantity" | "checkbox" | "condition";
  equipment_catalog: { name: string } | { name: string }[] | null;
};

export type CrewRow = {
  shift_date: string;
  shift_period: string;
  unit_id: string;
  provider_names: string | null;
  locked: boolean | null;
  units?: { name: string } | { name: string }[] | null;
};

export type CommentRow = {
  shift_date: string;
  shift_period: string;
  unit_id: string;
  comment: string | null;
};

export type SectionCommentRow = {
  shift_date: string;
  shift_period: string;
  unit_id: string;
  source_name: string;
  comment: string;
};

export type DailyRecordReadModelInput = {
  date: string;
  ledgers: LedgerRow[];
  archives: ArchiveRow[];
  crews: CrewRow[];
  checks: CheckRow[];
  comments: CommentRow[];
  sectionComments?: SectionCommentRow[];
  itemMap?: Map<string, ItemRow>;
  unitStatusMap?: Map<string, string>;
};

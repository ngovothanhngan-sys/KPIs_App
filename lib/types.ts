export type UserRole = "HR" | "ADMIN" | "STAFF" | "LINE_MANAGER" | "HEAD_OF_DEPT" | "BOD"

export type KpiType = "QUANT_HIGHER_BETTER" | "QUANT_LOWER_BETTER" | "MILESTONE" | "BOOLEAN" | "BEHAVIOR"

export type ApprovalStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_LM"
  | "PENDING_HOD"
  | "PENDING_BOD"
  | "APPROVED"
  | "REJECTED"
  | "LOCKED_GOALS"
  | "LOCKED_ACTUALS"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  orgUnitId: string
  managerId?: string
  status: "ACTIVE" | "INACTIVE"
  locale: "vi-VN" | "en-US"
  createdAt: Date
}

export interface OrgUnit {
  id: string
  name: string
  parentId?: string
  type: string
}

export interface KpiDefinition {
  id: string
  cycleId: string
  userId: string
  title: string
  type: KpiType
  unit: string
  target: number
  formula?: string
  weight: number
  dataSource?: string
  ownerId: string
  status: ApprovalStatus
  createdAt: Date
  submittedAt?: Date
  lastModifiedAt?: Date
  rejectionReason?: string
}

export interface Cycle {
  id: string
  name: string
  periodStart: Date
  periodEnd: Date
  type: "Yearly" | "Semi-Annual" | "Quarterly"
  status: "DRAFT" | "ACTIVE" | "CLOSED"
  createdBy: string
}

export interface Approval {
  id: string
  kpiDefinitionId: string
  level: 1 | 2 | 3
  approverId: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  comment?: string
  decidedAt?: Date
  createdAt: Date
}

export interface ApprovalWorkflow {
  kpiId: string
  currentLevel: 1 | 2 | 3 | null
  level1?: Approval
  level2?: Approval
  level3?: Approval
  isComplete: boolean
  finalStatus: "APPROVED" | "REJECTED" | "PENDING"
}

// Add KpiTemplate interface
export interface KpiTemplate {
  id: string
  name: string
  department: string
  description: string
  kpiFields: KpiTemplateField[]
  defaultWeights: Record<string, number>
  createdBy: string
  createdAt: Date
  isActive: boolean
}

export interface KpiTemplateField {
  id: string
  title: string
  type: KpiType
  unit: string
  description: string
  dataSource?: string
  formula?: string
  targetRange?: {
    min: number
    max: number
    recommended: number
  }
  weight: number
  isRequired: boolean
  evidenceRequired: boolean
}

export interface KpiActual {
  id: string
  kpiDefinitionId: string
  actualValue: number
  percentage: number
  score: number
  selfComment?: string
  evidenceFiles?: EvidenceFile[]
  submittedAt?: Date
  status: ApprovalStatus
  lastModifiedAt?: Date
}

export interface EvidenceFile {
  id: string
  actualId: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedBy: string
  uploadedAt: Date
  description?: string
}

export interface PerformanceEvaluation {
  id: string
  cycleId: string
  userId: string
  kpiActuals: KpiActual[]
  overallScore: number
  overallPercentage: number
  totalWeight: number
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "COMPLETED"
  submittedAt?: Date
  completedAt?: Date
  managerComment?: string
  calibrationAdjustment?: number
  finalScore?: number
}

export interface ScoreBand {
  score: number
  minPercentage: number
  maxPercentage?: number
  label: string
  color: string
  description: string
}

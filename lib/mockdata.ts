import type { User, OrgUnit, Cycle, KpiDefinition, Approval, UserRole, KpiTemplate } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@intersnack.com.vn",
    role: "HR",
    orgUnitId: "1",
    status: "ACTIVE",
    locale: "en-US",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@intersnack.com.vn",
    role: "ADMIN",
    orgUnitId: "1",
    status: "ACTIVE",
    locale: "en-US",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike.chen@intersnack.com.vn",
    role: "STAFF",
    orgUnitId: "2",
    managerId: "4",
    status: "ACTIVE",
    locale: "en-US",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "Lisa Wang",
    email: "lisa.wang@intersnack.com.vn",
    role: "LINE_MANAGER",
    orgUnitId: "2",
    managerId: "5",
    status: "ACTIVE",
    locale: "en-US",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@intersnack.com.vn",
    role: "HEAD_OF_DEPT",
    orgUnitId: "2",
    managerId: "6",
    status: "ACTIVE",
    locale: "en-US",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "6",
    name: "Emma Wilson",
    email: "emma.wilson@intersnack.com.vn",
    role: "BOD",
    orgUnitId: "1",
    status: "ACTIVE",
    locale: "en-US",
    createdAt: new Date("2024-01-01"),
  },
]

export const mockOrgUnits: OrgUnit[] = [
  { id: "1", name: "VICC Headquarters", type: "COMPANY" },
  { id: "2", name: "R&D Department", parentId: "1", type: "DEPARTMENT" },
  { id: "3", name: "Sales Department", parentId: "1", type: "DEPARTMENT" },
  { id: "4", name: "HSE Department", parentId: "1", type: "DEPARTMENT" },
]

export const mockCycles: Cycle[] = [
  {
    id: "1",
    name: "2025 Annual KPI Cycle",
    periodStart: new Date("2025-01-01"),
    periodEnd: new Date("2025-12-31"),
    type: "Yearly",
    status: "ACTIVE",
    createdBy: "1",
  },
  {
    id: "2",
    name: "Q1 2025 KPI Cycle",
    periodStart: new Date("2025-01-01"),
    periodEnd: new Date("2025-03-31"),
    type: "Quarterly",
    status: "ACTIVE",
    createdBy: "1",
  },
]

export const mockKpiDefinitions: KpiDefinition[] = [
  {
    id: "1",
    cycleId: "1",
    userId: "3",
    title: "Reduce Internal NCR Cases",
    type: "QUANT_LOWER_BETTER",
    unit: "cases",
    target: 12,
    weight: 25,
    dataSource: "eQMS",
    ownerId: "3",
    status: "PENDING_LM",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    cycleId: "1",
    userId: "3",
    title: "New Product Development",
    type: "MILESTONE",
    unit: "milestones",
    target: 5,
    weight: 30,
    dataSource: "Project Management System",
    ownerId: "3",
    status: "DRAFT",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "3",
    cycleId: "1",
    userId: "3",
    title: "Cost Reduction Achievement",
    type: "QUANT_HIGHER_BETTER",
    unit: "percentage",
    target: 15,
    weight: 25,
    dataSource: "Financial System",
    ownerId: "3",
    status: "APPROVED",
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "4",
    cycleId: "1",
    userId: "3",
    title: "Team Leadership Excellence",
    type: "BEHAVIOR",
    unit: "score",
    target: 4,
    weight: 20,
    dataSource: "360 Feedback",
    ownerId: "3",
    status: "SUBMITTED",
    createdAt: new Date("2025-01-12"),
  },
]

export const mockApprovals: Approval[] = [
  {
    id: "1",
    kpiDefinitionId: "1",
    level: 1,
    approverId: "4",
    status: "PENDING",
    comment: "Reviewing the target feasibility",
  },
  {
    id: "2",
    kpiDefinitionId: "3",
    level: 1,
    approverId: "4",
    status: "APPROVED",
    comment: "Target looks achievable based on historical data",
    decidedAt: new Date("2025-01-11"),
  },
  {
    id: "3",
    kpiDefinitionId: "3",
    level: 2,
    approverId: "5",
    status: "APPROVED",
    comment: "Aligned with department objectives",
    decidedAt: new Date("2025-01-12"),
  },
  {
    id: "4",
    kpiDefinitionId: "3",
    level: 3,
    approverId: "6",
    status: "APPROVED",
    comment: "Approved for implementation",
    decidedAt: new Date("2025-01-13"),
  },
]

export const mockKpiTemplates: KpiTemplate[] = [
  {
    id: "1",
    name: "R&D Department KPI Template",
    department: "R&D",
    description: "Standard KPI template for Research & Development team members",
    kpiFields: [
      {
        id: "1",
        title: "Reduce Internal NCR Cases",
        type: "QUANT_LOWER_BETTER",
        unit: "cases",
        description: "Number of internal non-conformance reports generated",
        dataSource: "eQMS System",
        targetRange: { min: 5, max: 20, recommended: 12 },
        weight: 25,
        isRequired: true,
        evidenceRequired: true,
      },
      {
        id: "2",
        title: "New Product Development Milestones",
        type: "MILESTONE",
        unit: "milestones",
        description: "Key milestones achieved in new product development",
        dataSource: "Project Management System",
        targetRange: { min: 3, max: 8, recommended: 5 },
        weight: 30,
        isRequired: true,
        evidenceRequired: true,
      },
      {
        id: "3",
        title: "Cost Reduction Achievement",
        type: "QUANT_HIGHER_BETTER",
        unit: "percentage",
        description: "Percentage cost reduction achieved vs baseline",
        dataSource: "Financial System",
        targetRange: { min: 5, max: 25, recommended: 15 },
        weight: 25,
        isRequired: false,
        evidenceRequired: true,
      },
      {
        id: "4",
        title: "Team Leadership Excellence",
        type: "BEHAVIOR",
        unit: "score",
        description: "Leadership competency score from 360 feedback",
        dataSource: "360 Feedback System",
        targetRange: { min: 3, max: 5, recommended: 4 },
        weight: 20,
        isRequired: false,
        evidenceRequired: false,
      },
    ],
    defaultWeights: {
      quality: 25,
      innovation: 30,
      efficiency: 25,
      leadership: 20,
    },
    createdBy: "1",
    createdAt: new Date("2024-12-01"),
    isActive: true,
  },
  {
    id: "2",
    name: "Sales Department KPI Template",
    department: "Sales",
    description: "Standard KPI template for Sales team members",
    kpiFields: [
      {
        id: "5",
        title: "Revenue Target Achievement",
        type: "QUANT_HIGHER_BETTER",
        unit: "percentage",
        description: "Percentage of revenue target achieved",
        dataSource: "CRM System",
        targetRange: { min: 80, max: 120, recommended: 100 },
        weight: 40,
        isRequired: true,
        evidenceRequired: true,
      },
      {
        id: "6",
        title: "New Customer Acquisition",
        type: "QUANT_HIGHER_BETTER",
        unit: "customers",
        description: "Number of new customers acquired",
        dataSource: "CRM System",
        targetRange: { min: 10, max: 50, recommended: 25 },
        weight: 30,
        isRequired: true,
        evidenceRequired: true,
      },
      {
        id: "7",
        title: "Customer Satisfaction Score",
        type: "QUANT_HIGHER_BETTER",
        unit: "score",
        description: "Average customer satisfaction rating",
        dataSource: "Survey System",
        targetRange: { min: 4.0, max: 5.0, recommended: 4.5 },
        weight: 30,
        isRequired: true,
        evidenceRequired: false,
      },
    ],
    defaultWeights: {
      revenue: 40,
      acquisition: 30,
      satisfaction: 30,
    },
    createdBy: "1",
    createdAt: new Date("2024-12-01"),
    isActive: true,
  },
]

// Mock authentication service
export const mockAuthService = {
  getCurrentUser: (): User | null => {
    const storedUser = localStorage.getItem("currentUser")
    return storedUser ? JSON.parse(storedUser) : null
  },

  login: (email: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.email === email)
        if (user && email.endsWith("@intersnack.com.vn")) {
          localStorage.setItem("currentUser", JSON.stringify(user))
          resolve(user)
        } else {
          resolve(null)
        }
      }, 1000)
    })
  },

  logout: (): void => {
    localStorage.removeItem("currentUser")
  },
}

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    HR: "Human Resources",
    ADMIN: "System Administrator",
    STAFF: "Staff Member",
    LINE_MANAGER: "Line Manager",
    HEAD_OF_DEPT: "Head of Department",
    BOD: "Board of Directors",
  }
  return roleNames[role]
}

export const getApprovalLevelName = (level: 1 | 2 | 3): string => {
  const levelNames = {
    1: "Line Manager",
    2: "Head of Department",
    3: "Board of Directors",
  }
  return levelNames[level]
}

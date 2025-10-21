export enum TestStatus {
  DRAFT = 'DRAFT',                    // Just created, basic info only
  DEFINING_AUDIENCES = 'DEFINING_AUDIENCES',  // Setting up audiences
  BUILDING_SURVEY = 'BUILDING_SURVEY',       // Creating questions
  READY_TO_LAUNCH = 'READY_TO_LAUNCH',       // Ready for simulation
  RUNNING = 'RUNNING',                       // Simulation in progress
  ANALYZING = 'ANALYZING',                   // Processing results
  COMPLETED = 'COMPLETED',                   // Analysis done
  ARCHIVED = 'ARCHIVED'                      // User archived
}

export const STATUS_CONFIG = {
  [TestStatus.DRAFT]: {
    label: 'Draft',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    description: 'Basic information entered',
    nextAction: 'Continue Setup',
    nextRoute: (testId: string) => `/dashboard/test/${testId}/audience`
  },
  [TestStatus.DEFINING_AUDIENCES]: {
    label: 'Defining Audiences',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    description: 'Setting up target audiences',
    nextAction: 'Continue Audience Setup',
    nextRoute: (testId: string) => `/dashboard/test/${testId}/audience`
  },
  [TestStatus.BUILDING_SURVEY]: {
    label: 'Building Survey',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    description: 'Creating survey questions',
    nextAction: 'Continue Survey Builder',
    nextRoute: (testId: string) => `/dashboard/test/${testId}/survey`
  },
  [TestStatus.READY_TO_LAUNCH]: {
    label: 'Ready to Launch',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    description: 'Ready for simulation',
    nextAction: 'Launch Simulation',
    nextRoute: (testId: string) => `/dashboard/test/${testId}/launch`
  },
  [TestStatus.RUNNING]: {
    label: 'Running',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    description: 'Simulation in progress',
    nextAction: 'View Progress',
    nextRoute: (testId: string) => `/dashboard/test/${testId}/processing`
  },
  [TestStatus.ANALYZING]: {
    label: 'Analyzing',
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    description: 'Analyzing results',
    nextAction: 'View Progress',
    nextRoute: (testId: string) => `/dashboard/test/${testId}/processing`
  },
  [TestStatus.COMPLETED]: {
    label: 'Completed',
    color: 'emerald',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    description: 'Analysis complete',
    nextAction: 'View Results',
    nextRoute: (testId: string) => `/dashboard/test/${testId}/results`
  },
  [TestStatus.ARCHIVED]: {
    label: 'Archived',
    color: 'slate',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    description: 'Archived survey',
    nextAction: 'Restore',
    nextRoute: (testId: string) => `/dashboard/test/${testId}`
  }
}

export function getStatusConfig(status: TestStatus) {
  return STATUS_CONFIG[status]
}

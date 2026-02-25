// ── Mock Data for Meridien Layer POC ──────────────────────────────────────────

export type TeamId = 'orion' | 'andromeda' | 'pegasus' | 'lyra' | 'vega'

export interface Team {
  id: TeamId
  name: string
  lead: string
  color: string
  bgColor: string
  memberCount: number
  projectKey: string
  focus: string
}

export interface Feature {
  id: string
  key: string
  name: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  quarter: string
  description: string
}

export interface TeamFeatureEntry {
  teamId: TeamId
  featureId: string
  issueCount: number
  storyPoints: number
  status: 'on-track' | 'at-risk' | 'behind' | 'not-started'
}

export interface DuplicateCandidate {
  id: string
  issueA: { key: string; summary: string; teamId: TeamId; assignee: string; type: string }
  issueB: { key: string; summary: string; teamId: TeamId; assignee: string; type: string }
  score: number
  reasons: ('title' | 'labels' | 'components' | 'epic')[]
}

export interface Dependency {
  id: string
  name: string
  type: 'service' | 'database' | 'library' | 'queue' | 'storage'
  teams: TeamId[]
  issueCount: number
  riskLevel: 'high' | 'medium' | 'low'
}

export interface SprintCapacity {
  sprintId: number
  sprintName: string
  state: 'active' | 'upcoming'
  startDate: string
  endDate: string
  teams: {
    teamId: TeamId
    totalPoints: number
    completedPoints: number
    memberCount: number
    members: {
      name: string
      avatar: string
      assignedPoints: number
      completedPoints: number
      status: 'overloaded' | 'optimal' | 'available'
    }[]
  }[]
}

// ── Teams ─────────────────────────────────────────────────────────────────────

export const TEAMS: Team[] = [
  {
    id: 'orion',
    name: 'Team Orion',
    lead: 'Sarah Chen',
    color: '#6370ef',
    bgColor: 'rgba(99,112,239,0.15)',
    memberCount: 6,
    projectKey: 'ORI',
    focus: 'Backend Platform',
  },
  {
    id: 'andromeda',
    name: 'Team Andromeda',
    lead: 'Marcus Webb',
    color: '#22d3ee',
    bgColor: 'rgba(34,211,238,0.15)',
    memberCount: 7,
    projectKey: 'AND',
    focus: 'Frontend Platform',
  },
  {
    id: 'pegasus',
    name: 'Team Pegasus',
    lead: 'Priya Nair',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    memberCount: 5,
    projectKey: 'PEG',
    focus: 'Mobile',
  },
  {
    id: 'lyra',
    name: 'Team Lyra',
    lead: 'James Okafor',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    memberCount: 6,
    projectKey: 'LYR',
    focus: 'Data & Analytics',
  },
  {
    id: 'vega',
    name: 'Team Vega',
    lead: 'Ana Sousa',
    color: '#f43f5e',
    bgColor: 'rgba(244,63,94,0.15)',
    memberCount: 4,
    projectKey: 'VEG',
    focus: 'DevOps & Infrastructure',
  },
]

// ── Product Features / Epics ──────────────────────────────────────────────────

export const FEATURES: Feature[] = [
  {
    id: 'f-001',
    key: 'FEAT-001',
    name: 'Authentication & SSO Overhaul',
    priority: 'critical',
    quarter: 'Q1 2026',
    description: 'Replace legacy auth system with OAuth 2.0 + SAML SSO across all surfaces',
  },
  {
    id: 'f-002',
    key: 'FEAT-002',
    name: 'Real-time Notifications',
    priority: 'high',
    quarter: 'Q1 2026',
    description: 'Push and in-app notifications via WebSocket and APNs/FCM',
  },
  {
    id: 'f-003',
    key: 'FEAT-003',
    name: 'Payment Gateway v2',
    priority: 'critical',
    quarter: 'Q1 2026',
    description: 'Replace Stripe v1 with Stripe v3 including SCA compliance',
  },
  {
    id: 'f-004',
    key: 'FEAT-004',
    name: 'Analytics Dashboard',
    priority: 'high',
    quarter: 'Q2 2026',
    description: 'Self-serve analytics with custom chart builder and data exports',
  },
  {
    id: 'f-005',
    key: 'FEAT-005',
    name: 'API Rate Limiting & Security',
    priority: 'high',
    quarter: 'Q1 2026',
    description: 'Per-tenant rate limiting, DDoS protection, API key rotation',
  },
  {
    id: 'f-006',
    key: 'FEAT-006',
    name: 'Dark Mode & Accessibility',
    priority: 'medium',
    quarter: 'Q2 2026',
    description: 'System-aware dark theme and WCAG AA accessibility compliance',
  },
  {
    id: 'f-007',
    key: 'FEAT-007',
    name: 'Mobile Offline Support',
    priority: 'medium',
    quarter: 'Q2 2026',
    description: 'Optimistic UI + sync queue for offline-first mobile experience',
  },
]

// ── Team × Feature Alignment ──────────────────────────────────────────────────
// null = team has no tickets → GAP
// entry = team is working on it

export const ALIGNMENT: TeamFeatureEntry[] = [
  // Auth & SSO — 3 teams, 2 gaps
  { teamId: 'orion',     featureId: 'f-001', issueCount: 14, storyPoints: 55, status: 'on-track' },
  { teamId: 'andromeda', featureId: 'f-001', issueCount: 9,  storyPoints: 34, status: 'on-track' },
  { teamId: 'pegasus',   featureId: 'f-001', issueCount: 5,  storyPoints: 21, status: 'at-risk'  },
  // lyra → GAP (no mobile data layer for auth)
  // vega → GAP (infra not scoped)

  // Real-time Notifications — 4 teams, 1 gap
  { teamId: 'orion',     featureId: 'f-002', issueCount: 11, storyPoints: 42, status: 'on-track' },
  { teamId: 'andromeda', featureId: 'f-002', issueCount: 7,  storyPoints: 28, status: 'on-track' },
  { teamId: 'pegasus',   featureId: 'f-002', issueCount: 6,  storyPoints: 24, status: 'on-track' },
  { teamId: 'vega',      featureId: 'f-002', issueCount: 3,  storyPoints: 13, status: 'on-track' },
  // lyra → GAP

  // Payment Gateway — 2 teams, 3 gaps
  { teamId: 'orion',     featureId: 'f-003', issueCount: 18, storyPoints: 72, status: 'behind'   },
  { teamId: 'andromeda', featureId: 'f-003', issueCount: 8,  storyPoints: 31, status: 'at-risk'  },
  // pegasus → GAP (no mobile payment yet scoped)
  // lyra → GAP
  // vega → GAP

  // Analytics Dashboard — 2 teams, 3 gaps
  { teamId: 'andromeda', featureId: 'f-004', issueCount: 12, storyPoints: 47, status: 'on-track' },
  { teamId: 'lyra',      featureId: 'f-004', issueCount: 15, storyPoints: 58, status: 'on-track' },
  // orion → GAP (API not built yet)
  // pegasus → GAP
  // vega → GAP

  // API Rate Limiting — 3 teams, 2 gaps
  { teamId: 'orion',     featureId: 'f-005', issueCount: 10, storyPoints: 38, status: 'on-track' },
  { teamId: 'andromeda', featureId: 'f-005', issueCount: 4,  storyPoints: 16, status: 'on-track' },
  { teamId: 'vega',      featureId: 'f-005', issueCount: 8,  storyPoints: 31, status: 'at-risk'  },
  // lyra → GAP
  // pegasus → GAP

  // Dark Mode — 2 teams, 3 gaps
  { teamId: 'andromeda', featureId: 'f-006', issueCount: 16, storyPoints: 62, status: 'on-track' },
  { teamId: 'pegasus',   featureId: 'f-006', issueCount: 9,  storyPoints: 36, status: 'on-track' },
  // orion → GAP
  // lyra → GAP
  // vega → GAP

  // Mobile Offline — 3 teams (andromeda + pegasus both building similar!)
  { teamId: 'pegasus',   featureId: 'f-007', issueCount: 13, storyPoints: 52, status: 'on-track' },
  { teamId: 'andromeda', featureId: 'f-007', issueCount: 8,  storyPoints: 32, status: 'on-track' }, // ← OVERLAP FLAG
  { teamId: 'orion',     featureId: 'f-007', issueCount: 5,  storyPoints: 19, status: 'on-track' },
]

// ── Duplicate Work Candidates ─────────────────────────────────────────────────

export const DUPLICATES: DuplicateCandidate[] = [
  {
    id: 'd-001',
    issueA: { key: 'ORI-234', summary: 'Implement SSO authentication flow with SAML 2.0', teamId: 'orion',     assignee: 'Liam Torres',   type: 'Story' },
    issueB: { key: 'AND-189', summary: 'Build SSO login integration for web frontend',     teamId: 'andromeda', assignee: 'Nina Park',     type: 'Story' },
    score: 0.89,
    reasons: ['title', 'labels', 'epic'],
  },
  {
    id: 'd-002',
    issueA: { key: 'ORI-198', summary: 'Push notification delivery service via WebSocket', teamId: 'orion', assignee: 'Ravi Krishnan', type: 'Story' },
    issueB: { key: 'VEG-067', summary: 'WebSocket notification broadcast infrastructure',  teamId: 'vega',  assignee: 'Carlos Lima',  type: 'Story' },
    score: 0.84,
    reasons: ['title', 'components'],
  },
  {
    id: 'd-003',
    issueA: { key: 'ORI-301', summary: 'Rate limiting middleware for REST API endpoints',  teamId: 'orion', assignee: 'Sarah Chen',   type: 'Task'  },
    issueB: { key: 'VEG-112', summary: 'API throttling and rate limit configuration',      teamId: 'vega',  assignee: 'Ana Sousa',   type: 'Story' },
    score: 0.82,
    reasons: ['title', 'labels'],
  },
  {
    id: 'd-004',
    issueA: { key: 'AND-244', summary: 'Analytics chart widgets with drill-down support',  teamId: 'andromeda', assignee: 'Marcus Webb',  type: 'Story' },
    issueB: { key: 'LYR-078', summary: 'Interactive analytics chart components library',   teamId: 'lyra',      assignee: 'Zoe Fischer',  type: 'Story' },
    score: 0.77,
    reasons: ['title', 'components', 'epic'],
  },
  {
    id: 'd-005',
    issueA: { key: 'PEG-156', summary: 'Offline data sync queue for mobile app',          teamId: 'pegasus',   assignee: 'Priya Nair',   type: 'Story' },
    issueB: { key: 'AND-301', summary: 'Client-side data caching for offline mode',        teamId: 'andromeda', assignee: 'Dev Sharma',   type: 'Story' },
    score: 0.73,
    reasons: ['title', 'epic'],
  },
  {
    id: 'd-006',
    issueA: { key: 'ORI-412', summary: 'User session token refresh and revocation',       teamId: 'orion',     assignee: 'Liam Torres',  type: 'Task'  },
    issueB: { key: 'AND-378', summary: 'Frontend token refresh and session management',    teamId: 'andromeda', assignee: 'Nina Park',    type: 'Task'  },
    score: 0.69,
    reasons: ['title', 'labels'],
  },
]

// ── Shared Dependencies ───────────────────────────────────────────────────────

export const DEPENDENCIES: Dependency[] = [
  {
    id: 'dep-001',
    name: 'Auth Service',
    type: 'service',
    teams: ['orion', 'andromeda', 'pegasus'],
    issueCount: 28,
    riskLevel: 'high',
  },
  {
    id: 'dep-002',
    name: 'Notification Queue',
    type: 'queue',
    teams: ['orion', 'vega', 'andromeda'],
    issueCount: 17,
    riskLevel: 'high',
  },
  {
    id: 'dep-003',
    name: 'PostgreSQL (Primary DB)',
    type: 'database',
    teams: ['orion', 'lyra', 'vega'],
    issueCount: 24,
    riskLevel: 'medium',
  },
  {
    id: 'dep-004',
    name: 'Redis Cache',
    type: 'database',
    teams: ['orion', 'vega'],
    issueCount: 11,
    riskLevel: 'medium',
  },
  {
    id: 'dep-005',
    name: 'Kafka Event Bus',
    type: 'queue',
    teams: ['orion', 'lyra', 'vega'],
    issueCount: 19,
    riskLevel: 'high',
  },
  {
    id: 'dep-006',
    name: 'React Component Library',
    type: 'library',
    teams: ['andromeda', 'pegasus'],
    issueCount: 33,
    riskLevel: 'medium',
  },
  {
    id: 'dep-007',
    name: 'S3 Object Storage',
    type: 'storage',
    teams: ['lyra', 'vega'],
    issueCount: 8,
    riskLevel: 'low',
  },
  {
    id: 'dep-008',
    name: 'Payment API (Stripe)',
    type: 'service',
    teams: ['orion', 'andromeda'],
    issueCount: 14,
    riskLevel: 'high',
  },
]

// ── Sprint Capacity ───────────────────────────────────────────────────────────

export const SPRINTS: SprintCapacity[] = [
  {
    sprintId: 42,
    sprintName: 'Sprint 42',
    state: 'active',
    startDate: '2026-02-10',
    endDate: '2026-02-24',
    teams: [
      {
        teamId: 'orion',
        totalPoints: 78,
        completedPoints: 41,
        memberCount: 6,
        members: [
          { name: 'Sarah Chen',    avatar: 'SC', assignedPoints: 18, completedPoints: 10, status: 'overloaded' },
          { name: 'Liam Torres',   avatar: 'LT', assignedPoints: 16, completedPoints: 9,  status: 'overloaded' },
          { name: 'Ravi Krishnan', avatar: 'RK', assignedPoints: 15, completedPoints: 8,  status: 'overloaded' },
          { name: 'Mei Nakamura',  avatar: 'MN', assignedPoints: 12, completedPoints: 7,  status: 'optimal'    },
          { name: 'Tom Bradley',   avatar: 'TB', assignedPoints: 10, completedPoints: 5,  status: 'optimal'    },
          { name: 'Kat Diaz',      avatar: 'KD', assignedPoints: 7,  completedPoints: 2,  status: 'optimal'    },
        ],
      },
      {
        teamId: 'andromeda',
        totalPoints: 45,
        completedPoints: 28,
        memberCount: 7,
        members: [
          { name: 'Marcus Webb',   avatar: 'MW', assignedPoints: 9,  completedPoints: 6,  status: 'optimal'    },
          { name: 'Nina Park',     avatar: 'NP', assignedPoints: 8,  completedPoints: 5,  status: 'optimal'    },
          { name: 'Dev Sharma',    avatar: 'DS', assignedPoints: 8,  completedPoints: 4,  status: 'optimal'    },
          { name: 'Chloe Martin',  avatar: 'CM', assignedPoints: 7,  completedPoints: 5,  status: 'optimal'    },
          { name: 'Aiden Kim',     avatar: 'AK', assignedPoints: 6,  completedPoints: 4,  status: 'optimal'    },
          { name: 'Rosa Lima',     avatar: 'RL', assignedPoints: 5,  completedPoints: 3,  status: 'available'  },
          { name: 'Sam Hughes',    avatar: 'SH', assignedPoints: 2,  completedPoints: 1,  status: 'available'  },
        ],
      },
      {
        teamId: 'pegasus',
        totalPoints: 52,
        completedPoints: 22,
        memberCount: 5,
        members: [
          { name: 'Priya Nair',    avatar: 'PN', assignedPoints: 16, completedPoints: 7,  status: 'overloaded' },
          { name: 'Jordan Scott',  avatar: 'JS', assignedPoints: 13, completedPoints: 6,  status: 'overloaded' },
          { name: 'Mia Chen',      avatar: 'MC', assignedPoints: 10, completedPoints: 4,  status: 'optimal'    },
          { name: 'Eli Watts',     avatar: 'EW', assignedPoints: 8,  completedPoints: 3,  status: 'optimal'    },
          { name: 'Isha Patel',    avatar: 'IP', assignedPoints: 5,  completedPoints: 2,  status: 'available'  },
        ],
      },
      {
        teamId: 'lyra',
        totalPoints: 28,
        completedPoints: 20,
        memberCount: 6,
        members: [
          { name: 'James Okafor',  avatar: 'JO', assignedPoints: 7,  completedPoints: 5,  status: 'optimal'    },
          { name: 'Zoe Fischer',   avatar: 'ZF', assignedPoints: 6,  completedPoints: 5,  status: 'optimal'    },
          { name: 'Leo Wang',      avatar: 'LW', assignedPoints: 5,  completedPoints: 4,  status: 'available'  },
          { name: 'Nora Bell',     avatar: 'NB', assignedPoints: 4,  completedPoints: 3,  status: 'available'  },
          { name: 'Omar Ali',      avatar: 'OA', assignedPoints: 4,  completedPoints: 2,  status: 'available'  },
          { name: 'Grace Kim',     avatar: 'GK', assignedPoints: 2,  completedPoints: 1,  status: 'available'  },
        ],
      },
      {
        teamId: 'vega',
        totalPoints: 35,
        completedPoints: 18,
        memberCount: 4,
        members: [
          { name: 'Ana Sousa',     avatar: 'AS', assignedPoints: 11, completedPoints: 6,  status: 'overloaded' },
          { name: 'Carlos Lima',   avatar: 'CL', assignedPoints: 10, completedPoints: 5,  status: 'optimal'    },
          { name: 'Tara Singh',    avatar: 'TS', assignedPoints: 9,  completedPoints: 4,  status: 'optimal'    },
          { name: 'Ben Fox',       avatar: 'BF', assignedPoints: 5,  completedPoints: 3,  status: 'available'  },
        ],
      },
    ],
  },
  {
    sprintId: 43,
    sprintName: 'Sprint 43',
    state: 'upcoming',
    startDate: '2026-02-25',
    endDate: '2026-03-11',
    teams: [
      {
        teamId: 'orion',
        totalPoints: 65,
        completedPoints: 0,
        memberCount: 6,
        members: [
          { name: 'Sarah Chen',    avatar: 'SC', assignedPoints: 15, completedPoints: 0, status: 'overloaded' },
          { name: 'Liam Torres',   avatar: 'LT', assignedPoints: 13, completedPoints: 0, status: 'overloaded' },
          { name: 'Ravi Krishnan', avatar: 'RK', assignedPoints: 12, completedPoints: 0, status: 'overloaded' },
          { name: 'Mei Nakamura',  avatar: 'MN', assignedPoints: 11, completedPoints: 0, status: 'optimal'    },
          { name: 'Tom Bradley',   avatar: 'TB', assignedPoints: 9,  completedPoints: 0, status: 'optimal'    },
          { name: 'Kat Diaz',      avatar: 'KD', assignedPoints: 5,  completedPoints: 0, status: 'available'  },
        ],
      },
      {
        teamId: 'andromeda',
        totalPoints: 40,
        completedPoints: 0,
        memberCount: 7,
        members: [
          { name: 'Marcus Webb',   avatar: 'MW', assignedPoints: 8,  completedPoints: 0, status: 'optimal'   },
          { name: 'Nina Park',     avatar: 'NP', assignedPoints: 7,  completedPoints: 0, status: 'optimal'   },
          { name: 'Dev Sharma',    avatar: 'DS', assignedPoints: 6,  completedPoints: 0, status: 'optimal'   },
          { name: 'Chloe Martin',  avatar: 'CM', assignedPoints: 6,  completedPoints: 0, status: 'optimal'   },
          { name: 'Aiden Kim',     avatar: 'AK', assignedPoints: 5,  completedPoints: 0, status: 'available' },
          { name: 'Rosa Lima',     avatar: 'RL', assignedPoints: 5,  completedPoints: 0, status: 'available' },
          { name: 'Sam Hughes',    avatar: 'SH', assignedPoints: 3,  completedPoints: 0, status: 'available' },
        ],
      },
      {
        teamId: 'pegasus',
        totalPoints: 35,
        completedPoints: 0,
        memberCount: 5,
        members: [
          { name: 'Priya Nair',    avatar: 'PN', assignedPoints: 10, completedPoints: 0, status: 'optimal'   },
          { name: 'Jordan Scott',  avatar: 'JS', assignedPoints: 9,  completedPoints: 0, status: 'optimal'   },
          { name: 'Mia Chen',      avatar: 'MC', assignedPoints: 7,  completedPoints: 0, status: 'optimal'   },
          { name: 'Eli Watts',     avatar: 'EW', assignedPoints: 6,  completedPoints: 0, status: 'optimal'   },
          { name: 'Isha Patel',    avatar: 'IP', assignedPoints: 3,  completedPoints: 0, status: 'available' },
        ],
      },
      {
        teamId: 'lyra',
        totalPoints: 22,
        completedPoints: 0,
        memberCount: 6,
        members: [
          { name: 'James Okafor',  avatar: 'JO', assignedPoints: 5,  completedPoints: 0, status: 'available' },
          { name: 'Zoe Fischer',   avatar: 'ZF', assignedPoints: 5,  completedPoints: 0, status: 'available' },
          { name: 'Leo Wang',      avatar: 'LW', assignedPoints: 4,  completedPoints: 0, status: 'available' },
          { name: 'Nora Bell',     avatar: 'NB', assignedPoints: 4,  completedPoints: 0, status: 'available' },
          { name: 'Omar Ali',      avatar: 'OA', assignedPoints: 3,  completedPoints: 0, status: 'available' },
          { name: 'Grace Kim',     avatar: 'GK', assignedPoints: 1,  completedPoints: 0, status: 'available' },
        ],
      },
      {
        teamId: 'vega',
        totalPoints: 55,
        completedPoints: 0,
        memberCount: 4,
        members: [
          { name: 'Ana Sousa',     avatar: 'AS', assignedPoints: 18, completedPoints: 0, status: 'overloaded' },
          { name: 'Carlos Lima',   avatar: 'CL', assignedPoints: 16, completedPoints: 0, status: 'overloaded' },
          { name: 'Tara Singh',    avatar: 'TS', assignedPoints: 14, completedPoints: 0, status: 'overloaded' },
          { name: 'Ben Fox',       avatar: 'BF', assignedPoints: 7,  completedPoints: 0, status: 'optimal'    },
        ],
      },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getTeam(id: TeamId): Team {
  return TEAMS.find(t => t.id === id)!
}

export function getAlignmentEntry(teamId: TeamId, featureId: string): TeamFeatureEntry | undefined {
  return ALIGNMENT.find(a => a.teamId === teamId && a.featureId === featureId)
}

export function getTeamLoad(teamId: TeamId, sprintId: number): number {
  const sprint = SPRINTS.find(s => s.sprintId === sprintId)
  if (!sprint) return 0
  const team = sprint.teams.find(t => t.teamId === teamId)
  if (!team) return 0
  return parseFloat((team.totalPoints / team.memberCount).toFixed(1))
}

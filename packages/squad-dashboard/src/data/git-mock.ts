export interface GitFile {
  name: string
  type: 'file' | 'dir'
  size?: number
  lastCommit: string
  lastCommitDate: string
}

export interface GitBranch {
  name: string
  isDefault: boolean
  isProtected: boolean
  ahead: number
  behind: number
  lastCommit: string
  lastCommitDate: string
  author: string
  worktree?: string
}

export interface GitCommit {
  hash: string
  shortHash: string
  message: string
  author: string
  date: string
  branch: string
  parents: string[]
  additions: number
  deletions: number
  filesChanged: number
}

export interface DiffFile {
  path: string
  status: 'added' | 'modified' | 'deleted' | 'renamed'
  additions: number
  deletions: number
  hunks: DiffHunk[]
}

export interface DiffHunk {
  header: string
  lines: DiffLine[]
}

export interface DiffLine {
  type: 'context' | 'addition' | 'deletion'
  lineOld?: number
  lineNew?: number
  content: string
}

export const repoFiles: GitFile[] = [
  { name: '.github', type: 'dir', lastCommit: 'Add fork-publish workflow', lastCommitDate: '2026-03-25' },
  { name: 'docs', type: 'dir', lastCommit: 'Update documentation structure', lastCommitDate: '2026-03-24' },
  { name: 'packages', type: 'dir', lastCommit: 'Add squad-dashboard package', lastCommitDate: '2026-03-25' },
  { name: 'samples', type: 'dir', lastCommit: 'Initial commit', lastCommitDate: '2026-03-20' },
  { name: 'test', type: 'dir', lastCommit: 'Convert test files to ESM', lastCommitDate: '2026-03-25' },
  { name: '.gitignore', type: 'file', size: 245, lastCommit: 'Initial commit', lastCommitDate: '2026-03-20' },
  { name: 'CHANGELOG.md', type: 'file', size: 12400, lastCommit: 'Update changelog', lastCommitDate: '2026-03-24' },
  { name: 'LICENSE', type: 'file', size: 1082, lastCommit: 'Initial commit', lastCommitDate: '2026-03-20' },
  { name: 'README.md', type: 'file', size: 8340, lastCommit: 'Update README with fork docs', lastCommitDate: '2026-03-25' },
  { name: 'index.cjs', type: 'file', size: 45200, lastCommit: 'Rename index.js to index.cjs', lastCommitDate: '2026-03-25' },
  { name: 'package.json', type: 'file', size: 1840, lastCommit: 'Update package scope', lastCommitDate: '2026-03-25' },
  { name: 'package-lock.json', type: 'file', size: 284000, lastCommit: 'Update package scope', lastCommitDate: '2026-03-25' },
]

export const branches: GitBranch[] = [
  {
    name: 'main',
    isDefault: true,
    isProtected: true,
    ahead: 0,
    behind: 0,
    lastCommit: 'Update README with fork documentation',
    lastCommitDate: '2026-03-25T15:37:00Z',
    author: 'Copilot',
  },
  {
    name: 'dev',
    isDefault: false,
    isProtected: false,
    ahead: 0,
    behind: 12,
    lastCommit: 'Sync upstream dev',
    lastCommitDate: '2026-03-22T10:00:00Z',
    author: 'JerrettDavis',
  },
  {
    name: 'copilot/fix-ci-cd-tests',
    isDefault: false,
    isProtected: false,
    ahead: 2,
    behind: 0,
    lastCommit: 'fix: convert JS test files to ESM',
    lastCommitDate: '2026-03-25T16:40:00Z',
    author: 'Copilot',
  },
  {
    name: 'feature/squad-dashboard',
    isDefault: false,
    isProtected: false,
    ahead: 5,
    behind: 0,
    lastCommit: 'Add Playwright e2e tests with screenshots',
    lastCommitDate: '2026-03-25T21:20:00Z',
    author: 'Claude Bot',
    worktree: 'C:\\git\\claude-squad',
  },
]

export const commits: GitCommit[] = [
  {
    hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    shortHash: 'a1b2c3d',
    message: 'Add Playwright e2e tests with screenshots',
    author: 'Claude Bot',
    date: '2026-03-25T21:20:00Z',
    branch: 'feature/squad-dashboard',
    parents: ['b2c3d4e'],
    additions: 180,
    deletions: 0,
    filesChanged: 3,
  },
  {
    hash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
    shortHash: 'b2c3d4e',
    message: 'Build squad dashboard MVP with React + Vite + shadcn/ui',
    author: 'Claude Bot',
    date: '2026-03-25T21:15:00Z',
    branch: 'feature/squad-dashboard',
    parents: ['c8a332d'],
    additions: 850,
    deletions: 112,
    filesChanged: 18,
  },
  {
    hash: 'c8a332d5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
    shortHash: 'c8a332d',
    message: 'Add Fork Quickstart section to README',
    author: 'Copilot',
    date: '2026-03-25T15:45:00Z',
    branch: 'main',
    parents: ['6253c3f'],
    additions: 12,
    deletions: 0,
    filesChanged: 1,
  },
  {
    hash: '6253c3f5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
    shortHash: '6253c3f',
    message: 'Update README with fork documentation and @jerrettdavis scope',
    author: 'Copilot',
    date: '2026-03-25T15:37:00Z',
    branch: 'main',
    parents: ['725b6bc'],
    additions: 85,
    deletions: 23,
    filesChanged: 1,
  },
  {
    hash: '725b6bcf6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
    shortHash: '725b6bc',
    message: 'fix: convert JS test files to ESM, rename CJS entry points, fix CLI bugs',
    author: 'Copilot',
    date: '2026-03-25T16:40:00Z',
    branch: 'copilot/fix-ci-cd-tests',
    parents: ['62227d8'],
    additions: 1820,
    deletions: 1790,
    filesChanged: 12,
  },
  {
    hash: '62227d8a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
    shortHash: '62227d8',
    message: 'fix: convert .js test files to ESM and fix CLI bugs revealed by tests',
    author: 'Copilot',
    date: '2026-03-25T16:35:00Z',
    branch: 'copilot/fix-ci-cd-tests',
    parents: ['59b83ac'],
    additions: 1494,
    deletions: 1491,
    filesChanged: 11,
  },
  {
    hash: '59b83ac1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
    shortHash: '59b83ac',
    message: 'Switch package scope to @jerrettdavis, add fork-publish workflow',
    author: 'Copilot',
    date: '2026-03-25T13:00:00Z',
    branch: 'main',
    parents: ['aabbccd'],
    additions: 340,
    deletions: 28,
    filesChanged: 6,
  },
]

export const sampleDiff: DiffFile[] = [
  {
    path: 'index.cjs',
    status: 'modified',
    additions: 13,
    deletions: 1,
    hunks: [
      {
        header: '@@ -3,7 +3,7 @@',
        lines: [
          { type: 'context', lineOld: 3, lineNew: 3, content: "const fs = require('fs');" },
          { type: 'context', lineOld: 4, lineNew: 4, content: "const path = require('path');" },
          { type: 'context', lineOld: 5, lineNew: 5, content: '' },
          { type: 'deletion', lineOld: 6, content: "const { calculatePrRework, calculateReworkSummary } = require('./lib/rework');" },
          { type: 'addition', lineNew: 6, content: "const { calculatePrRework, calculateReworkSummary } = require('./lib/rework.cjs');" },
          { type: 'context', lineOld: 7, lineNew: 7, content: '' },
        ],
      },
      {
        header: '@@ -583,6 +583,13 @@',
        lines: [
          { type: 'context', lineOld: 583, lineNew: 583, content: "const PROJECT_TYPE_SENSITIVE_WORKFLOWS = new Set([" },
          { type: 'context', lineOld: 584, lineNew: 584, content: "  'squad-docs.yml'," },
          { type: 'context', lineOld: 585, lineNew: 585, content: ']);\n' },
          { type: 'addition', lineNew: 586, content: '// CI/CD workflows installed only on upgrade (not on fresh init)' },
          { type: 'addition', lineNew: 587, content: 'const CICD_ONLY_WORKFLOWS = new Set([' },
          { type: 'addition', lineNew: 588, content: "  'squad-ci.yml'," },
          { type: 'addition', lineNew: 589, content: "  'squad-release.yml'," },
          { type: 'addition', lineNew: 590, content: "  'squad-preview.yml'," },
          { type: 'addition', lineNew: 591, content: ']);' },
          { type: 'context', lineOld: 586, lineNew: 592, content: '' },
        ],
      },
    ],
  },
]

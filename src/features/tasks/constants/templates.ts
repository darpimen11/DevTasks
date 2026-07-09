export interface TaskTemplate {
  id: string
  name: string
  content: string
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'bug-report',
    name: 'Bug Report',
    content: `## Expected Behavior
  What should happen?

  ## Current Behavior
  What is happening now (the bug)?

  ## Steps to Reproduce
  1. Open page X
  2. Click button Y
  3. See error Z

  ## Additional Information
* **Browser:** Chrome / Firefox / Safari
  * **Version:** v1.0.0
`
  },
  {
    id: 'feature-request',
    name: 'Feature Request',
    content: `## What is the problem?
  Describe the problem this feature aims to solve.

  ## Proposed Solution
  How should the feature work?

  ## Considered Alternatives
  What other solutions were considered?

  ## Acceptance Criteria
  - [ ] The user can do X
  - [ ] The system returns Y
`
  },
  {
    id: 'simple-task',
    name: 'Simple Task',
    content: `## Goal
  Brief description of this task's goal.

## Checklist
  - [ ] Step 1
  - [ ] Step 2
`
  }
]

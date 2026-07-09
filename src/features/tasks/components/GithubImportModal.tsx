import React, { useState } from 'react'
import { GitPullRequest, AlertCircle, CheckSquare, Square } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { toast } from 'sonner'
import { useTasksStore } from '../../../store/tasksStore'

interface GithubIssue {
  id: number
  number: number
  title: string
  body: string
  html_url: string
}

interface GithubImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export const GithubImportModal: React.FC<GithubImportModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useTasksStore()
  const [repo, setRepo] = useState('')
  const [issues, setIssues] = useState<GithubIssue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssueIds, setSelectedIssueIds] = useState<Set<number>>(new Set())
  const [importing, setImporting] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedRepo = repo.trim()
    if (!trimmedRepo.includes('/')) {
      setError('Invalid format. Use owner/repo (e.g. facebook/react)')
      return
    }

    setLoading(true)
    setError(null)
    setIssues([])
    setSelectedIssueIds(new Set())

    try {
      const response = await fetch(`https://api.github.com/repos/${trimmedRepo}/issues?state=open&per_page=30`)
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          throw new Error('Request limit exceeded. Please try again later.')
        }
        if (response.status === 404) {
          throw new Error('Repository not found. Make sure it is public and the name is correct.')
        }
        throw new Error('Error fetching issues.')
      }

      const data = await response.json()
      // GitHub API returns PRs as issues too, we might want to filter them out if needed, but it's fine to keep them
      setIssues(data)
      if (data.length === 0) {
        toast.info('No open issues found in this repository.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const toggleSelection = (id: number) => {
    const next = new Set(selectedIssueIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIssueIds(next)
  }

  const toggleAll = () => {
    if (selectedIssueIds.size === issues.length) {
      setSelectedIssueIds(new Set())
    } else {
      setSelectedIssueIds(new Set(issues.map(i => i.id)))
    }
  }

  const handleImport = async () => {
    if (selectedIssueIds.size === 0) return
    
    setImporting(true)
    try {
      const issuesToImport = issues.filter(i => selectedIssueIds.has(i.id))
      for (const issue of issuesToImport) {
        addTask(
          issue.title,
          issue.body || 'No description.',
          'medium',
          undefined,
          ['github'],
          [],
          issue.html_url
        )
      }
      toast.success(`${issuesToImport.length} task(s) imported successfully!`)
      onClose()
      // reset states after closing
      setTimeout(() => {
        setRepo('')
        setIssues([])
        setSelectedIssueIds(new Set())
        setError(null)
      }, 300)
    } finally {
      setImporting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import from GitHub">
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="owner/repo (e.g. facebook/react)"
            className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            autoFocus
          />
          <Button type="submit" disabled={loading || !repo.trim()} variant="primary">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-400/10 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {issues.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-text-secondary">{issues.length} issues found</span>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-accent hover:underline"
              >
                {selectedIssueIds.size === issues.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {issues.map(issue => (
                <div 
                  key={issue.id}
                  onClick={() => toggleSelection(issue.id)}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface hover:border-accent/50 cursor-pointer transition-colors"
                >
                  <div className="pt-0.5">
                    {selectedIssueIds.has(issue.id) ? (
                      <CheckSquare className="w-4 h-4 text-accent" />
                    ) : (
                      <Square className="w-4 h-4 text-text-secondary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-text-primary line-clamp-1">{issue.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-secondary">#{issue.number}</span>
                      <a 
                        href={issue.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-accent hover:underline inline-flex items-center gap-1"
                      >
                        <GitPullRequest className="w-3 h-3" />
                        Ver no GitHub
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="primary"
            onClick={handleImport}
            disabled={selectedIssueIds.size === 0 || importing}
          >
            {importing ? 'Importing...' : `Import Selected (${selectedIssueIds.size})`}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

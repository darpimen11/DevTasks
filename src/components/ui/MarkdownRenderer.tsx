import React from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '../../hooks/useTheme'

interface MarkdownRendererProps {
  content: string
  variant?: 'full' | 'preview'
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, variant = 'full' }) => {
  const { theme } = useTheme()
  const isPreview = variant === 'preview'
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      const codeContent = String(children).replace(/\n$/, '')

      if (isPreview && match) {
        const firstLine = codeContent.trim().split('\n')[0] || 'Trecho de codigo'

        return (
          <div className="my-1.5 max-w-full overflow-hidden rounded-md border border-border bg-background/70 px-2 py-1.5 font-mono text-[11px] leading-snug text-text-secondary">
            <div className="truncate">{firstLine}</div>
          </div>
        )
      }

      return match ? (
        <SyntaxHighlighter
          children={codeContent}
          style={theme === 'dark' ? vscDarkPlus : vs}
          language={match[1]}
          PreTag="div"
          wrapLongLines
          className="max-w-full overflow-x-auto rounded-md border border-border text-sm !my-2"
          customStyle={{
            margin: 0,
            padding: '1rem',
            backgroundColor: 'var(--surface)',
            maxWidth: '100%',
          }}
        />
      ) : (
        <code {...props} className={`${className} break-words bg-accent/10 text-accent px-1.5 py-0.5 rounded text-xs font-mono`}>
          {children}
        </code>
      )
    },
  }

  return (
    <div
      className={`prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent ${
        isPreview
          ? 'text-xs prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-1 prose-blockquote:my-1 [&_*]:max-w-full'
          : ''
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

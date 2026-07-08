import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '../../hooks/useTheme'

interface MarkdownRendererProps {
  content: string
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { theme } = useTheme()

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={theme === 'dark' ? vscDarkPlus : vs}
                language={match[1]}
                PreTag="div"
                className="rounded-md border border-border text-sm !my-2"
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  backgroundColor: 'var(--color-surface)',
                }}
              />
            ) : (
              <code {...props} className={`${className} bg-accent/10 text-accent px-1.5 py-0.5 rounded text-xs font-mono`}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

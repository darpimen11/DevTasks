import React from 'react'

interface PageWrapperProps {
  sidebar: React.ReactNode
  header: React.ReactNode
  children: React.ReactNode
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ sidebar, header, children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-primary">
      {sidebar}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {header}
        <main className="flex-1 overflow-y-auto bg-background/50 p-4 md:p-8">
          <div className="max-w-3xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

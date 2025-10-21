'use client'

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'

export function ThemeDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Colors Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Primary Colors */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-secondary">Primary Scale</h4>
            <div className="flex gap-2 flex-wrap">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                <div key={shade} className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-lg bg-primary-${shade} border border-light-border-primary dark:border-dark-border-primary`}
                  />
                  <span className="text-xs text-tertiary mt-1">{shade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accent Colors */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-secondary">Accent Colors</h4>
            <div className="flex gap-2 flex-wrap">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-accent-purple" />
                <span className="text-xs text-tertiary mt-1">Purple</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-accent-cyan" />
                <span className="text-xs text-tertiary mt-1">Cyan</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-accent-emerald" />
                <span className="text-xs text-tertiary mt-1">Emerald</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-accent-amber" />
                <span className="text-xs text-tertiary mt-1">Amber</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-accent-rose" />
                <span className="text-xs text-tertiary mt-1">Rose</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-secondary">Badge Variants</h4>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


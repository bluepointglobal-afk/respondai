import { Skeleton } from '@/components/ui/skeleton'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    </DashboardLayout>
  )
}


import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      {...props}
    />
  )
}

function ToolCardSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
      <Skeleton className="w-6 h-4 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  )
}

function ToolGridSkeleton() {
  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2 mt-3">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  )
}

function CategoryCardSkeleton() {
  return (
    <div className="rounded-lg border border-border/50 p-6 space-y-3">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-4 w-16 mt-2" />
    </div>
  )
}

function ToolsPageSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  )
}

function ToolsGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <ToolGridSkeleton key={i} />
      ))}
    </div>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  )
}

export {
  Skeleton,
  ToolCardSkeleton,
  ToolGridSkeleton,
  CategoryCardSkeleton,
  ToolsPageSkeleton,
  ToolsGridSkeleton,
  CategoriesSkeleton,
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-surface w-64 rounded-lg" />
        <div className="h-4 bg-surface w-96 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-32 bg-surface rounded-card" />
        <div className="h-32 bg-surface rounded-card" />
        <div className="h-32 bg-surface rounded-card" />
        <div className="h-32 bg-surface rounded-card" />
      </div>

      <div className="space-y-4">
        <div className="h-6 bg-surface w-40 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-surface rounded-card" />
          <div className="h-24 bg-surface rounded-card" />
          <div className="h-24 bg-surface rounded-card" />
        </div>
      </div>
    </div>
  );
}

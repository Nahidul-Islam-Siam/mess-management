export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Header / Sidebar */}
      {children} {/* 👈 Must be here! */}
    </div>
  );
}

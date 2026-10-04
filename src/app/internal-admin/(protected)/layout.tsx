import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/getAdminSession';
import { getAdminBasePath } from '@/lib/auth/getAdminBasePath';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

/**
 * THE authorization boundary for the entire admin dashboard. Every page
 * under (protected)/ passes through this layout on every request — the
 * secret URL slug in middleware.ts is not what protects this data, this
 * server-side session + role check is. Deny by default: no session or no
 * admin_profiles row means an immediate redirect to login, full stop.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  const adminBase = getAdminBasePath();

  if (!session) {
    redirect(`${adminBase}/login`);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <AdminSidebar adminBase={adminBase} adminEmail={session.email} />
      <main className="flex-1 p-6 md:p-10 max-w-6xl">{children}</main>
    </div>
  );
}

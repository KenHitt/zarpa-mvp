import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { ExperienceForm } from '@/components/admin/experience-form';

export default async function NewExperience() {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) redirect('/admin/login');

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Nueva experiencia</h1>
      <ExperienceForm />
    </div>
  );
}

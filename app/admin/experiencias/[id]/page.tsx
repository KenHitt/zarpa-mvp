import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';
import { ExperienceForm } from '@/components/admin/experience-form';

export default async function EditExperience({ params }: { params: { id: string } }) {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) redirect('/admin/login');

  const db = await createClient();
  const { data: experience } = await db.from('experiences').select('*').eq('id', params.id).maybeSingle();
  if (!experience) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Editar experiencia</h1>
      <ExperienceForm experience={experience} />
    </div>
  );
}

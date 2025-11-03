import { redirect } from 'next/navigation';
import ProfileForm from '@/components/forms/ProfileForm';
import Sidebar from '@/components/ui/Sidebar';
export const dynamic = 'force-dynamic'

import { getCurrentUserProfile } from '@/lib/actions/auth';

export default async function ProfilePage() {
  const userProfile = await getCurrentUserProfile();

  if (!userProfile) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar user={{
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role,
        avatar_url: userProfile.avatar_url,
      }} />

      <main className="flex-1 md:ml-64 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h1 className="text-2xl font-bold text-gray-900">
                Mi Perfil
              </h1>
              <p className="text-gray-600 mt-1">
                Actualiza tu información personal y configuración
              </p>
            </div>
            
            <div className="p-6">
              <ProfileForm initialData={userProfile} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

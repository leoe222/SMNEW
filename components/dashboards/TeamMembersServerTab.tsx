"use client"

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import SectionContainer from '@/components/ui/SectionContainer';
import MemberCardExpandable from '@/components/ui/MemberCardExpandable';
import { getTeamMembersWithStats } from '@/lib/actions/team';

function TeamMembersList() {
  const [membersWithStats, setMembersWithStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const members = await getTeamMembersWithStats();
        setMembersWithStats(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return <TeamMembersLoading />;
  }

  if (membersWithStats.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-6">
          <Users className="h-24 w-24 text-gray-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Aún no hay miembros asignados
        </h3>
        
        <p className="text-lg text-gray-600 mb-8">
          Los diseñadores que se asignen a tu equipo aparecerán aquí
        </p>
        
        <p className="text-sm text-gray-500 mb-6">
          Los miembros del equipo podrán realizar autoevaluaciones que tú podrás revisar y aprobar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
  {membersWithStats.map((member, index) => (
        <MemberCardExpandable
          key={member.id}
            member={member}
            progress={member.progress}
            pendingSkills={member.pendingSkills}
            completedSkills={member.completedSkills}
    autoOpen={index === 0}
        />
      ))}
    </div>
  );
}

function TeamMembersLoading() {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2 text-gray-600">Cargando miembros del equipo...</p>
    </div>
  );
}

export default function TeamMembersServerTab() {
  return (
    <div className="space-y-6">
      <SectionContainer>
        <SectionHeader
          icon={Users}
          title="Miembros del Equipo"
          subtitle="Gestiona el desarrollo de skills de tu equipo de diseñadores"
        />
        
        <TeamMembersList />
      </SectionContainer>
    </div>
  );
}

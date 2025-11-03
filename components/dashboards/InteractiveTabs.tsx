import TeamMembersServerTab from './TeamMembersServerTab';
import AssessmentsTab from './AssessmentsTab';
import Tabs from '@/components/ui/Tabs';

export default function InteractiveTabs() {
  const tabs = [
    {
      id: 'team-members',
      label: 'Miembros',
      iconName: 'Users',
      content: <TeamMembersServerTab />
    },
    {
      id: 'assessments',
      label: 'Evaluaciones',
      iconName: 'ClipboardCheck',
      content: <AssessmentsTab />
    }
  ];

  return <Tabs tabs={tabs} defaultActiveTab="team-members" />;
}

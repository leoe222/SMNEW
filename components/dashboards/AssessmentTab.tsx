"use client"
import { ClipboardCheck } from "lucide-react"
import SectionHeader from "@/components/ui/SectionHeader"
import SectionContainer from "@/components/ui/SectionContainer"
import CenteredContent from "@/components/ui/CenteredContent"
import AssessmentModal from "@/components/ui/AssessmentModal"

export default function AssessmentTab() {
  return (
    <div className="space-y-6">
      <SectionContainer>
        <SectionHeader
          icon={ClipboardCheck}
          title="Auto-evaluación de Skillssss"
          subtitle="Evalúa tu nivel actual en cada competencia de Product Design"
        />

        <div className="mt-4">
        <AssessmentModal inline isOpen={true} onClose={() => { }} />
      </div>
      </SectionContainer>

      
      
    </div>
  )
}

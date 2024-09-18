import DoctorSettingLayout from '@/components/layout/DoctorSettingLayout'
import TemplatesList from './TemplatesList'

const TemplatesListScreen: React.FC = () => {
  return (
    <DoctorSettingLayout>
      <TemplatesList />
    </DoctorSettingLayout>
  )
}

export default TemplatesListScreen

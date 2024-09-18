import DoctorSettingLayout from '@/components/layout/DoctorSettingLayout'
import PatientsList from './PatientsList'

const PatientsScreen: React.FC = () => {
  return (
    <DoctorSettingLayout>
      <PatientsList />
    </DoctorSettingLayout>
  )
}

export default PatientsScreen

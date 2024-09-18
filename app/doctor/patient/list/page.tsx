import DoctorLayout from '@/components/layout/DoctorLayout'
import PatientList from './PatientList'

const PatientScreen: React.FC = () => {
  return (
    <DoctorLayout>
      <PatientList />
    </DoctorLayout>
  )
}

export default PatientScreen

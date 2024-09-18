import DoctorPatientLayout from '@/components/layout/DoctorPatientLayout'
import PatientReceptionDetail from '../ReceptionDetail'
import PatientReceptionList from './ReceptionList'

const PatientScreen: React.FC = () => {
  return (
    <DoctorPatientLayout
      leftChild={<PatientReceptionList />}
      rightChild={<PatientReceptionDetail />}
    />
  )
}

export default PatientScreen

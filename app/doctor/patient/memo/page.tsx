import DoctorPatientLayout from '@/components/layout/DoctorPatientLayout'
import PatientReceptionDetail from '../ReceptionDetail'
import PatientMemoComponent from './MemoComponent'

const PatientMemoScreen: React.FC = () => {
  return (
    <DoctorPatientLayout
      leftChild={<PatientMemoComponent />}
      rightChild={<PatientReceptionDetail />}
    />
  )
}

export default PatientMemoScreen

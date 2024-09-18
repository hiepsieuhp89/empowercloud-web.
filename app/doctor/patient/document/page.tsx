import DoctorPatientLayout from '@/components/layout/DoctorPatientLayout'
import PatientReceptionDetail from '../ReceptionDetail'
import PatientDocumentComponent from './DocumentComponent'

const PatientDocumentScreen: React.FC = () => {
  return (
    <DoctorPatientLayout
      leftChild={<PatientDocumentComponent />}
      rightChild={<PatientReceptionDetail />}
    />
  )
}

export default PatientDocumentScreen

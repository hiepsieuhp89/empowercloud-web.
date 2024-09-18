import DoctorPatientLayout from '@/components/layout/DoctorPatientLayout'
import PatientReceptionDetail from '../ReceptionDetail'
import PatientInspectComponent from './InspectComponent'

const PatientInspectScreen: React.FC = () => {
  return (
    <DoctorPatientLayout
      leftChild={<PatientInspectComponent />}
      rightChild={<PatientReceptionDetail />}
    />
  )
}

export default PatientInspectScreen

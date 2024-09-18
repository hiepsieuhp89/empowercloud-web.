import DoctorPatientLayout from '@/components/layout/DoctorPatientLayout'
import PatientReceptionDetail from '../ReceptionDetail'
import PatientInterviewComponent from './InterviewComponent'

const PatientInterviewScreen: React.FC = () => {
  return (
    <DoctorPatientLayout
      leftChild={<PatientInterviewComponent />}
      rightChild={<PatientReceptionDetail />}
    />
  )
}

export default PatientInterviewScreen

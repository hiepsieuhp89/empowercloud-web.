import DoctorPatientLayout from '@/components/layout/DoctorPatientLayout'
import PatientReceptionDetail from '../ReceptionDetail'
import PatientTreatmentList from './TreatmentList'

const TreatmentScreen: React.FC = () => {
  return (
    <DoctorPatientLayout
      leftChild={<PatientTreatmentList />}
      rightChild={<PatientReceptionDetail />}
    />
  )
}

export default TreatmentScreen

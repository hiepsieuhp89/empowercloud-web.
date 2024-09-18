import DoctorPatientLayout from '@/components/layout/DoctorPatientLayout'
import PatientReceptionDetail from '../ReceptionDetail'
import PatientMedicineComponent from './MedicineComponent'

const PatientMedicineScreen: React.FC = () => {
  return (
    <DoctorPatientLayout
      leftChild={<PatientMedicineComponent />}
      rightChild={<PatientReceptionDetail />}
    />
  )
}

export default PatientMedicineScreen

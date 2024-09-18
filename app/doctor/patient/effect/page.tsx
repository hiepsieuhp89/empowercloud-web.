import DoctorPatientLayout from '@/components/layout/DoctorPatientLayout'
import PatientReceptionDetail from '../ReceptionDetail'
import PatientEffectList from './EffectList'

const PatientEffectScreen: React.FC = () => {
  return (
    <DoctorPatientLayout
      leftChild={<PatientEffectList />}
      rightChild={<PatientReceptionDetail />}
    />
  )
}

export default PatientEffectScreen

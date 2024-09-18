import DoctorLayout from '@/components/layout/DoctorLayout'
import 'server-only'
import SalesList from './SalesList'

const SalesScreen: React.FC = () => {
  return (
    <DoctorLayout>
      <SalesList />
    </DoctorLayout>
  )
}

export default SalesScreen

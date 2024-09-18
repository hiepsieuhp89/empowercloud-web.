import DoctorLayout from '@/components/layout/DoctorLayout'
import 'server-only'
import ChartList from './ChartList'

const ChartScreen: React.FC = () => {
  return (
    <DoctorLayout>
      <ChartList />
    </DoctorLayout>
  )
}

export default ChartScreen

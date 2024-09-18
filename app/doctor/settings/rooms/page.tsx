import DoctorSettingLayout from '@/components/layout/DoctorSettingLayout'
import { RoomList } from './RoomList'

const StaffScreen: React.FC = () => {
  return (
    <DoctorSettingLayout>
      <RoomList />
    </DoctorSettingLayout>
  )
}

export default StaffScreen

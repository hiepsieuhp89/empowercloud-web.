import DoctorSettingLayout from '@/components/layout/DoctorSettingLayout'
import UserList from './UserList'

const StaffScreen: React.FC = () => {
  return (
    <DoctorSettingLayout>
      <UserList />
    </DoctorSettingLayout>
  )
}

export default StaffScreen

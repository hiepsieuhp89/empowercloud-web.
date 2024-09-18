import DoctorLayout from './DoctorLayout'

import { DoctorPatientMenuBarComponent } from '@/app/doctor/patient/MenuBar'
export default async function DoctorPatientLayout({
  leftChild,
  rightChild,
}: Readonly<{
  leftChild: React.ReactNode
  rightChild: React.ReactNode
}>) {
  return (
    <DoctorLayout>
      <div className="flex w-full lg:px-16">
        <div className="block h-full w-1/2">
          <DoctorPatientMenuBarComponent />
          <div className="block w-full">{leftChild}</div>
        </div>
        <div className="block h-full w-1/2">
          <div className="w-full">{rightChild}</div>
        </div>
      </div>
    </DoctorLayout>
  )
}

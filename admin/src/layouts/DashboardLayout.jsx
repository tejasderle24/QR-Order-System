import React from 'react'
import { SidebarProvider } from '../components/ui/sidebar'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'

const DashboardLayout = ({children}) => {
  return (
    <SidebarProvider>
            <AppSidebar />
            
            <div className='w-full'>
                <AppHeader />
                <div className="p-10">
                    {children}
                </div>
            </div>
        </SidebarProvider>
  )
}

export default DashboardLayout
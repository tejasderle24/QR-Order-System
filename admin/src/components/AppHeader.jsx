import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { Button } from './ui/button'
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';


function AppHeader() {

    const navigate = useNavigate();
    const location = useLocation();
    // const [isMenuOpen, setIsMenuOpen] = useState(false);

    // const isActive = (path) => {
    //     return location.pathname === path;
    // };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        navigate('/login');
    };

    // const { logout, admin } = useAuth();
    return (
        <div className='p-4 flex items-center justify-between shadow-sm'>
            <SidebarTrigger />

            <Button
                onClick={handleLogout}
                className={"text-sm font-medium text-white bg-red-500  hover:bg-red-600 transition-colors ml-2"}
            >
                <LogOut className="h-4 w-4 mr-1.5" />
                Logout
            </Button>
        </div>
    )
}

export default AppHeader
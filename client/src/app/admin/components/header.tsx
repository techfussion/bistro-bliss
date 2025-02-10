import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { act, Fragment } from 'react';

interface HeaderProps {
    activePage: string
    actionButton?: React.ReactNode
}

function Header({ activePage, actionButton }: HeaderProps) {
    return(
        <header className="flex justify-between items-center">
            <h2 className="text-lg font-semibold capitalize">{activePage}</h2>
            {
                actionButton ? (
                    <Fragment>
                        {actionButton}
                    </Fragment>
                )
                :
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex text-xs items-center px-3 py-2 border rounded-lg hover:bg-gray-50">
                        <span className="mr-2">Actions</span>
                        <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className='text-xs'>Export Data</DropdownMenuItem>
                        <DropdownMenuItem className='text-xs'>Settings</DropdownMenuItem>
                        <DropdownMenuItem className='text-xs'>Help</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        </header>
    )
}

export default Header;
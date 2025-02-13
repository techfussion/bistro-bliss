import { Fragment } from 'react';

interface HeaderProps {
    activePage: string
    actionButton?: React.ReactNode
}

function Header({ activePage, actionButton }: HeaderProps) {
    return(
        <header className="flex justify-between items-center">
            <h2 className="text-lg font-semibold capitalize">{activePage}</h2>
            {
                actionButton && (
                    <Fragment>
                        {actionButton}
                    </Fragment>
                )
            }
        </header>
    )
}

export default Header;
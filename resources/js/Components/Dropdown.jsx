import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';

const DropdownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    return (
        <DropdownContext.Provider value={{ open, setOpen }}>
            <div className="relative">{children}</div>
        </DropdownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { setOpen } = useContext(DropdownContext);

    return (
        <div onClick={() => setOpen((open) => !open)}>
            {children}
        </div>
    );
};

const Content = ({ align = 'right', width = '48', children }) => {
    const { open, setOpen } = useContext(DropdownContext);

    const alignmentClasses =
        align === 'left' ? 'origin-top-left start-0' : 'origin-top-right end-0';

    const widthClasses = {
        48: 'w-48',
    }[width];

    return (
        <>
            {open && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                />
            )}

            <div
                className={
                    `${open ? 'block' : 'hidden'} absolute z-50 mt-2 rounded-md shadow-lg ` +
                    `${alignmentClasses} ${widthClasses}`
                }
            >
                <div className="rounded-md bg-white py-1 ring-1 ring-black ring-opacity-5">
                    {children}
                </div>
            </div>
        </>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => (
    <Link
        {...props}
        className={
            'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ' +
            className
        }
    >
        {children}
    </Link>
);

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;

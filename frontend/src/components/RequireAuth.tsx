import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import CurrentUserContext from '@/context/current-user-context';

export function RequireAuth({ children }: { children: JSX.Element }) {
    const { currentUser } = useContext(CurrentUserContext);
    const location = useLocation();

    if (currentUser === undefined) { // Initial loading state
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
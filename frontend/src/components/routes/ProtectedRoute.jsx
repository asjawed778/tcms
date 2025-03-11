import { Navigate, Outlet } from "react-router-dom";
import {useSelector} from "react-redux"

const ProtectedRoute = () => {
    const user = useSelector((state) => state.auth.user);
    console.log("user value: ", user);
    
    return user ? <Outlet /> : <Navigate to="/" replace />
}
export default ProtectedRoute;
import { handleSucess } from "../Utils";

 
 
 export const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        handleSucess("Logged out successfully.");
        navigate("/login");
      };
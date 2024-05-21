import React from "react"
import { NavigationContainer } from '@react-navigation/native';
import authRoutes from "./auth.router";
import { useAuth } from "../hooks/authContext";
import gameRoutes from "./game.router";

const Router: React.FC  = () => {
    const auth = useAuth();
    return (
        <NavigationContainer>
            {auth.token ? gameRoutes : authRoutes}
        </NavigationContainer>
    )
}

export default Router;
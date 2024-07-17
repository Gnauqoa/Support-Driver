import { createContext } from "react";
import React from "react";



export const LoginUserData = createContext({});
export const AddContext  = ChildComponent => props => (
    <LoginUserData.Consumer>
        {
            context => <ChildComponent {...props} {...context}/>
        }
    </LoginUserData.Consumer>
)

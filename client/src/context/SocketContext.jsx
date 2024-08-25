import {createContext, useContext, useState, useEffect, useRef} from "react"
import { useAuthContext } from "./AuthContext";
import {io} from "socket.io-client"
import { HOST } from "../api/constants";

const SocketContext = createContext(null);

export const useSocket = ()=>{
    return useContext(SocketContext);
}

export const SocketProvider = ({children})=>{
    const socket = useRef();
    const {user} = useAuthContext();

    useEffect(()=>{
        if(user){
            socket.current = io(HOST,{
                withCredentials: true,
                query:{userId: user.id}
            })

            socket.current.on("connect", ()=>{
                console.log("Connected to Socket Server");
            })

            const handleReceiveMessage = (message) =>{
                console.log(message);
            }

            socket.current.on("receiveMessage", handleReceiveMessage)

            return ()=>{
                socket.current.disconnect();
            }

        }
    }, [user])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}
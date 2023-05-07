import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css';
import './styles/Dropzone.css';
import useWebSocket from "react-use-websocket";
import {WSMessageType} from "./types/chameleon-client.enum";
import Layout from "./components/layout/Layout";
import Main from "./pages/Main";
import Account from "./pages/profile/Account";
import ChangePassword from "./pages/profile/ChangePassword";
import Payment from "./pages/profile/Payment";
import Models from "./pages/model/board/Models";
import ExecuteModel from "./pages/model/execute/ExecuteModel";
import CreateModel from "./pages/model/create/CreateModel";
import CreateDescription from "./pages/model/create/CreateDescription";
import SignIn from "./pages/authentication/SignIn";
import SignUp from "./pages/authentication/SignUp";
import CreateParameters from "./pages/model/create/CreateParameter";

export default function App() {
    const {
        sendJsonMessage,
        lastJsonMessage
    } = useWebSocket((window.location.protocol.startsWith('https') ? 'wss://' : 'ws://') + window.location.host + '/websocket', {
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        let message = lastJsonMessage as any;
        if (lastJsonMessage && message.msg === WSMessageType.READY) {
            sendJsonMessage({msg: WSMessageType.PATH, path: window.location.pathname});
        }
    }, [sendJsonMessage, lastJsonMessage]);

    useEffect(() => {
        sendJsonMessage({msg: WSMessageType.PATH, path: window.location.pathname});
    }, [sendJsonMessage]);

    return (
        <Routes>
            <Route path="/" element={(<Layout/>)}>
                <Route path="/main" element={(<Main/>)}/>
                <Route path="/account" element={<Account/>}/>
                <Route path="/change-password" element={<ChangePassword/>}/>
                <Route path="/payment" element={<Payment/>}/>
                <Route path="/models/my" element={<Models/>}/>
                <Route path="/models/all" element={<Models/>}/>
                <Route path="/models/execute" element={<ExecuteModel/>}/>
                <Route path="/models/create" element={<CreateModel/>}/>
                <Route path="/models/create/description" element={<CreateDescription/>}/>
                <Route path="/models/create/parameters" element={<CreateParameters/>}/>
            </Route>
            <Route path="/sign-in" element={(<SignIn/>)}/>
            <Route path="/sign-up" element={(<SignUp/>)}/>
        </Routes>
    );
};
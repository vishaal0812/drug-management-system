import './css/App.css';
import axios from 'axios';
import { Suspense, lazy, useEffect, useState } from 'react';
import PageLoader from "./components/PageLoader";
import {BrowserRouter as Router} from "react-router-dom";
import {UserContext} from './helpers/Context';

const MainPage = lazy(() => import('./pages/detail-pages/MainPage'));

function App() {

    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        axios('/getCurrentUser').then((response) => {
            if (Object.keys(response.data).length > 0)
                setCurrentUser(response.data);
        });
    }, [])

    return (
        <div className="App">
            <Suspense fallback={<PageLoader/>}>
                <Router>
                    <UserContext.Provider value={{currentUser, setCurrentUser}}>
                        <MainPage/>
                    </UserContext.Provider>
                </Router>
            </Suspense>
        </div>
    );
}

export default App;

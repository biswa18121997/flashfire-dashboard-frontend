// import { useNavigate } from "react-router-dom";
//fetching local token and sending to db 
export default function FetchLocal(){
    // let navigate = useNavigate();
    let loggedIn = null;
    let localStorageCheck = localStorage.getItem('userAuth');
    if(!localStorageCheck){
        loggedIn = false;
        // navigate('/login');
        return loggedIn;
    }
    else{
        return localStorageCheck.userAuth;
    }
}
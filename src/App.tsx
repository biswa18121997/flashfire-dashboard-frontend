
import {useEffect, useState} from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SignupForm from './components/SignupForm.tsx';
import CalendlyModal from './components/CalendlyModal.tsx';
import Navigation from './components/Navigation.tsx';
import Footer from './components/Footer.tsx';
import SalesPopup from './components/SalesPopUp.tsx';
import EmployerForm from './components/EmployerForm.tsx';
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  const [signupFormVisibility, setSignupFormVisibility] = useState(false);
  const [calendlyModalVisibility, setCalendlyModalVisibility] = useState(false);
  const [employerFormVisibility, setEmployerFormVisibility] = useState(false);
  const [calendlyUser, setCalendlyUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  //  useEffect(() => {
  //   const id = window.location.hash.slice(1);
  //   if (!id) return;
  //   const el = document.getElementById(id);
  //   if (el) {
  //     // let layout settle
  //     setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  //   }
  // }, []);
  
  // Smooth-scroll to hash targets when path is '/#section'
  useEffect(() => {
    const tryScrollToHash = () => {
      if (location.hash) {
        const id = location.hash.slice(1);
        const scrollWithRetry = (retries: number) => {
          const el = document.getElementById(id);
          if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          } else if (retries > 0) {
            requestAnimationFrame(() => scrollWithRetry(retries - 1));
          }
        };
        scrollWithRetry(20);
      } else if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    tryScrollToHash();
  }, [location.pathname, location.hash]);


    // Disabled auto-redirect that opened the signup form after 10 seconds
    // useEffect(() => {
    //   setTimeout(() =>
    //     navigate('/signup')
    //   , 10000);
    // }, []);
    // const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === '/signup') {
      setSignupFormVisibility(true);
    // } else if(location.pathname === '/employers'){
    //   return <EmployerForm />
    }
    else if(location.pathname === '/employers'){
      setEmployerFormVisibility(true);
    }
    else if(location.pathname === '/book-free-demo'){
      setCalendlyModalVisibility(true);
    }
    else {
      setSignupFormVisibility(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation setSignupFormVisibility={setSignupFormVisibility} setEmployerFormVisibility={setEmployerFormVisibility} setCalendlyModalVisibility={setCalendlyModalVisibility} />
      <Outlet context={{signupFormVisibility,calendlyModalVisibility, setSignupFormVisibility, setCalendlyModalVisibility }} />
      {signupFormVisibility && <SignupForm setCalendlyUser= {setCalendlyUser} setSignupFormVisibility={setSignupFormVisibility} setCalendlyModalVisibility={setCalendlyModalVisibility} />}
      {calendlyModalVisibility && <CalendlyModal user={calendlyUser} setCalendlyModalVisibility={setCalendlyModalVisibility}/>}
      {employerFormVisibility && <EmployerForm setEmployerFormVisibility={setEmployerFormVisibility} isVisible={employerFormVisibility} />}      
      <SalesPopup />
      <Footer />
    </div>
  );
}

export default App;






import { useState } from "react";
import {Link, useNavigate} from 'react-router-dom'
import { Badge, Coins, CoinsIcon, Diamond, X } from "lucide-react";

//register page component..
export default function Register(){

    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [mail,setMail] = useState('');
    const [password, setPassword] = useState('');
    const [planType, setPlanType] = useState('TESTING PLAN');
    let [response, setResponse] = useState();
    let redirect = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const plans = [
      {
        planName : `TESTING PLAN`,
        planDurationInDays : 'Unlimited',
        planPerks : 'Nothing',
        icon : <Diamond />,
        style : 'text-black'
      },
      {
        planName : 'Free Trial',
        planDurationInDays : 10,
        planPerks : '10 Days Unlimited trials fro selected individuls',
        icon : <Badge />,
        style : 'text-blue-600'
      },
      {
        planName : 'Ignite',
        planDurationInDays : 'Unlimited Days Upto 250 applications',
        planPerks : '250 applications',
        icon : <CoinsIcon  />,
        style : 'text-gray-800'
      },
      {
        planName : 'Professional',
        planDurationInDays : 'Unlimited Days Upto 500 applications',
        planPerks : '500 applications',
        icon : <Coins />,
        style : 'text-yellow-500'
      },
      {
        planName : 'Executive',
        planDurationInDays : 'Unlimited Days Upto 1000 applications',
        planPerks : '1000 applications',
        icon : <CoinsIcon />,
        style : 'text-red-800'
      }
    ]

//taking inpout and sending it to server..
    async function handleRegister() {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    console.log("API_BASE_URL:", API_BASE_URL);
    console.log(name, mail, password);

    const res = await fetch(`${API_BASE_URL}/register`, {  //${API_BASE_URL}
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email: mail, password, planType }),
    });

    const data = await res.json();
    setResponse(data);

    if (data?.message === 'User registered') {
      redirect('/login');
    }

    setName('');
    setMail('');
    setPassword('');
  } catch (error) {
    console.log("Registration failed:", error);
  }
}


    return(<div className="w-[80vw] relative left-[20vw] h-screen top-[20vh] sm:top-[15vh] md:top-[15vh]">
                <span onClick={()=>redirect('/')}><X  className="hover:bg-neutral-400 rounded-full m-2"/></span>

        <div className="flex flex-col justify-center items-center h-4/5 w-3/4 gap-3 ">
            <h1 className="text-3xl font-serif underline underline-offset-8">Register as a new User :</h1>
            
{/* //register form */}
            <div  className="flex flex-col justify-center items-center border p-4 rounded-2xl  w-[80vw] md:w-2/3">
                <i className="fa-solid fa-user  p-2 m-2 rounded-2xl text-8xl border-2 text-center"></i>
                <label htmlFor="registername"  className="text-start">Enter Full Name :</label>
                <input type='text'  name="name" id="registername" onChange={(e)=>setName(e.target.value)} placeholder="Enter Your Full Name." className="p-2 bg-neutral-400 w-full rounded-3xl m-2" />
                <label htmlFor="loginmail" className="">Registered  Email :</label>
                <input type='email'  name="email" id="loginmail" onChange={(e)=>setMail(e.target.value)} placeholder="Enter Your Registered E-mail.." className="p-2 bg-neutral-400 w-full rounded-3xl m-2" />
                <label htmlFor="loginpassword">Password :</label>
                <section className="w-full flex justify-center items-center">
                    <input type={show?'text':'password'} name="password" id="loginpassword" onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password " className="p-2 bg-neutral-400 w-full rounded-3xl m-2"/>
                    <i onClick={()=>setShow(!show)} className={show?'fa-solid fa-eye':'fa-solid fa-eye-low-vision' }></i>
                </section>
                <label htmlFor="dropdown" >Select Your Plan :</label>
                <select
                    required
                    value={planType}
                    onChange={(e) => setPlanType(e.target.value)}
                    className="border rounded-3xl bg-neutral-300 p-2"
                  >
                    {plans.map((items)=><option key={items.planName} value={items.planName}>{items.planName}</option>)}
                  </select>
                    <p className="text-blue-700 underline underline-offset-8 m-1">Forgot your Password .? </p>         
                    <button onClick={handleRegister} className="p-2 m-2 rounded-2xl border w-full">Register</button> 
                    <Link to={'/login'} className="w-full">
                    <button className="p-2 m-1 rounded-2xl border w-full  bg-green-400">Login</button> 
                    </Link>
                   { response && <h1 className=' font-bold text-red-500'>{response.message}</h1>}

            </div>
        </div>
    </div>)
}

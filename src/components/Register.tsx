import { useState } from "react";
import {Link, useNavigate} from 'react-router-dom'
import { X } from "lucide-react";

//register page component..
export default function Register(){

    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [mail,setMail] = useState('');
    const [password, setPassword] = useState('');
    let [response, setResponse] = useState();
    let redirect = useNavigate();

//taking inpout and sending it to server..
    async function handleRegister(){
       
        try {
            console.log(name,mail,password)
            const res = await fetch('http://localhost:8086/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name, email: mail , password })
                
            });
           
            //setting response ..
            setResponse(await res.json());
            if(setResponse?.message === 'User registered'){
                //redirect to login page..
                redirect('/login');
                // alert('User Registered Sucessfully , Please Login Now..!')
            }
             setName('');
            setMail('')
            setPassword('')

        } catch (error) {
            console.log(error)
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
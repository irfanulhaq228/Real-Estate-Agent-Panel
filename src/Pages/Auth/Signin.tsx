import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FaUserAlt, FaHandPointRight } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";
import { signinAgentApi } from "../../Api/api";
import { updateLogin } from "../../Features/Features";

const Signin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loader, setLoader] = useState(false);

    const fn_Submit = async() => {
        if(email === "" || password === ""){
            return toast.error("Invalid Credentials")
        }
        const data = { email, password }
        const result = await signinAgentApi(data);
        setLoader(true);
        //@ts-ignore
        if(result?.status === 200){
            setLoader(false);
            navigate("/");
            dispatch(updateLogin(true));
            //@ts-ignore
            console.log(result?.data?.message);
            //@ts-ignore
            localStorage.setItem('agent', JSON.stringify(result?.data?.message));
            return toast.success("Agent Login Successfully");
            //@ts-ignore
        }else if(result?.response?.status === 400){
            setLoader(false);
            //@ts-ignore
            return toast.error(result?.response?.data?.message);
        }else{
            setLoader(false);
            return toast.error("Network Error");
        }
    }   
  return (
    <div className="auth min-h-full">
        <div className="secondary-auth flex flex-col md:flex-row justify-between w-[90%] lg:w-[80%] xl:w-[1000px] gap-[80px] md:gap-0">
            <div className="flex-1 flex items-center justify-center md:border-e md:border-[var(--text-color-dark)] flex-col gap-5">
                <p className="text-white font-[700] text-[30px] text-center">Real Estate</p>
                <p className="text-gray-500 font-[600]">Sign-in yourself as an Agent</p>
                <FaHandPointRight className="hidden md:block text-[70px] text-[var(--text-color-dark)]" />
                <p className="hidden md:block text-gray-500 font-[600]">Don't Have Account ? <span className="text-[var(--text-color-dark)] cursor-pointer" onClick={() => navigate("/sign-up")}>Sign-Up</span> Here</p>
            </div>
            <div className="flex-1 flex items-center justify-center flex-col gap-5">
                <FaUserAlt className="text-[90px] text-[var(--text-color-dark)]" />
                <div className="w-[100%] sm:w-[70%] flex flex-col gap-2">
                    <label className="text-[13px] text-[var(--text-color-dark)] font-[500]">Email Address</label>
                    <input className="auth-input" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="w-[100%] sm:w-[70%] flex flex-col gap-2">
                    <label className="text-[13px] text-[var(--text-color-dark)] font-[500]">Password</label>
                    <input className="auth-input" type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                {!loader ? (
                    <button className="px-4 h-[40px] rounded-[8px] bg-[var(--sidebar-color)] text-white font-[600] text-[14px]" onClick={fn_Submit}>Submit</button>
                ) : (
                    <button className="cursor-not-allowed px-4 h-[40px] rounded-[8px] bg-[var(--sidebar-color)] text-white font-[600] text-[14px]" disabled>Loading...</button>
                )}
                <p className="block md:hidden text-gray-500 font-[600]">Don't Have Account ? <span className="text-[var(--text-color-dark)] cursor-pointer" onClick={() => navigate("/sign-up")}>Sign-Up</span> Here</p>
            </div>
        </div>
        <div className="bg-color"></div>
    </div>
  )
}

export default Signin
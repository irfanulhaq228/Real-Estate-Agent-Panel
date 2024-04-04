import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { signupAgentApi } from "../../Api/api";

import { FaUserAlt, FaHandPointRight } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loader, setLoader] = useState(false);

    const fn_Submit = async() => {
        if(name === ""){
            return toast.error("Enter Your Name")
        }
        if(email == ""){
            return toast.error("Enter Your Email")
        }
        if(phone == ""){
            return toast.error("Enter Your Phone")
        }
        if(address == ""){
            return toast.error("Enter Your Complete Address")
        }
        if(city == ""){
            return toast.error("Enter Your City Name")
        }
        if(zipcode == ""){
            return toast.error("Enter Zipcode")
        }
        if(password == ""){
            return toast.error("Enter Your Password")
        }
        if(confirmPassword == ""){
            return toast.error("Enter Your Password Again")
        }
        if(password !== confirmPassword){
            return toast.error("Password not Matched")
        }
        const data = { name, email, password, address, city, zipcode, phone }
        setLoader(true);
        const result = await signupAgentApi(data);
        //@ts-ignore
        if(result?.message){
            setLoader(false);
            //@ts-ignore
            return toast.error(result?.message);
        }
        //@ts-ignore
        if(result?.status === 200){
            setLoader(false);
            navigate("/sign-in");
            return toast.success("Agent Created Successfully")
            //@ts-ignore
        }else{
            setLoader(false);
            //@ts-ignore
            return toast.error(result?.response?.data?.message);
        }
    };
  return (
    <div className="auth">
        <div className="secondary-auth flex flex-col md:flex-row justify-between w-[90%] lg:w-[80%] xl:w-[1000px] gap-[80px] md:gap-0">
            <div className="flex-1 flex items-center justify-center md:border-e md:border-[var(--text-color-dark)] flex-col gap-5">
                <p className="text-white font-[700] text-[30px] text-center">Real Estate</p>
                <p className="text-gray-500 font-[600]">Sign-up yourself as an Agent</p>
                <FaHandPointRight className="hidden md:block text-[70px] text-[var(--text-color-dark)]" />
                <p className="hidden md:block text-gray-500 font-[600]">Already Have a Account? <span className="text-[var(--text-color-dark)] cursor-pointer" onClick={() => navigate("/sign-in")}>Sign-In</span> Here</p>
            </div>
            <div className="flex-1 flex items-center justify-center flex-col gap-5">
                <FaUserAlt className="text-[90px] text-[var(--text-color-dark)]" />
                <div className="w-[100%] sm:w-[70%] flex flex-col gap-2">
                    <label className="text-[13px] text-[var(--text-color-dark)] font-[500]">Full Name</label>
                    <input className="auth-input" onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="w-[100%] sm:w-[70%] flex flex-col gap-2">
                    <label className="text-[13px] text-[var(--text-color-dark)] font-[500]">Email Address</label>
                    <input className="auth-input" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="w-[100%] sm:w-[70%] flex flex-col gap-2">
                    <label className="text-[13px] text-[var(--text-color-dark)] font-[500]">Phone Number</label>
                    <input className="auth-input" type="number" onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="w-[100%] sm:w-[70%] flex flex-col gap-2">
                    <label className="text-[13px] text-[var(--text-color-dark)] font-[500]">Address</label>
                    <input className="auth-input" onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="w-[100%] sm:w-[70%] flex flex-col gap-2">
                    <label className="text-[13px] text-[var(--text-color-dark)] font-[500]">City</label>
                    <input className="auth-input" onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="w-[100%] sm:w-[70%] flex flex-col gap-2">
                    <label className="text-[13px] text-[var(--text-color-dark)] font-[500]">Zip Code</label>
                    <input type="number" className="auth-input" onChange={(e) => setZipcode(e.target.value)} />
                </div>
                <div className="w-[100%] sm:w-[70%] flex flex-col gap-2">
                    <label className="text-[13px] text-[var(--text-color-dark)] font-[500]">Password</label>
                    <input className="auth-input" type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="w-[100%] sm:w-[70%] flex flex-col gap-2">
                    <label className="text-[13px] text-[var(--text-color-dark)] font-[500]">Confirm Password</label>
                    <input className="auth-input" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                {!loader ? (
                    <button className="px-4 h-[40px] rounded-[8px] bg-[var(--sidebar-color)] text-white font-[600] text-[14px]" onClick={fn_Submit}>Submit</button>
                ) : (
                    <button className="cursor-not-allowed px-4 h-[40px] rounded-[8px] bg-[var(--sidebar-color)] text-white font-[600] text-[14px]" onClick={fn_Submit} disabled>Loading...</button>
                )}
                <p className="block md:hidden text-gray-500 font-[600]">Already Have a Account? <span className="text-[var(--text-color-dark)] cursor-pointer" onClick={() => navigate("/sign-in")}>Sign-In</span> Here</p>
            </div>
        </div>
        <div className="bg-color"></div>
    </div>
  )
}

export default SignUp
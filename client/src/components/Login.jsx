import { useState } from "react";

const Login = () => {
    const [inputFieldUsername, setInputFieldUsername] = useState("");
    const [inputFieldPassword, setInputFieldPassword] = useState("");

    const createUser = () => {
        if(inputFieldUsername === "") {
          throw new Error("Invalid Username");
        }
        if(inputFieldPassword === "") {
          throw new Error("Invalid Password");
        }
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ username: `${inputFieldUsername}`, password: `${inputFieldPassword}` })
        };
    
        fetch('http://localhost:8080/create-user', requestOptions)
    };
    
    const login = () => {
        if(inputFieldUsername === "") {
          throw new Error("Invalid Username");
        }
        if(inputFieldPassword === "") {
          throw new Error("Invalid Password");
        }
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ username: `${inputFieldUsername}`, password: `${inputFieldPassword}` })
        };
    
        fetch('http://localhost:8080/login', requestOptions)
          .then((response) =>  (response.json()))
          .then((val) => console.log(val.res));
    };

    return (
        <div className=" h-screen w-screen flex-row justify-center p-2">
            <form 
                onSubmit={(e) => {e.preventDefault(); setInputFieldUsername(""); setInputFieldPassword("");}}
                className="justify-items-center w-1/3 flex-col ms-10"
            >
                <p>Username</p><input 
                className="border-2 border-black m-5 p-1 w-9/12 mr-2"
                onChange={(e) => {setInputFieldUsername(e.target.value);}}
                value={inputFieldUsername}
                />
                <p>Password</p><input 
                type="password"
                className="border-2 border-black m-5 p-1 w-9/12 mr-2"
                onChange={(e) => {setInputFieldPassword(e.target.value);}}
                value={inputFieldPassword}
                />
                <button 
                onClick={createUser} 
                className="content-end bg-blue-500 border-2 border-black px-4 py-2 rounded-full text-white hover:bg-blue-800">
                    CREATE USER
                </button>
                <button 
                onClick={login} 
                className="content-end bg-blue-500 border-2 border-black px-4 py-2 rounded-full text-white hover:bg-blue-800">
                    Login
                </button>

            </form>
        </div>
    );
}

export default Login;
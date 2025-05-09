import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    localStorage.clear();
    const [isOn, setIsOn] = useState(false); // State variable for switch
    const [textTitle, setTextTitle] = useState("Login"); // State variable for title card

    // State variables for forms
    const [name, setName] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [experience, setExperience] = useState("");
    
    const toggle = () => { // Function to toggle the switch
        setIsOn(!isOn);
        setTextTitle(isOn ? "Login" : "Sign in");
        console.log("Estado del switch:", !isOn ? "ON" : "OFF");
    };

    const navigate = useNavigate(); // Hook to navigate between routes
    const currentDate = () =>{// Function to get the current date in YYYY/MM/DD format
        const date = new Date()
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const formatedDate = `${year}/${month}/${day}`;
        return formatedDate;
    }
    const handleSubmit = async (e: React.FormEvent) => { // Function to handle form submission
        e.preventDefault();
        let data = {};
        let dataMap = {}
        const actualDate = currentDate();
        if (isOn) {
            data = {
                name: name,
                username: user,
                password: password,
                registration_date: actualDate,
                experience: experience
            };
        } else {
            data = {
                username: user,
                password: password
            };
        }

        const url = isOn 
            ? "http://127.0.0.1:5000/new-user"    // Route for sign in
            : "http://127.0.0.1:5000/login-user"; // Route for login

        try {
            const responseLogin = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            
            if (responseLogin.ok) {
                const resultLogin = await responseLogin.json();
                console.log(isOn ? "Registro Exitoso:" : "Ingreso Exitoso", resultLogin);
                
                let userId;
                if (!isOn) {
                    if (resultLogin.success) {
                        alert("Bienvenido " + resultLogin.user.name);
                        userId = resultLogin.user.user_id
                    }else{
                        alert("Usuario o contraseña incorrectos");
                        console.error("Error de autenticación:", resultLogin); 
                    }
                }else{
                    if (resultLogin.success){
                        alert(resultLogin.message);
                        userId = resultLogin.user.user_id
                    }else{
                        alert(resultLogin.message);
                        setUser("")
                        console.error("Error de registro:", resultLogin); 
                    }
                }

                localStorage.setItem("userID", userId)
                dataMap = { user_id: userId };

                try {
                    const responseMap = await fetch("http://127.0.0.1:5000/user-map", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(dataMap),
                    });

                    if(responseMap.ok){
                        const resultMap = await responseMap.json();
                        console.log("Mapa de usuario recuperado con éxito:", resultMap);
                        localStorage.setItem("userMap", JSON.stringify(resultMap));
                    }else{
                        console.error("Error en el mapa:", responseMap.status);
                    }

                } catch (error) {
                    console.error("Error de red:", error);
                    alert("No se pudo conectar con el servidor");
                }

                try {
                    const response = await fetch("http://127.0.0.1:5000/get-user-data", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user_id: userId }),
                    });
            
                    if (response.ok) {
                        const userData = await response.json();
                        console.log("Datos del usuario recuperados con éxito:", userData);
                        localStorage.setItem("userData", JSON.stringify(userData));
                    } else {
                        console.error("Error al obtener los datos del usuario:", response.status);
                        alert("No se pudieron obtener los datos del usuario.");
                    }
                } catch (error) {
                    console.error("Error de red:", error);
                    alert("No se pudo conectar con el servidor.");
                }

                navigate("/userRoute")

            }else{
                console.error("Error en el registro:", responseLogin.status);
                alert("Error al registrar usuario");
            }
            
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor");
        }
    }

    return (
        <section className="LoginCard bg-gray-100 h-screen flex items-center justify-center">
            <h1>{textTitle}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-center w-full">
                {isOn ? (
                    // Content for Sign in
                    <>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className="p-2 border rounded" required minLength={3} maxLength={25}/>
                        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="Nombre de usuario" className="p-2 border rounded" required minLength={3} maxLength={15}/>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="p-2 border rounded" required minLength={8} maxLength={30}/>
                        <select name="selectExperience" value={experience} onChange={(e) => setExperience(e.target.value)} id="experience" className="bg-blue-500" required>
                            <option value="" disabled hidden>Experiencia</option>
                            <option value="Experto">Experto</option>
                            <option value="Intermedio">Intermedio</option>
                            <option value="Principiante">Principiante</option>
                        </select>
                    </>
                ) : (
                    // Content for Login
                    <>
                        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="Nombre de usuario" className="p-2 border rounded" required minLength={3} maxLength={10}/>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="p-2 border rounded" required minLength={8} maxLength={30}/>
                    </>
                )}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        {isOn ? "Registrarse" : "Entrar"}
                </button>
            </form>

            <footer id="footerLoginCard">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isOn}
                        onChange={toggle}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-red-500 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
                </label>
            </footer>
        </section>
    );
};
export default Login;
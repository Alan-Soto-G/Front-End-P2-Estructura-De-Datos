import React from "react";
import { useState } from "react";

const Login: React.FC = () => {

    const [isOn, setIsOn] = useState(false);
    const [textTitle, setTextTitle] = useState("Login");

    // State variables for forms
    const [name, setName] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [experience, setExperience] = useState("");
    
    const toggle = () => {
        setIsOn(!isOn);
        setTextTitle(isOn ? "Login" : "Sign in");
        console.log("Estado del switch:", !isOn ? "ON" : "OFF");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let data = {};

        if (isOn) {

            const fechaActual = new Date();
            const año = fechaActual.getFullYear();
            const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaActual.getDate()).padStart(2, '0');
            const fechaFormateada = `${año}/${mes}/${dia}`;

            data = {
                name: name,
                username: user,
                password: password,
                registration_date: fechaFormateada,
                experience: experience
            };
            console.log("Registrarse ->", {
                name,
                user,
                password,
                experience,
            });
        } else {
            data = {
                username: user,
                password: password
            };
            console.log("Entrar ->", {
                user,
                password,
            });
        }

        const url = isOn 
            ? "http://127.0.0.1:5000/new-user"    // Route for sign in
            : `http://127.0.0.1:5000/login-user`; // Route for login

        try {
                
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log(isOn ? "Registro Exitoso:" : "Ingreso Exitoso", result);
                
                let user_id;
                if (!isOn) {
                    if (result.success) {
                        alert("Bienvenido " + result.user.name);
                        user_id = result.user.id
                    }else{
                        alert("Usuario o contraseña incorrectos");
                        console.error("Error de autenticación:", result); 
                    }
                }else{
                    if (result.success){
                        alert(result.message);
                        user_id = result.user_id
                    }else{
                        alert(result.message);
                        setUser("")
                        console.error("Error de registro:", result); 
                    }
                }
                localStorage.setItem("userID", user_id)

            }else{
                console.error("Error en el registro:", response.status);
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
                        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="Nombre de usuario" className="p-2 border rounded" required minLength={3} maxLength={10}/>
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
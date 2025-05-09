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
                console.log(localStorage.getItem('userMap'));
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
  <section className="h-screen w-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center">
  <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/30">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{textTitle}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isOn ? (
          // Content for Sign in
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={3}
              maxLength={25}
            />
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Nombre de usuario"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={3}
              maxLength={15}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={8}
              maxLength={30}
            />
            <select
              name="selectExperience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              id="experience"
                className="w-full p-3 mt-2 rounded-md bg-black text-black"
              required
            >
              <option value="" disabled hidden>
                Experiencia
              </option>
              <option value="Experto">Experto</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Principiante">Principiante</option>
            </select>
          </>
        ) : (
          // Content for Login
          <>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Nombre de usuario"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={3}
              maxLength={20}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={8}
              maxLength={30}
            />
          </>
        )}
        <button
  type="submit"
  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
>
  {isOn ? "Registrarse" : "Entrar"}
</button>

      </form>
      <footer className="mt-6 flex justify-center items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isOn}
            onChange={toggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
        </label>
        <span className="ml-3 text-white font-medium">
          {isOn ? "Modo Registro" : "Modo Login"}
        </span>
      </footer>
    </div>
  </section>
);
};
export default Login;
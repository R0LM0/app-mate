import React from "react";
import Navbars from "./components/Navbars";
import Tables from "./components/Tables";
import BgFondo from './assets/MathBG.jpg'


export default function App() {
  return (
    <div style={{
      backgroundImage: `url(${BgFondo})`, // Utiliza la variable BgFondo directamente y rodeada por backticks
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh', // Ajusta el alto según sea necesario
    }}>
      <Navbars />
      <Tables />
    </div>

  );
}

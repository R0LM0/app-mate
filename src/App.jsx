import React, { useState } from "react";
import Navbars from "./components/Navbars";
import Tables from "./components/Tables";
import BgFondo from './assets/MathBG.jpg'
import musica from './assets/tictac.mp3'
import incorrect from './assets/incorrecta.mp3'
import correct from './assets/yeeh.mp3'


export default function App() {
  const [audio] = useState(new Audio(musica))
  const [bien] = useState(new Audio(correct))
  const [mal] = useState(new Audio(incorrect))
  return (
    <div style={{
      backgroundImage: `url(${BgFondo})`, // Utiliza la variable BgFondo directamente y rodeada por backticks
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh', // Ajusta el alto según sea necesario
    }}>
      <Navbars />
      <Tables audio={audio} bien={bien} mal={mal} />
    </div>

  );
}

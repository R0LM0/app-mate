import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ImgReloj from '../assets/reloj.png'
import datos from './datos';
import ejercicios from './ejercicios';


const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-80">{children}</div>
        </div>
    );
};

const Tables = ({ audio, bien, mal }) => {
    const [index, setIndex] = useState(0);
    const [numeroSeleccionado, setNumeroSeleccionado] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(90); // 180 segundos
    const [isPlaying, setIsPlaying] = useState(false);


    useEffect(() => {
        let timer;
        if (isPlaying && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000); // Actualizar el tiempo cada segundo
        } else if (timeLeft === 0) {
            setModalMessage("⏲️ Tiempo Agotado ⏲️");
            setModalIsOpen(true);
            handleStopAudio();
        }

        // Limpiar el temporizador cuando el componente se desmonta o cuando el tiempo llega a cero
        return () => clearTimeout(timer);
    }, [timeLeft, isPlaying]);

    const handleStopAudio = () => {
        audio.pause();
        audio.currentTime = 0;
    }


    const handleMostrarProcedimiento = useCallback(() => {
        if (!isPlaying) return;

        const nuevosEjercicios = [...ejercicios];
        nuevosEjercicios[index].visible = true;
        setModalIsOpen(true);
    }, [isPlaying, index]);



    const handleNumeroSeleccionado = useCallback((numero) => {
        if (!isPlaying) return;

        if (ejercicios[index].respuesta === numero) {
            setModalMessage("🎉 ¡Bingo! 🎉");
            setIsPlaying(false);
            handleStopAudio();
            bien.play()
        } else {
            setModalMessage("😵 Respuesta incorrecta 😵");
            setIsPlaying(false);
            handleStopAudio();
            mal.play()
        }
        setNumeroSeleccionado(numero);
        handleMostrarProcedimiento();
    }, [isPlaying, index, handleMostrarProcedimiento]);

    const handleNumeroSeleccionadoCurried = useCallback((numero) => () => handleNumeroSeleccionado(numero), [handleNumeroSeleccionado]);

    const handleSiguienteEjercicio = useCallback(() => {
        if (index < ejercicios.length - 1) {
            setIndex(index + 1);
            setNumeroSeleccionado(null);
            setIsPlaying(false);
            handleStopAudio();
        }
    }, [index]);

    const handleAnteriorEjercicio = useCallback(() => {
        if (index > 0) {
            setIndex(index - 1);
            setNumeroSeleccionado(null);
            setIsPlaying(false);
            handleStopAudio();
        }
    }, [index]);

    const handleJugar = useCallback(() => {
        const nuevosEjercicios = [...ejercicios];
        nuevosEjercicios[index].visible = false;
        audio.play();
        setIsPlaying(true);
        setTimeLeft(90);
    }, [index]);



    const procedimientoConSaltosDeLinea = useMemo(() =>
        ejercicios[index].procedimiento.split(';').map((linea, index) => (
            <p key={index}>{linea}</p>
        )), [index]);

    return (

        <div className="container mx-auto " >
            <div className="flex flex-col justify-center mt-11">
                <table className="table-auto border-collapse border border-gray-800 overflow-x-auto ">
                    <thead>
                        <tr>
                            <th colSpan={8} className="px-4 py-2 bg-gray-800 text-white animate-blurred-fade-in">Respuestas de ejercicios</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((fila, indexFila) => (
                            <tr key={indexFila}>
                                {fila.map((valor, indexColumna) => (
                                    <td key={indexColumna} className="border px-4 py-2 bg-gray-900 text-white hover:bg-gray-700 hover:text-white" onClick={handleNumeroSeleccionadoCurried(valor)}>{valor}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    isPlaying && (
                        <span className='text-white mt-6 ml-4 flex justify-center   '>
                            <img src={ImgReloj} className='size-12' alt='reloj' />' '<p className='text-3xl font-bold mt-2'>{timeLeft}</p>
                        </span>
                    )
                }

            </div>
            <div className="mt-5">
                <h2 className="text-center text-xl font-bold mb-4 text-white animate-zoom-in">Listados de ejercicios</h2>
                <div className="flex justify-center mt-11">
                    <table className="table-auto border-collapse border border-gray-800 overflow-x-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 bg-gray-800 text-white">N°</th>
                                <th className="px-4 py-2 bg-gray-800 text-white">Ejercicio</th>
                                <th className="px-4 py-2 bg-gray-800 text-white">Procedimiento</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2  text-yellow-300 font-bolde">{ejercicios[index].id}</td>
                                <td className="border px-4 py-2  text-yellow-300 font-bold">{ejercicios[index].ejercicio}</td>
                                <td className="border px-4 py-4 text-yellow-300 font-bold espacio-extra" style={{ textShadow: '1px 1px 2px black' }}>
                                    {ejercicios[index].visible ? procedimientoConSaltosDeLinea : ''}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    {
                        isPlaying ? (
                            <button className="mr-4 sm:mr-4 bg-blue-500 text-white font-bold py-2 px-4 rounded " disabled>
                                Jugar
                            </button>)
                            :
                            (<button onClick={handleJugar} className="mr-4 sm:mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Jugar
                            </button>
                            )
                    }

                    <button onClick={handleAnteriorEjercicio} className="mr-4 sm:mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                        Anterior ejercicio
                    </button>
                    <button onClick={handleSiguienteEjercicio} className="mr-4 sm:mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                        Siguiente ejercicio
                    </button>
                </div>

                {/* Modal */}
                {modalIsOpen && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="fixed inset-0 bg-black opacity-50"></div>
                            <div className="bg-white rounded-lg p-8 max-w-md mx-auto z-50">
                                <div className="text-center">
                                    <h2 className="text-lg font-bold mb-4 animate-blurred-fade-in">La Respuesta del Ejercicio</h2>
                                    <p className="text-gray-700 animate-rotate-360">{modalMessage}</p>
                                </div>
                                <div className="mt-6 text-center">
                                    <button onClick={() => setModalIsOpen(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded animate-slide-out-bottom">
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tables;

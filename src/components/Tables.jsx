import React, { useState, useEffect } from 'react';

const datos = [
    [25, 9, 3.5, 7, 27, 2, 17],
    [23, -11, 14, 5, 1.5, 10, 28],
    [20, -2, 3, -1, 13, 6, -20],
    [1, 8, -9, 15, 4.25, 22, 16],
    [-5, 4, 12, 7.5, 2.4, 35, 18]
];

const ejercicios = [
    {
        id: 1,
        ejercicio: "x + 1 = 10x + 10",
        procedimiento: "x - 10x = 10 - 1; -9x = 9; x = 9/9; x = 1",
        respuesta: -1,
        visible: false
    },
    {
        id: 2,
        ejercicio: "2x-4 + 2x -12",
        procedimiento: "4x-4 = 12 ;  4x-4+4 = 12+4 ; 4x = 16 ; 4x/4 = 16/4 ; x = 4",
        respuesta: 4,
        visible: false
    },
    {
        id: 3,
        ejercicio: "2x+5 = 9",
        procedimiento: "2x+5-5 = 9-5 ; 2x = 4 ; 2x/2 = 4/2 ; 1x = 2 ; x = 2/1 ; x = 2",
        respuesta: 2,
        visible: false
    },
    // Agrega más ejercicios según sea necesario
];

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-80">{children}</div>
        </div>
    );
};

const Tables = () => {
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
        }

        // Limpiar el temporizador cuando el componente se desmonta o cuando el tiempo llega a cero
        return () => clearTimeout(timer);
    }, [timeLeft, isPlaying]);

    const handleMostrarProcedimiento = () => {
        if (!isPlaying) return; // Solo muestra el procedimiento si el juego está en marcha

        const nuevosEjercicios = [...ejercicios];
        nuevosEjercicios[index].visible = true;
        setIndex(index); // No es necesario actualizar el índice, pero lo hacemos para forzar una re-renderización

        setModalIsOpen(true);
    };

    const handleNumeroSeleccionado = (numero) => {
        if (!isPlaying) return; // Solo permite seleccionar números si el juego está en marcha

        if (ejercicios[index].respuesta === numero) {
            setModalMessage("🎉 ¡Bingo! 🎉");
        } else {
            setModalMessage("😵 Respuesta incorrecta 😵");
        }
        setNumeroSeleccionado(numero);
        handleMostrarProcedimiento();
    };

    const handleSiguienteEjercicio = () => {
        if (index < ejercicios.length - 1) {
            setIndex(index + 1);
            setNumeroSeleccionado(null); // Reiniciar número seleccionado al cambiar de ejercicio
        }
    };

    const handleAnteriorEjercicio = () => {
        if (index > 0) {
            setIndex(index - 1);
            setNumeroSeleccionado(null); // Reiniciar número seleccionado al cambiar de ejercicio
        }
    };

    const handleJugar = () => {
        const nuevosEjercicios = [...ejercicios];
        nuevosEjercicios[index].visible = false;
        setIsPlaying(true);
        setTimeLeft(90); // Reiniciar el contador de tiempo cuando el usuario comienza a jugar
    };

    const procedimientoConSaltosDeLinea = ejercicios[index].procedimiento.split(';').map((linea, index) => (
        <p key={index}>{linea}</p>
    ));

    return (
        <div className="container mx-auto">
            <div className="flex flex-col justify-center mt-11">
                <table className="table-auto border-collapse border border-gray-800 overflow-x-auto">
                    <thead>
                        <tr>
                            <th colSpan={8} className="px-4 py-2 bg-gray-800 text-white animate-blurred-fade-in">Respuestas de ejercicios</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((fila, indexFila) => (
                            <tr key={indexFila}>
                                {fila.map((valor, indexColumna) => (
                                    <td key={indexColumna} className="border px-4 py-2 bg-gray-900 text-white hover:bg-gray-700 hover:text-white" onClick={() => handleNumeroSeleccionado(valor)}>{valor}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    isPlaying && (
                        <span className='text-white mt-6 ml-4 flex justify-center'>
                            {' ⏲️ ' + timeLeft}
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
                                <td className="border px-4 py-2 text-white">{ejercicios[index].id}</td>
                                <td className="border px-4 py-2 text-white">{ejercicios[index].ejercicio}</td>
                                <td className="border px-4 py-4 text-white espacio-extra">
                                    {ejercicios[index].visible ? procedimientoConSaltosDeLinea : ''}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <button onClick={handleJugar} className="mr-4 sm:mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Jugar
                    </button>
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

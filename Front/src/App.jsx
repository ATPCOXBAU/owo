import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [selectedSensor, setSelectedSensor] = useState('sensores');
  
  const [sensorDataAutomatic, setSensorDataAutomatic] = useState({
    luminosidad: 0,
    temperatura: 0,
    humedad: 0,
    viento: 0,
    presion: 0,
    aire: 0,
  });
  const [sensorDataSelected, setSensorDataSelected] = useState({
    promedio: 0,
    median: 0,
    standardDeviation: 0,
    moda: 0,
    contador: 0,
    max: 0,
    min: 0,
    goodAir: 0,
    badAir: 0,
  });

  const [sensorStatus, setSensorStatus] = useState([
    { id: 1, name: 'TEMPERATURA', value: 0, unit: '°C' },
    { id: 2, name: 'HUMEDAD', value: 0, unit: '%' },
    { id: 3, name: 'Velocidad Viento', value: 0, unit: 'm/s' },
    { id: 4, name: 'Presión', value: 0, unit: 'hPa' },
    { id: 5, name: 'Calidad Aire', value: 0, unit: '%' },
    { id: 6, name: 'Luminosidad', value: 0, unit: '' },
  ]);

  const endpointUrl = 'http://192.168.0.20:5000';

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensorDataAutomatic('/sensores');
    }, 10000); // 10000 ms = 10 segundos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [selectedSensor]);

  useEffect(() => {
    fetchSensorDataSelected('/sensores');
  }, ['/sensores']);

  const fetchSensorDataAutomatic = async (sensor,  newState) => {
    try {
      const response = await axios.post(`${endpointUrl}/${sensor}`, { state: newState });
      const data = response.data;
      setSensorDataAutomatic((prevData) => ({
        ...prevData,
        luminosidad: data.luminosidad,
        temperatura: data.temperatura,
        humedad: data.humedad,
        viento: data.viento,
        presion: data.presion,
        aire: data.aire,
      }));
      
        setSensorStatus([
          { id: 1, name: 'TEMPERATURA', value: data.temperatura, unit: '°C' },
          { id: 2, name: 'HUMEDAD', value: data.humedad, unit: '%' },
          { id: 3, name: 'Velocidad Viento', value: data.viento, unit: 'm/s' },
          { id: 4, name: 'Presión', value: data.presion, unit: 'hPa' },
          { id: 5, name: 'Calidad Aire', value: data.aire, unit: '%' },
          { id: 6, name: 'Luminosidad', value: data.luminosidad, unit: '' },
        ]);
      
    } catch (error) {
      console.error(`Failed to fetch automatic data for ${sensor}:`, error);
    }
  };

  const fetchSensorDataSelected = async (sensor,  newState) => {
    try {
      const response = await axios.post(`${endpointUrl}/${sensor}`, { state: newState });
      const data = response.data;
      setSensorDataSelected((prevData) => ({
        ...prevData,
        promedio: data.promedio,
        median: data.median,
        standardDeviation: data.desviacion,
        moda: data.moda,
        contador: data.contador,
        max: data.max,
        min: data.min,
        goodAir: data.goodAir,
        badAir: data.badAir,
        
      }));
    } catch (error) {
      console.error(`Failed to fetch selected data for ${sensor}:`, error);
    }
  };


  



  const handleSensorChange = (event) => {
    setSelectedSensor(event.target.value);
  };

  const getColor = (value) => {
    if (value > 75) return 'green';
    if (value > 50) return 'orange';
    return 'red';
  };

  return (
    <>
      {/* Sección de estado de sensores */}
      <header className="header text-center p-3 mb-4 bg-dark text-white">
        <h1>Estado de Sensores</h1>
      </header>
      <div className="container">
        {/* Filas de tarjetas de sensores */}
        <div className="row mb-4 justify-content-center">
          {sensorStatus.map((sensor) => (
            <div className="col-md-2 mb-4" key={sensor.id}>
              <div className="card text-center">
                <div className="card-body">
                  {sensor.name === 'Luminosidad' || sensor.name === 'Temperatura' || sensor.name === 'humedad' || sensor.name === 'Viento' || sensor.name === 'Presion' || sensor.name === 'Calidad Aire' || sensor.name === 'Calidad Aire' ? (
                    <p className="card-title mt-2">{sensor.name}: {sensor.value}</p>
                  ) : (
                    <CircularProgressbar
                      value={sensor.value}
                      text={`${sensor.value} ${sensor.unit}`}
                      styles={buildStyles({
                        pathColor: getColor(sensor.value),
                        textColor: getColor(sensor.value),
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                      })}
                    />
                  )}
                  {!(sensor.name === 'Luminosidad' || sensor.name === 'Temperatura' || sensor.name === 'Humedad' || sensor.name === 'Viento' || sensor.name === 'Presion' || sensor.name === 'Calidad Aire') && <p className="card-title mt-2">{sensor.name}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Franja negra con barra de selección */}
        <header className="header text-center p-2 mb-3 bg-dark text-white w-100">
          <h1>ACL1_GRUPO9_PROYECTO2_JUN24</h1>
          <select
            className="form-select mt-3 w-40 mx-auto"
            onChange={handleSensorChange}
            value={selectedSensor}
          >
            <option value="temperatura">Temperatura</option>
            <option value="humedad">Humedad</option>
            <option value="viento">Velocidad de Viento</option>
            <option value="aire">Calidad de Aire</option>
          </select>
        </header>

        {/* Tabla de datos del sensor */}
        <div className="row justify-content-center">
          <div className="col-md-8">
            {selectedSensor === 'aire' ? (
              <table className="table table-striped table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>Aire Bueno</th>
                    <th>Aire Malo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{sensorDataSelected.goodAir}</td>
                    <td>{sensorDataSelected.badAir}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="table table-striped table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>Promedio</th>
                    <th>Mediana</th>
                    <th>Desviacion Estandar</th>
                    <th>Maximo</th>
                    <th>Minimo</th>
                    <th>Moda</th>
                    <th>Contador</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{sensorDataSelected.promedio}</td>
                    <td>{sensorDataSelected.median}</td>
                    <td>{sensorDataSelected.standardDeviation}</td>
                    <td>{sensorDataSelected.max}</td>
                    <td>{sensorDataSelected.min}</td>
                    <td>{sensorDataSelected.moda}</td>
                    <td>{sensorDataSelected.contador}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

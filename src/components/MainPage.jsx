import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';
import '../MainPagestyles.css';

const MainPage = () => {
  const [selectedYear, setSelectedYear] = useState(2023);
  const [tableData, setTableData] = useState([]);
  const [plotData, setPlotData] = useState([]);
  const [plotRelativeData, setPlotRelativeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.openligadb.de/getbltable/bl1/${selectedYear}`);
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    
    fetchData();
  }, [selectedYear]);

 
  useEffect(() => {
   
    const sortedData = [...tableData].sort((a, b) => b.goals - a.goals);
    const newPlotData = [barChart(sortedData)];
    setPlotData(newPlotData);
  }, [tableData]);
  
  useEffect(() => {
    const newPlotRelativeData = [relativeBarchart(tableData)];
    setPlotRelativeData(newPlotRelativeData);
  }, [tableData]);
  
  const relativeBarchart = (data) => {
    return {
      x: data.map((team) => team.teamName),
      y: data.map((team) => team.goalDiff),
      type: 'bar',
    };
  };

  const barChart = (data) => {
    return {
      type: 'bar',
      text: data.map((team) => team.goals),
      textposition: 'auto',
      hoverinfo: 'none',
      x: data.map((team) => team.teamName),
      y: data.map((team) => team.goals),
      marker: {
        color: 'red',
      },
    };
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const yearOptions = [];
  for (let year = 2023; year >= 2010; year--) {
    yearOptions.push(<option key={year} value={year}>{year}</option>);
  }

  return (
    <div className="container">
      <h1><img src="https://www.fifplay.com/img/public/bundesliga-logo.png" alt={`Icono de la Bundesliga`} /></h1>
      <label htmlFor="yearSelector">Año seleccionado: </label>
      <select id="yearSelector" className="select" onChange={handleYearChange} value={selectedYear}>
        {yearOptions}
      </select>
<table>
      <thead>
        <tr>
          <th className="table-header">Icono</th>
          <th className="table-header">Posición</th>
          <th className="table-header">Equipo</th>
          <th className="table-header">Puntos</th>
          <th className="table-header">PJ</th>
          <th className="table-header">PG</th>
          <th className="table-header">PE</th>
          <th className="table-header">PP</th>
          {selectedYear === 2023 && <th className="table-header">Más detalles</th>}
        </tr>
      </thead>
      <tbody>
        {tableData.map((team, index) => (
          <tr key={index} className="table-row">
            <td className="team-icon"><img src={team.teamIconUrl} alt={`Icono del equipo ${team.teamName}`} /></td>
            <td className="table-data">{index + 1}</td>
            <td className="table-data">
              <Link to={`/team/${team.shortName}?year=${selectedYear}`} className="team-link">{team.teamName}</Link>
            </td>
            <td className="table-data">{team.points}</td>
            <td className="table-data">{team.matches}</td>
            <td className="table-data">{team.won}</td>
            <td className="table-data">{team.draw}</td>
            <td className="table-data">{team.lost}</td>
            {selectedYear === 2023 && (
              <td className="table-data">
                <Link to={`/2023/${team.teamInfoId}`} className="team-link">mas info</Link>
              </td>
            )}
          </tr>
        ))}
      </tbody>
      </table>
      <div className="plotContainer">
        <h1>Estadisticas de la Bundesliga</h1>
      <Plot data={plotData} layout={{ title: '<b>Total de goles</b>' }} />
      <Plot
        data={plotRelativeData}
        layout={{

          yaxis: { title: 'diff goles' },
          barmode: 'relative',
          title: '<b>Diferencia de goles</b>',
        }}
      />
      </div>
    </div>
  );
};

export default MainPage;

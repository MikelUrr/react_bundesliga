import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../MainPagestyles.css';
const MainPage = () => {
    const [selectedYear, setSelectedYear] = useState(2023);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {

        fetch(`https://api.openligadb.de/getbltable/bl1/${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                setTableData(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);

            });
    }, [selectedYear]);


    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };
    const yearOptions = [];
    for (let year = 2023; year >= 2010; year--) {
      yearOptions.push(<option key={year} value={year}>{year}</option>);
    }

    return (
        <div className="container">
           <h1><img src="https://www.fifplay.com/img/public/bundesliga-logo.png" alt={`Icono de la Bundesliga`} /></h1>
            <label htmlFor="yearSelector">Año seleccionado: </label>
            <select id="yearSelector" onChange={handleYearChange} value={selectedYear}>
        {yearOptions}
      </select>


            <table className="bundesliga-table">
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
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((team, index) => (
                        <tr key={index} className="table-row">
                            <td className="team-icon"><img src={team.teamIconUrl} alt={`Icono del equipo ${team.teamName}`} /></td>
                            <td className="table-data">{index+1}</td>
                            
                            <td className="table-data">
                                <Link to={`/team/${team.shortName}?year=${selectedYear}`} className="team-link">{team.teamName}</Link>
                            </td>
                            <td className="table-data">{team.points}</td>
                            <td className="table-data">{team.matches}</td>
                            <td className="table-data">{team.won}</td>
                            <td className="table-data">{team.draw}</td>
                            <td className="table-data">{team.lost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MainPage;
import React, { useEffect, useState } from 'react';
import { useParams, useLocation,Link } from 'react-router-dom';
import '../TeamDashboardstyles.css';


const TeamDashboard = () => {
  const { shortName } = useParams();
  const location = useLocation();
  const selectedYear = new URLSearchParams(location.search).get('year');
  console.log(selectedYear)
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realizar la solicitud a la API utilizando shortName y selectedYear
        const response = await fetch(`https://api.openligadb.de/getmatchdata/bl1/${selectedYear}/${shortName}`);
        const data = await response.json();
        console.log(data)
        // Actualizar el estado con los datos de los partidos
        setMatches(data);
        setLoading(false);
      } catch (error) {
        // Manejar errores de la solicitud
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [shortName, selectedYear]);
  if (loading) {
    return<div className="wrapper">
    <div className="space">
      <div className="loading"></div>
    </div>
  </div>;
  }

  if (error) {
    return <p className="error">Error al cargar los datos: {error.message}</p>;
  }

  return (
    <div className="team-dashboard">
      <button className="back-link"><Link to="/" >Atrás</Link></button>
      <h2 className="team-title">Resultados del  {shortName} </h2>
      <p className="selected-year">Año: {selectedYear}</p>

      <ul className="matches-list">
        {matches.map(match => (
          <li key={match.matchID} className="match-item">
            <p className="match-date">Fecha: {match.matchDateTime}</p>
            <p className="teams">{match.team1.teamName} vs {match.team2.teamName}</p>

            {match.matchResults && match.matchResults[0] ? (
              <p className="result">{match.matchResults[0].pointsTeam1} : {match.matchResults[0].pointsTeam2}</p>
            ) : (
              <p className="no-results">No hay resultados disponibles</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamDashboard;

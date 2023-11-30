import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import '../TeamDashboardstyles.css';
import Plot from 'react-plotly.js';
import ErrorPage from "./ErrorPage";

const TeamDashboard = () => {
  const { shortName } = useParams();
  const location = useLocation();
  const selectedYear = new URLSearchParams(location.search).get('year');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plotData, setPlotData] = useState([]);
  const [pieplot, Setpieplot] = useState([]);

  const fetchTeamData = async (year, shortName) => {
    const response = await fetch(`https://api.openligadb.de/getmatchdata/bl1/${year}/${shortName}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  };

  const calculateMatchStats = (matches, targetShortName) => {
    const teamStats = [];
    matches.forEach((match, index) => {
      const team1 = match.team1;
      const team2 = match.team2;

      if (team1.shortName === targetShortName || team2.shortName === targetShortName) {
        const isTeam1 = team1.shortName === targetShortName;
        const endResult = match.matchResults.find(result => result.resultName === "Endergebnis");

        if (endResult) {
          const goalsTeam1 = isTeam1 ? endResult.pointsTeam1 || 0 : endResult.pointsTeam2 || 0;
          const goalsTeam2 = isTeam1 ? endResult.pointsTeam2 || 0 : endResult.pointsTeam1 || 0;

          let result = 0;
          if (goalsTeam1 > goalsTeam2) {
            result = 3;
          } else if (goalsTeam1 < goalsTeam2) {
            result = 0;
          } else {
            result = 1;
          }

          const matchStats = {
            partido: index + 1,
            golesfavor: goalsTeam1,
            golescontra: goalsTeam2,
            puntos: result
          };

          teamStats.push(matchStats);
        } 
      }
    });

    return teamStats;
  };

  const scatterChart = (jsonResult) => {
    const accumulatedPoints = jsonResult.reduce((acc, teamStat) => {
      const cumulativePoints = acc.length > 0 ? acc[acc.length - 1] + teamStat.puntos : teamStat.puntos;
      acc.push(cumulativePoints);
      return acc;
    }, []);

    return {
      mode: 'lines+markers',
      textposition: 'auto',
      x: jsonResult.map((teamStat) => teamStat.partido),
      y: accumulatedPoints,
      marker: {
        color: 'red',
      },
    };
  };

  const pieChart = (jsonResult) => {
    const totalMatches = jsonResult.length;
    const winPercentage = (jsonResult.filter(match => match.puntos === 3).length / totalMatches) * 100;
    const drawPercentage = (jsonResult.filter(match => match.puntos === 1).length / totalMatches) * 100;
    const lossPercentage = (jsonResult.filter(match => match.puntos === 0).length / totalMatches) * 100;
    return {
      values: [winPercentage, drawPercentage, lossPercentage],
      labels: ['% Victorias', '% empates', '% derrotas'],
      type: 'pie',
      textinfo:'percent+label',
      hoverinfo:'skip'
    };
  }

  const fetchData = async (year, shortName) => {
    try {
      const data = await fetchTeamData(year, shortName);
      const targetShortName = shortName;
      const teamStats = calculateMatchStats(data, targetShortName);
  
      const jsonResult = JSON.stringify(teamStats, null, 2);
      
      
      setMatches(data);
      setLoading(false);
  
      const piePlot = [pieChart(teamStats)];
      Setpieplot(piePlot);
  
      const newPlotData = [scatterChart(teamStats)];
      setPlotData(newPlotData);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(selectedYear, shortName);
  }, [shortName, selectedYear]);

  if (loading) {
    return (
      <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  )}

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const formattedDate = `${padZero(dateTime.getDate())}-${padZero(dateTime.getMonth() + 1)}-${dateTime.getFullYear()}`;
    const formattedTime = `${padZero(dateTime.getHours())}:${padZero(dateTime.getMinutes())}`;
    return `Fecha ${formattedDate} Hora ${formattedTime}`;
  };

  const padZero = (value) => (value < 10 ? `0${value}` : value);


  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="team-dashboard">
      <div className="button-container">
      <button className="bttn-pill bttn-md bttn-primary"><Link to="/">Clasificación</Link></button>
      </div>
      <h1>{shortName}</h1>
      <div className='teamPlots'>
        <Plot data={plotData} layout={{
          width: 650,
          height: 650,
          xaxis: { title: "Partidos jugados" },
          yaxis: { title: "Puntos" },
          title: '<b>Evolución de puntos conseguidos durante la temporada</b>'
        }} />
        <Plot data={pieplot} layout={{ width: 650, height: 650,showlegend: false, title: '<b>Resultados </b>' }} />
      </div>
      <div>
        <h2 className="team-title">Resultados</h2>
        <p className="selected-year">Año: {selectedYear}</p>
        <ul className="matches-list">
          {matches.map(match => (
            <li key={match.matchID} className="match-item">
              <p className="match-date">{formatDateTime(match.matchDateTime)}</p>
              <p className="teams"><img src={match.team1.teamIconUrl} alt={`Icono del equipo ${match.team1.teamName}`}  /> {match.team1.teamName} vs {match.team2.teamName}<img src={match.team2.teamIconUrl} alt={`Icono del equipo ${match.team2.teamName}`}  /> </p>
              {match.matchResults && match.matchResults[1] ? (
                <p className="result">{match.matchResults[1].pointsTeam1} : {match.matchResults[1].pointsTeam2}</p>
              ) : (
                <p className="no-results">Partido pendiente de disputar</p>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="go-top-container">
      <button className="go-top-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Ir arriba
      </button>
    </div>
    </div>
  );
};

export default TeamDashboard;

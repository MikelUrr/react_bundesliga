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
        } else {
          console.error(`No se encontraron resultados válidos para el partido ${index + 1}`);
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
      type: 'pie'
    };
  }

  const fetchData = async (year, shortName) => {
    try {
      const data = await fetchTeamData(year, shortName);
      const targetShortName = shortName;
      const teamStats = calculateMatchStats(data, targetShortName);
  
      const jsonResult = JSON.stringify(teamStats, null, 2);
      console.log(jsonResult);
  
      if (teamStats.length === 0) {
        throw new Error("No se encontraron estadísticas del equipo.");
      }
  
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
      <div className="wrapper">
        <div className="space">
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="team-dashboard">
      <button className="back-link"><Link to="/">Atrás</Link></button>
      <div>
        <Plot data={plotData} layout={{
          width: 800,
          height: 800,
          xaxis: { title: "Partidos jugados" },
          yaxis: { title: "Puntos" },
          title: 'Evolución de puntos conseguidos durante la temporada'
        }} />
        <Plot data={pieplot} layout={{ width: 800, height: 800, title: 'Resultados ' }} />
      </div>
      <div>
        <h2 className="team-title">Resultados del {shortName}</h2>
        <p className="selected-year">Año: {selectedYear}</p>
        <ul className="matches-list">
          {matches.map(match => (
            <li key={match.matchID} className="match-item">
              <p className="match-date">Fecha: {match.matchDateTime}</p>
              <p className="teams">{match.team1.teamName} vs {match.team2.teamName}</p>
              {match.matchResults && match.matchResults[1] ? (
                <p className="result">{match.matchResults[1].pointsTeam1} : {match.matchResults[1].pointsTeam2}</p>
              ) : (
                <p className="no-results">No hay resultados disponibles</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamDashboard;

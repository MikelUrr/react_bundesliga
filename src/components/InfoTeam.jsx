import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import equiposBundesliga from "./../info";
import ErrorPage from "./ErrorPage";
import "./../infoTeam.css"

const InfoTeam = () => {
  const { teamInfoId } = useParams();
  const teamId = parseInt(teamInfoId, 10);

  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  const fetchTeamData = async (teamInfoId) => {
    try {
      const response = await fetch(`https://api.openligadb.de/getmatchesbyteamid/${teamInfoId}/0/10`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchTeamData(teamId);
  }, [teamId]);

  useEffect(() => {
    
    window.scrollTo(0, 0);
  }, [matches]);

  const teamInfo = equiposBundesliga[teamId];

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
    <div>
      <div className="button-container">
      <button className="bttn-pill bttn-md bttn-primary"><Link to="/">Clasificación</Link></button>
      </div>
      {teamInfo && (
        <>
          <h1>{teamInfo.nombre}</h1>
          <img className="animacionLogo" src={teamInfo.logo} alt={`Logo de ${teamInfo.nombre}`} />
          <h3>Ciudad:</h3>
          <p>{teamInfo.ciudad}</p>
          
          {teamInfo.coordenadasEstadio && (
            <MapContainer center={[teamInfo.coordenadasEstadio.latitud, teamInfo.coordenadasEstadio.longitud]} zoom={13} style={{ height: "400px", marginTop: "20px" }}>
              <TileLayer
                attribution=' Mapa ofrecido gracias al PEC'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[teamInfo.coordenadasEstadio.latitud, teamInfo.coordenadasEstadio.longitud]}>
                <Popup>
                  {teamInfo.nombre} - Estadio
                </Popup>
              </Marker>
            </MapContainer>
          )}
          <h3>Historia: </h3>
          <p>{teamInfo.historia}</p>
          <h3>Jugadores Famosos: </h3>
          <p> {teamInfo.jugadoresFamosos}</p>
          <h2>Proximos Partidos</h2>
          <ul className="matches-list">
  {matches.map(match => (
    <li key={match.matchID} className="match-item">
      <h3 className="league-name">{match.leagueName}</h3>
      <p className="match-date">{formatDateTime(match.matchDateTime)}</p>
      <p className="teams">{match.team1.teamName} vs {match.team2.teamName}</p>
      
    </li>
  ))}
</ul>
        </>
      )}
      <div className="go-top-container">
      <button className="go-top-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Ir arriba
      </button>
    </div>
    </div>
  );
};

export default InfoTeam;

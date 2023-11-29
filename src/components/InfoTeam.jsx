import React, { useState, useEffect } from "react";
import { useParams , Link} from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import equiposBundesliga from "./../info";

const InfoTeam = () => {
  const { teamInfoId } = useParams();
  const teamId = parseInt(teamInfoId, 10);

  const [matches, setMatches] = useState([]);

  const fetchTeamData = async (teamInfoId) => {
    const response = await fetch(`https://api.openligadb.de/getmatchesbyteamid/${teamInfoId}/0/10`);
    const data = await response.json();
    setMatches(data);
  };

  useEffect(() => {
    fetchTeamData(teamId);
  }, [teamId]);

  const teamInfo = equiposBundesliga[teamId];

  return (
    <div>
         <button className="back-link"><Link to="/">Atrás</Link></button>
      {teamInfo && (
        <>
          <h1>{teamInfo.nombre}</h1>
          <img src={teamInfo.logo} alt={`Logo de ${teamInfo.nombre}`} />
          <p>Ciudad: {teamInfo.ciudad}</p>
          <p>Historia: {teamInfo.historia}</p>
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
          <h2>Partidos</h2>
          <ul>
            {matches.map((match) => (
              <li key={match.matchID}>
                <h3>{match.leagueName}</h3>
                <p>Fecha y hora: {match.matchDateTime}</p>
                <p>Equipo local: {match.team1.teamName}</p>
               
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default InfoTeam;
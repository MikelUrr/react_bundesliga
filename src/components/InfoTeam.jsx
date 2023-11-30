import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import equiposBundesliga from "./../info";
import ErrorPage from "./ErrorPage";
import "./../infoTeam.css"

const fotos =["https://c8.alamy.com/compes/peehdw/ddr-rda-fussball-football-star-matthias-zimmerling-wehnert-2018-foto-peehdw.jpg", "https://static.dw.com/image/4867336_4.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/7a/Bundesarchiv_Bild_183-N0622-0035%2C_Fu%C3%9Fball-Weltmeisterschaft%2C_Spiel_DDR-BRD.jpg?20181003120530", "https://media.gettyimages.com/id/541820233/es/foto/sportler-fussball-ddr-finale-im-fdgb-pokal-in-ostberlin-lok-leipzig-bfc-dynamo-berlin-4-1.jpg?s=612x612&w=gi&k=20&c=H5bXDGoj5jKaraeCxcgK_IbRtZXifeOpYw3aOdTEcQM=","https://e00-marca.uecdn.es/assets/multimedia/imagenes/2022/12/20/16715451523916.jpg","https://live.staticflickr.com/3211/3123263355_feaf56f8b6_b.jpg","https://nypost.com/wp-content/uploads/sites/2/2016/03/hitler-5.jpg?quality=75&strip=all&w=1024"]
 
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
          <div className="famouscontainer">
          <h3>Jugadores Famosos: </h3>
          <ul className="famous-players-list">
            {teamInfo.jugadoresFamosos.map((jugador, index) => (
              <li key={index} className="famous-player-item">
                <img src={fotos[Math.floor(Math.random() * fotos.length)]} alt={`Imagen de ${jugador}`} />
                {jugador}
              </li>
            ))}
          </ul>
          </div>
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

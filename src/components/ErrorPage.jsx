import { Link } from "react-router-dom";
import "./../errorpage.css"
export default function ErrorPage() {


  return (
    <div id="error-page">
      <h1>Oops 404!</h1>
      <p>You Did It Again</p>
      <img src="https://media.tenor.com/gPPS96RhlTkAAAAd/hush-just-stop-britney-spears.gif" alt="opps" />
      <p> <Link to="/">Vuelve a inicio vuelve al hogar</Link></p>
      <p>
        Si estas aqui por clickar en el Gladbach o el BVB  la api https://api.openligadb.de no quiere a estos equipos. Buscate otro.
      </p>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Sad_Emoji_-_FREE_%2850215487012%29.png/1200px-Sad_Emoji_-_FREE_%2850215487012%29.png" alt="" />
    </div>
  );
}
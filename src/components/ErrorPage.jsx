import { Link} from "react-router-dom";

export default function ErrorPage() {
 

  return (
    <div id="error-page">
      <h1>Oops 404!</h1>
      <p>You Did It Again</p>
      <img src="https://media.tenor.com/gPPS96RhlTkAAAAd/hush-just-stop-britney-spears.gif" alt="opps" />
      
      <p>
        Si estas aqui por clickar en el Gladbach o el BVB  la api https://api.openligadb.de no quiere ha estos equipos
        <Link to="/">Vuelve a inicio</Link>
      </p>
    </div>
  );
}
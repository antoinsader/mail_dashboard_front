import "./Error.scss";


export default function ErrorComp({error}) {
  return error && error !== '' && (
    <div className="error_root">
        <p> {error} </p>
    </div>
  );
}


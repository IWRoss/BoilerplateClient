import "./Loading.scss";

export default function Loading({ message: loadingMessage }) {
  return (
    <div className="loading">
      <div className="loading__message">
        <h1>{loadingMessage || "Loading…"}</h1>
      </div>
    </div>
  );
}

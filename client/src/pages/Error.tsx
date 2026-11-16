import { Link, useRouteError } from 'react-router-dom';

interface RouteError {
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <main className="error-page">
      <section>
        <span className="eyebrow">A little kitchen mishap</span>
        <h1>Looks like we dropped a plate.</h1>
        <p>{error.statusText || error.message || 'This page is unavailable right now.'}</p>
        <Link className="button button-primary" to="/">Back to discovery</Link>
      </section>
    </main>
  );
}

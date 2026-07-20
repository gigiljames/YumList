import { Link } from "react-router";

function NotFoundPage() {
  return <div className="h-screen w-full flex flex-col justify-center items-center gap-10">
    <h1 className="font-extrabold text-6xl">Not found</h1>
    <Link to="/" className="text-xl underline text-blue-600 hover:text-blue-700">Go Home</Link>
  </div>;
}

export default NotFoundPage;

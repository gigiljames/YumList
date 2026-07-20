import { Route, Routes } from "react-router";
import ManagePage from "./pages/ManagePage";
import NotFoundPage from "./pages/NotFoundPage";
import RestaurantPage from "./pages/RestaurantPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ManagePage />} />
        <Route path="/add" element={<RestaurantPage />} />
        <Route path="/edit/:id" element={<RestaurantPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;

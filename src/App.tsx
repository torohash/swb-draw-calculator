import "./App.css";
import DrawTable from "./components/DrawTable";

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        シャドウバース ドロー確率シミュレーター
      </h1>
      <DrawTable data={[]} />
    </div>
  );
}

export default App;

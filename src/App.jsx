import { BrowserRouter, Route, Routes } from "react-router";
import WCAGContrastChecker from "./page/ContrastChecker";
import ColorChecker from "./page/ColorChecker";
import DemoCheck from "./page/DemoCheck";

function App() {
  

  return (
    <BrowserRouter>
       <Routes>
       <Route path="/" element={<WCAGContrastChecker />} />
       <Route path="/color" element={<ColorChecker />} />
       <Route path="/demo" element={<DemoCheck />} />
      </Routes>     
    </BrowserRouter>
   
  )
}

export default App;

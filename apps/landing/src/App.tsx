import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import "./App.css";
import { Created } from "./components/Created";
import { Explanations } from "./components/Explanation";
import { PackageManagers } from "./components/PackageManagers";
import { Parameters } from "./components/Parameters";
import { Usage } from "./components/Usage";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Explanations />
      <Usage />
      <Parameters />
      <PackageManagers />
      <Created />
      <ScrollToTop />
    </>
  );
}

export default App;

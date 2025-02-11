import { Hero } from "./components/hero";
import { Navbar } from "./components/navbar";
import { ScrollToTop } from "./components/scroll-to-top";
import "./App.css";
import { Created } from "./components/created";
import { Explanations } from "./components/explanation";
import { PackageManagers } from "./components/package-managers";
import { Parameters } from "./components/parameters";
import { Usage } from "./components/usage";

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

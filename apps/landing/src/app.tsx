import { Hero } from "./components/hero.tsx";
import { Navbar } from "./components/navbar.tsx";
import { ScrollToTop } from "./components/scroll-to-top.tsx";
import "./App.css";
import { Created } from "./components/created.tsx";
import { Explanations } from "./components/explanation.tsx";
import { PackageManagers } from "./components/package-managers.tsx";
import { Parameters } from "./components/parameters.tsx";
import { Usage } from "./components/usage.tsx";

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

import { Hero } from "./components/hero.tmp.tsx";
import { Navbar } from "./components/navbar.tmp.tsx";
import { ScrollToTop } from "./components/scroll-to-top.tmp.tsx";
import "./App.css";
import { Created } from "./components/created.tmp.tsx";
import { Explanations } from "./components/explanation.tmp.tsx";
import { PackageManagers } from "./components/package-managers.tmp.tsx";
import { Parameters } from "./components/parameters.tmp.tsx";
import { Usage } from "./components/usage.tmp.tsx";

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

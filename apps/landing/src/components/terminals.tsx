import { Terminal } from "./ui/terminal";

const BrainhubLink = () => (
  <a 
    href="https://github.com/brainhubeu"
    className="text-primary"
    target="_blank"
  >
    @brainhubeu
  </a>
)

export const HeroTerminal = () => (
  <Terminal>
    <div>✓ 256 licenses are compliant</div>
    <div className="text-red-400">* 3 licenses are blacklisted:</div>
    <div>› @img/sharp-libvips-darwin-arm64@1.0.2 LGPL-3.0</div>
    <div>› rollup-plugin-dts@6.1.1 LGPL-3.0-only</div>
    <div>› @img/sharp-libvips-darwin-arm64@1.0.1 LGPL-3.0</div>
    <div className="text-red-400">⚠ 2 licenses are unknown:</div>
    <div>› @iconify-json/cil@1.1.8 Unlicense</div>
    <div>› @iconify-json/logos@1.1.42 CC0-1.0</div>
    <div className="text-red-400">⚠ 5 packages are missing license information:</div>
    <div>› clear@0.1.0</div>
    <div>› gitconfiglocal@1.0.0</div>
    <div>› map-stream@0.1.0</div>
    <div>› pause@0.0.1</div>
    <div>› tsv@0.2.0</div>
  </Terminal>
)

export const LocalCodeTerminal = () => (
  <Terminal>
    <div className="opacity-60"># initialize config</div>
    <div>npx <BrainhubLink />/lac init</div>
    <br />
    <div className="opacity-60"># perform dependency check</div>
    <div>npx <BrainhubLink />/lac</div>
  </Terminal>
)

export const CiCdTerminal = () => (
  <Terminal>
    <div className="text-zinc-500"><span className="text-primary">license-audit</span>:</div>
    <div>  <span className="text-zinc-500"><span className="text-primary">runs-on</span>:</span> ubuntu-latest</div>
    <div className="text-zinc-500">  <span className="text-primary">steps</span>:</div>
    <div>    <span className="text-zinc-500">- <span className="text-primary">name</span>:</span> Install lac</div>
    <div>      <span className="text-zinc-500"><span className="text-primary">run</span>:</span> npm i -g <BrainhubLink />/lac</div>
    <br />
    <div>    <span className="text-zinc-500">- <span className="text-primary">name</span>:</span> Run audit</div>
    <div>      <span className="text-zinc-500"><span className="text-primary">run</span>:</span> lac --default-config --bail 1</div>
  </Terminal>
)

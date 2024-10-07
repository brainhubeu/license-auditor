// A file to test out TS&Biome configs
import * as fs from "fs";
import { join } from "path";
import { readFile } from "fs"; // Unused import

function tooComplex() {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      for (let z = 0; z < 10; z++) {
        if (x % 2 === 0) {
          if (y % 2 === 0) {
            console.log(x > y ? `${x} > ${y}` : `${y} > ${x}`);
          }
        }
      }
    }
  }
}

const boolExp = true;
const r = true && boolExp;

export default tooComplex;
let a_value = 0;

const a = async () => {
  a_value = await Promise.resolve(1);
};

a();

console.log(a_value);

const result = JSON.parse("{}");
const filteredArray = [1, 2, undefined].filter(Boolean); // number[]

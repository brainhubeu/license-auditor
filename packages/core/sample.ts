// A file to test out TS&Biome configs

namespace Utils {
  export function log(message) {
    // Missing type annotation for 'message'
    console.log(message);
  }
}

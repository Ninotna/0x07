/**
 * Basic French stemmer to handle simple cases like singular/plural, accents, and common forms.
 */
export default class BasicStemmerFr {
    constructor() {
      // Define basic suffix removal rules for French
      this.suffixes = ['s', 'es', 'aux']; // You can add more suffixes here
    }
  
    // Normalize accents in a string
    normalizeAccents(word) {
      return word
        .replace(/[àáâãäå]/g, "a")
        .replace(/[èéêë]/g, "e")
        .replace(/[îï]/g, "i")
        .replace(/[ôö]/g, "o")
        .replace(/[ùûü]/g, "u")
        .replace(/[ç]/g, "c");
    }
  
    // Stem the word by removing common French suffixes
    stem(word) {
      // Step 1: Normalize case and accents
      let normalizedWord = this.normalizeAccents(word.toLowerCase().trim());
  
      // Step 2: Remove plural or common suffixes
      for (let suffix of this.suffixes) {
        if (normalizedWord.endsWith(suffix)) {
          normalizedWord = normalizedWord.slice(0, -suffix.length);
          break;
        }
      }
  
      // Step 3: Handle common irregular plural forms manually (expand this as needed)
      if (normalizedWord === 'boeuf') {
        normalizedWord = 'boeufs'; // Singular/plural same in this case
      }
  
      return normalizedWord;
    }
  }
  
  // Example usage:
  const stemmer = new BasicStemmerFr();
  
  // Test with singular/plural variations
//   console.log(stemmer.stem("bananes")); // Output: "banane"
//   console.log(stemmer.stem("poissons")); // Output: "poisson"
//   console.log(stemmer.stem("bœufs"));   // Output: "boeufs"
//   console.log(stemmer.stem("éléphant")); // Output: "elephant"
  
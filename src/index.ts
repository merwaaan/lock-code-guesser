const inputElement = document.querySelector("textarea");

if (!inputElement) {
  throw new Error("Cannot find input element");
}

const buttonElement = document.querySelector("button");

if (!buttonElement) {
  throw new Error("Cannot find button element");
}

buttonElement.addEventListener("click", () => {
  run(inputElement.value);
});

function run(input: string) {
  console.log(`input = "${input}"`);

  // Validate input

  const sampledCodes = input
    .replace(/[^\d\s]/g, "") // Remove non-digits, non-spaces
    .replace(/\s+/g, " ") // Remove redundant spaces
    .trim()
    .split(" ");

  console.log(`sampled codes = ${sampledCodes.join(" ")}`);

  if (sampledCodes.length == 0) {
    throw new Error("No combinations provided");
  }

  const codeLength = sampledCodes[0].length;

  const allSameLength = sampledCodes.every((c) => c.length == codeLength);

  if (!allSameLength) {
    throw new Error("Not all combinations have the same length");
  }

  // Count occurrences for each position

  type Occurrences = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];

  const occurrences: [Occurrences, Occurrences, Occurrences, Occurrences] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  for (let code of sampledCodes) {
    for (let pos = 0; pos < codeLength; ++pos) {
      const digit = parseInt(code[pos]);
      ++occurrences[pos][digit];
    }
  }

  console.log("occurrences", occurrences);

  // Score possible combinations

  type ScoredCode = { code: string; score: number };

  const score = (code: string): ScoredCode => {
    let score = 0;

    for (let pos = 0; pos < codeLength; ++pos) {
      const digit = parseInt(code[pos]);

      let posScore = 0;

      for (let n = 0; n < 10; ++n) {
        const nOccurrences = occurrences[pos][n];

        const min = Math.min(digit, n);
        const max = Math.max(digit, n);
        const distance = Math.min(max - min, Math.abs(min - (max - 10)));

        posScore += distance * nOccurrences;
      }

      score += posScore;
    }

    return { code, score };
  };

  const possibleCodes = [...Array(Math.pow(10, codeLength)).keys()]
    .map((c) => c.toString().padStart(codeLength, "0"))
    .filter((c) => !sampledCodes.includes(c));

  let scoredCodes = possibleCodes.map((c) => score(c.toString()));

  scoredCodes.sort((code1, code2) => {
    return code1.score - code2.score;
  });

  console.log("scored codes", scoredCodes);

  // Display

  const tableElement = document.querySelector("table");

  if (!tableElement) {
    throw new Error("Cannot find table element");
  }

  tableElement.innerHTML = "";

  const createRow = (col1: string, col2: string, header = false) => {
    const rowElement = document.createElement("tr");

    const col1Element = document.createElement(header ? "th" : "td");
    col1Element.innerHTML = col1;
    rowElement.appendChild(col1Element);

    const col2Element = document.createElement(header ? "th" : "td");
    col2Element.innerHTML = col2;
    col2Element.style.textAlign = "right";
    rowElement.appendChild(col2Element);

    tableElement.appendChild(rowElement);
  };

  createRow("Combination", "Score", true);

  scoredCodes.forEach((scored) => {
    createRow(scored.code, scored.score.toString());
  });
}

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

  // Compute individual average digit values

  const averagedDigits: number[] = [];

  for (let i = 0; i < codeLength; ++i) {
    let sum = 0;

    for (let c of sampledCodes) {
      sum += parseInt(c[i]);
    }

    averagedDigits.push(sum / sampledCodes.length);
  }

  console.log(`averaged digits = ${averagedDigits.join(" ")}`);

  // Score possible combinations

  type ScoredCode = { code: string; score: number };

  const score = (code: string): ScoredCode => {
    let score = 0;

    for (let i = 0; i < codeLength; ++i) {
      const digitIndex = code.length - i - 1;

      let digit = parseInt(code[digitIndex]);

      const digitScore = Math.abs(digit - averagedDigits[digitIndex]);

      score += digitScore;
    }

    score *= score;

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

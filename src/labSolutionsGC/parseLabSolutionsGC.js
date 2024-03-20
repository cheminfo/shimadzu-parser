import { ensureString } from 'ensure-string';
import { ndParse } from 'ndim-parser';

export function parseLabSolutionsGC(blob) {
  const text = ensureString(blob);
  const lines = text.split(/\r?\n/).filter(line => line);
  const sections = getSections(lines);
  return parseSections(sections);
}

function parseSections(sections) {
  const parsed = {};
  for (const sectionName of Object.keys(sections)) {
    const section = sections[sectionName];
    parsed[sectionName] = parseSection(section);
  }
  return parsed;
}

function parseSection(section) {
  if (countVariablesLines(section) > 0) {
    return parseVariables(section);
  } else {
    return parseKeyValue(section);
  }
}

function parseKeyValue(lines) {
  const meta = {};
  for (const line of lines) {
    const [key, value] = line.split(/\t+/);
    meta[key] = value;
  }
  return meta
}

function parseVariables(lines) {
  const result = {
    variables: [],
    meta: [],
  };

  console.log(ndParse(lines.slice(0, 20).join('\n')))

  const variables = [];
  for (const line of lines) {
    const [name, value] = line.split(/\t+/);
    variables.push({ name, value });
  }
  return result;
}

function countVariablesLines(lines) {
  let counter = 0;
  for (const line of lines) {
    if (line.match(/^[0-9.\t]+$/)) counter++;
    else if (line.match(/.*\t.*\t.*/)) counter++;
  }
  return counter;
}


function getSections(lines) {
  const sections = {};
  let currentSection;
  for (const line of lines) {
    if (line.startsWith('[') && line.endsWith(']')) {
      const sectionName = line.slice(1, -1);
      currentSection = [];
      sections[sectionName] = currentSection;
    } else {
      if (!currentSection) {
        throw new Error(`No section found for line: ${line}`);
      }
      currentSection.push(line);
    }
  }
  return sections;
}
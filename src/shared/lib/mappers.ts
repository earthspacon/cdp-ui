import { LabelValue } from '../types/utility';

// DANGEROUS: DO NOT CHANGE ORDER OF LETTERS!
const ruToEnLetters = [
  'yo',
  'a',
  'b',
  'v',
  'g',
  'd',
  'e',
  'zh',
  'z',
  'i',
  'y',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'r',
  's',
  't',
  'u',
  'f',
  'h',
  'c',
  'ch',
  'sh',
  'sch',
  '',
  'i',
  '',
  'e',
  'yu',
  'ya',
];

export function translitToLatin(text: string) {
  return text
    .trim()
    .toLocaleLowerCase()
    .replace(/([а-яё])|([\s_-])|([^a-z\d])/gi, (_, ch, space, words) => {
      if (space || words) {
        return space ? '-' : '';
      }

      const code = ch.charCodeAt(0);
      const index =
        code === 1025 || code === 1105
          ? 0
          : code > 1071
          ? code - 1071
          : code - 1039;

      return ruToEnLetters[index];
    });
}

export function toLabelValueArray(
  stringsArray: string[],
): LabelValue<string>[] {
  return stringsArray.map((value) => ({ value, label: value }));
}

// Makes a new student booking code, e.g. `npm run student-code Emre` -> EMRE-7K2P.
// Add it to STUDENT_CODES in Netlify, then send it to the student.
import { randomInt } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I/L, easy to read aloud
const name = (process.argv[2] || 'STUDENT').toUpperCase().replace(/[^A-Z0-9]/g, '') || 'STUDENT';
const random = Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
console.log(`${name}-${random}`);

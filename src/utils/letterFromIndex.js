export default (i, lowerCase) => String.fromCharCode((lowerCase ? 97 : 65) + (i % 26));

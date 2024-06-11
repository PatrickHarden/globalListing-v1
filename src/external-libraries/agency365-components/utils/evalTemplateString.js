const _token = {
  open: '%(',
  close: ')s'
};

function escape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export default function evalTemplateString(string, tokens, tokenformat = _token) {
  let _string = string;
  Object.keys(tokens).forEach((key) => {
    const t = escape(`${tokenformat.open}${key}${tokenformat.close}`);
    _string = _string.replace(new RegExp(t, 'g'), tokens[key]);
  });
  return _string;
}

module.exports = (iconData) => {
    const defaults = {
        textSize: '10',
        textFont: 'Futura,Arial,sans-serif',
        textColor: '#00a657',
        textClass: 'marker-label',
        topOffset: 0.45,
        width: 36,
        height: 49
    };

    const options = Object.assign(defaults, iconData);

    return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${options.width}" height="${options.height}">
      <g>${options.svg}</g>
      <g><text class="${options.textClass}" style="font-size:${options.textSize}px; font-family:${options.textFont};" fill="${options.textColor}" text-anchor="middle" transform="translate(${options.width / 2}, ${options.height * options.topOffset})" >${options.text}</text></g>
    </svg>`;
};

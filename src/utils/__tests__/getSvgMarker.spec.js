const getSvgMarker = require('../getSvgMarker');

const sampleData = {
	textSize: 10,
	textColor: '#665938',
	height: 49,
	width: 36,
	text: '13',
	svg: '<image id="map-marker" x="0" y="0" width="26" height="37" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAlCAYAAABcZvm2AAAB30lEQVRYw72Wv0vDQBTH+yf0T+if4J/QoS2OcTO1Q0F3Hbq5VJzEoVtxi3RpHGoHBXHQ4iCigkEQQahGJD/U5Rb3815qQpo2l3eXqw++hCTv3ifv3Y+XQgFhjX6lvGZWtur9WjsU3MPzQl5b7S+XdLPWqZtVwkQ5IuAH/sKQ4Kv5weeLjUMBmsNyUTerIynIn2A8xOFCmKOVBxKTlQpjLw1FkFDGDEQ/qmmYwRuDFbp72QquqDKyuMlsbN6Ag9t9+v3zSeMG9/A8A2ajs7l3rinPnr8euRlGWfHm5uzlmGIM/DLnKq1smycNKmLgzy1f2pf0HrpCoMFTLzUrLggGitjV23kqKNhTqkC8eQrOQVWlA/+s0lkLXgzWZB9NWsHCljfEj/oOb8PCJMsugmh+sAcqHDXvZDwFgHvEEWTMdFNEJxUVmdt1g38ChSCIl97C1fUkI7Od523l0XLG/DfkaOkW939BURnFIRIweYgALD8EAVMHsW276HmetnexPbWhW6fr1BrfNeF9LoDv+yUGGDLRUJ3RTgR5/RjT2Lsh+AtDIAMmEoeEOrzpJiGhwF8TBc2FIEREQVRWQiX8t4wcx1mSgBEYJ7XqXNc1MBDwk1p1yX3EgpRZsHZS8By7j34BavE6yvtSpUgAAAAASUVORK5CYII="></image>'
}

describe('SVG GMaps Marker generator', () => {
	let svg;

	beforeEach(() => {
		svg = getSvgMarker(sampleData);
	})

	it('should return an <svg>', () => {
		expect(svg.trim().startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
	})

	it('should include the given image', () => {
		expect(svg).toContain(`<g>${sampleData.svg}</g>`);
	})

})

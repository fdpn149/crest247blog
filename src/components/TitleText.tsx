import "./TitleText.css"

export const TitleComponent = () => {
	const width = 100 * Math.log10(document.body.clientWidth)
	const height = 25 * Math.log10(document.body.clientWidth)

	function genPath() {
		const waveCount = 8;
		const center = height / 2;
		const y_min = height * 0.1;
		const y_max = height * 0.9;
		const x_interval = (width * 2) / waveCount;
		let x_end = x_interval;
		let x_first = x_end * 0.4;
		let x_second = x_end * 0.6;
		let up = true;
		let path = `M0,${center} `;
		for (let i = 0; i < waveCount; i++) {
			path += `C${x_first},${up ? y_min : y_max},${x_second},${
				up ? y_min : y_max
			},${x_end},${center} `;
			x_end += x_interval;
			x_first += x_interval;
			x_second += x_interval;
			up = !up;
		}
		path += `L${x_end - x_interval},${y_max} L0,${y_max} Z`;
		return path;
	}

	const wavePath = genPath();

	return (
		<svg className="title-text" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
			<defs>
				<path id="wave" d={wavePath} />
				<clipPath id="text-clip">
					<text
						x="50%"
						y="85%"
						textAnchor="middle"
						fontSize={20 * Math.log10(document.body.clientWidth)}
						fontWeight="bold">
						波峰的小棧
					</text>
				</clipPath>
			</defs>

			<g clipPath="url(#text-clip)">
				<use xlinkHref="#wave" className="wave1" fill="#00ff80ff" />
				<use xlinkHref="#wave" className="wave2" fill="#ff8000c8" />
				<use xlinkHref="#wave" className="wave3" fill="#8000ffa0" />
			</g>
		</svg>
	);
};
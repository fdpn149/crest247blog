import { FC } from "react";

interface Props {
	puzzle: [number, number][][];
	colorMap: Map<number, string>;
	type: string;
	selectedPos: [number, number];
}

const NonogramPuzzle: FC<Props> = ({ puzzle, colorMap, type, selectedPos }) => {
	return (
		<div className={`puzzle-${type}s`}>
			{puzzle.map((colors, index_s) => {
				return (
					<div className={`puzzle-${type}`} key={index_s}>
						{colors.length !== 0 ? (
							colors.map((colorTimes, index) => {
								const bgColor = colorMap?.get(colorTimes[0]);
								return (
									<div
										className={`cell ${
											(type === "row" && selectedPos[0] === index_s) ||
											(type === "col" && selectedPos[1] === index_s)
												? "cell-selected"
												: ""
										}`}
										style={{
											backgroundColor: bgColor,
										}}
										key={index}>
										<span>{colorTimes[1]}</span>
									</div>
								);
							})
						) : (
							<div
								className={`cell ${
									(type === "row" && selectedPos[0] === index_s) ||
									(type === "col" && selectedPos[1] === index_s)
										? "cell-selected"
										: ""
								}`}
								style={{ backgroundColor: "#000", color: "#fff" }}
								key={index_s}>
								<span>0</span>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default NonogramPuzzle
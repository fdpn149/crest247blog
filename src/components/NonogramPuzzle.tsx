import { FC, useEffect, useRef, useState } from "react";
import "./NonogramPuzzle.css";

interface Props {
	imgUrl: string;
}

const ImageToArray: FC<Props> = ({ imgUrl }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [pixelArray, setPixelArray] = useState<number[][][]>([]);
	const [isCanvasVisible, setCanvasVisible] = useState(true);

	const [puzzleRow, setPuzzleRow] = useState<[number, number][][]>([]);
	const [puzzleCol, setPuzzleCol] = useState<[number, number][][]>([]);
	const [colorMap, setColorMap] = useState<Map<number, string>>();

	const distinctColors = [
		"#e6194B",
		"#3cb44b",
		"#ffe119",
		"#4363d8",
		"#f58231",
		"#911eb4",
		"#42d4f4",
		"#f032e6",
		"#bfef45",
		"#fabed4",
		"#469990",
		"#dcbeff",
		"#9A6324",
		"#fffac8",
		"#800000",
		"#aaffc3",
		"#808000",
		"#ffd8b1",
		"#000075",
		"#a9a9a9",
		"#ffffff",
	];

	useEffect(() => {
		const image = new Image();
		image.crossOrigin = "Anonymous";
		image.src = imgUrl;
		image.onload = () => {
			const canvas = canvasRef.current;
			if (canvas) {
				const ctx = canvas.getContext("2d");
				if (ctx) {
					canvas.width = image.width;
					canvas.height = image.height;
					ctx.drawImage(image, 0, 0, image.width, image.height);

					const imageData = ctx.getImageData(0, 0, image.width, image.height);
					const { data, width, height } = imageData;

					const colorSet: Set<number> = new Set<number>();

					const puzzleRowArray: [number, number][][] = [];
					const puzzleColArray: [number, number][][] = Array.from(
						{ length: width },
						() => []
					);

					const prevColColor: number[] = new Array(width).fill(-1);
					const prevColColorCount: number[] = new Array(width).fill(0);

					const pixelArray: number[][][] = [];
					for (let y = 0; y < height; y++) {
						const rowColor: [number, number][] = [];
						let prevRowColor: number = -1;
						let prevRowColorCount: number = 0;
						const row: number[][] = [];
						for (let x = 0; x < width; x++) {
							const index = (y * width + x) * 4;
							const r = data[index];
							const g = data[index + 1];
							const b = data[index + 2];
							const a = data[index + 3];
							const colorNum = a === 0 ? -1 : r * 65536 + g * 256 + b;
							colorSet.add(colorNum);
							if (prevRowColor !== colorNum) {
								if (prevRowColor !== -1)
									rowColor.push([prevRowColor, prevRowColorCount]);
								prevRowColor = colorNum;
								prevRowColorCount = 1;
							} else prevRowColorCount++;

							if (prevColColor[x] !== colorNum) {
								if (prevColColor[x] !== -1)
									puzzleColArray[x].push([prevColColor[x], prevColColorCount[x]]);
								prevColColor[x] = colorNum;
								prevColColorCount[x] = 1;
							} else prevColColorCount[x]++;

							row.push([r, g, b, a]);
						}
						pixelArray.push(row);
						if (prevRowColor !== -1)
							rowColor.push([prevRowColor, prevRowColorCount]);
						puzzleRowArray.push(rowColor);
					}

					setPixelArray(pixelArray);
					setCanvasVisible(false);

					setPuzzleRow(puzzleRowArray);
					setPuzzleCol(puzzleColArray);

					const colorSetMap: Map<number, string> = new Map();
					let i = 0;
					colorSet.forEach((color) => {
						if (color !== -1) {
							colorSetMap.set(color, distinctColors[i]);
							i++;
						}
					});

					console.log(colorSetMap);
					setColorMap(colorSetMap);
				}
			}
		};
	}, []);

	return (
		<>
			<div>
				{isCanvasVisible && (
					<canvas ref={canvasRef} style={{ display: "none" }}></canvas>
				)}
			</div>
			<div className="puzzle-cols">
				{puzzleCol.map((colorCol, index) => {
					return (
						<div className="puzzle-col" key={index}>
							{colorCol.length !== 0 ? (
								colorCol.map((colorTimes, index) => {
									return (
										<div
											className={"cell"}
											style={{
												backgroundColor: colorMap?.get(colorTimes[0]),
											}}
											key={index}>
											<span>{colorTimes[1]}</span>
										</div>
									);
								})
							) : (
								<div
									className={"cell"}
									style={{ backgroundColor: "#000", color: "#fff" }}
									key={index}>
									<span>0</span>
								</div>
							)}
						</div>
					);
				})}
			</div>
			<div className="puzzle-rows">
				{puzzleRow.map((colorRow, index) => {
					return (
						<div className="puzzle-row" key={index}>
							{colorRow.length !== 0 ? (
								colorRow.map((colorTimes, index) => {
									return (
										<div
											className={"cell"}
											style={{
												backgroundColor: colorMap?.get(colorTimes[0]),
											}}
											key={index}>
											<span>{colorTimes[1]}</span>
										</div>
									);
								})
							) : (
								<div
									className={"cell"}
									style={{ backgroundColor: "#000", color: "#fff" }}
									key={index}>
									<span>0</span>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</>
	);
};

export default ImageToArray;

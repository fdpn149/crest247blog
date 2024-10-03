import { useEffect, useState } from "react";

export const useNonogramPuzzle = (imgUrl: string) => {
	const [pixelArray, setPixelArray] = useState<number[][][]>([]);
	const [puzzleRow, setPuzzleRow] = useState<[number, number][][]>([]);
	const [puzzleCol, setPuzzleCol] = useState<[number, number][][]>([]);
	const [colorMap, setColorMap] = useState<Map<number, string>>(
		new Map<number, string>()
	);

	const distinctColors = [
		"#e6194B",
		"#3cb44b",
		"#ffe119",
		"#4363d8",
		"#f58231",
		"#42d4f4",
		"#f032e6",
		"#fabed4",
		"#9A6324",
	];

	useEffect(() => {
		const image = new Image();
		image.crossOrigin = "Anonymous";
		image.src = imgUrl;
		image.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (ctx) {
				canvas.width = image.width;
				canvas.height = image.height;
				ctx.drawImage(image, 0, 0, image.width, image.height);

				const imageData = ctx.getImageData(0, 0, image.width, image.height);
				const { data, width, height } = imageData;

				const colorSet: Set<number> = new Set<number>();

				const puzzleRow_: [number, number][][] = [];
				const puzzleCol_: [number, number][][] = Array.from(
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
								puzzleCol_[x].push([prevColColor[x], prevColColorCount[x]]);
							prevColColor[x] = colorNum;
							prevColColorCount[x] = 1;
						} else prevColColorCount[x]++;

						row.push([r, g, b, a]);
					}
					pixelArray.push(row);
					if (prevRowColor !== -1) rowColor.push([prevRowColor, prevRowColorCount]);
					puzzleRow_.push(rowColor);
				}

				prevColColor.forEach((value, index) => {
					if (value !== -1)
						puzzleCol_[index].push([prevColColor[index], prevColColorCount[index]]);
				});

				setPixelArray(pixelArray);
				setPuzzleRow(puzzleRow_);
				setPuzzleCol(puzzleCol_);

				const colorMap_: Map<number, string> = new Map();
				let i = 0;
				colorSet.forEach((color) => {
					if (color !== -1) {
						colorMap_.set(color, distinctColors[i]);
						i++;
					}
				});

				// console.log(pixelArray);
				// console.log(puzzleRow_);
				setColorMap(colorMap_);
			}
		};
		return () => {};
	}, [imgUrl]);

	return { pixelArray, puzzleRow, puzzleCol, colorMap };
};

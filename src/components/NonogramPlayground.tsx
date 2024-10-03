import { FC, useEffect, useRef, useState } from "react";
import NonogramMouse from "./NonogramMouse";

interface Props {
	colorMap: Map<number, string>;
	onSelectChange: (newPos: [number, number]) => void;
}

const NonogramPlayground: FC<Props> = ({ colorMap, onSelectChange }) => {
	const playGridRef = useRef<HTMLDivElement>(null);
	const colorList = useRef<string[]>([]);

	const [cellColor, setCellColor] = useState<Map<string, string>>();
	const [nowColorIndex, setNowColorIndex] = useState(0);

	const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [colorCirVis, setColorCirVis] = useState(false);

	const [mouseState, setMouseState] = useState(-1);

	useEffect(() => {
		if (colorList.current) {
			const newColorList: string[] = [];
			colorMap.forEach((convColor) => {
				newColorList.push(convColor);
			});
			colorList.current = newColorList;
		}
	}, [colorMap]);

	useEffect(() => {
		const handleWheel = (event: WheelEvent) => {
			event.preventDefault();
			if (event.deltaY > 0) {
				setNowColorIndex((oldValue) => {
					const newValue = oldValue + 1;
					return newValue >= colorList.current.length ? 0 : newValue;
				});
			} else if (event.deltaY < 0) {
				setNowColorIndex((oldValue) => {
					const newValue = oldValue - 1;
					return newValue < 0 ? colorList.current.length - 1 : newValue;
				});
			}
		};
		const playGrid = playGridRef.current;
		if (playGrid) {
			playGrid.addEventListener("wheel", handleWheel, { passive: false });
			return () => {
				playGrid.removeEventListener("wheel", handleWheel);
			};
		}
	}, []);

	const drawCell = (button: number, key: string) => {
		switch (button) {
			case 0: {
				const newMap = new Map(cellColor);
				newMap.set(key, colorList.current[nowColorIndex]);
				setCellColor(newMap);
				break;
			}
			case 1: {
				const newColorMap = new Map(cellColor);
				newColorMap.set(key, "#000");
				setCellColor(newColorMap);
				break;
			}
			case 2:
				{
					const newMap = new Map(cellColor);
					newMap.set(key, "#fff");
					setCellColor(newMap);
				}
				break;
		}
	};

	const handleMouseMove = (event: React.MouseEvent, key: string) => {
		const { clientX, clientY } = event;
		setMousePos({ x: clientX, y: clientY });
		drawCell(mouseState, key);
	};

	const handleMouseDown = (event: React.MouseEvent, key: string) => {
		event.preventDefault();
		setMouseState(event.button);
		drawCell(event.button, key);
	};

	const handleMouseUp = (_: React.MouseEvent) => {
		setMouseState(-1);
	};

	return (
		<div
			className="play-grid"
			ref={playGridRef}
			onMouseEnter={() => {
				setColorCirVis(true);
			}}
			onMouseLeave={() => {
				setColorCirVis(false);
			}}>
			<NonogramMouse
				mousePos={mousePos}
				colorCirVis={colorCirVis}
				colorList={colorList.current}
				nowColorIndex={nowColorIndex}
			/>
			{Array(16)
				.fill(0)
				.map((_, row) =>
					Array(16)
						.fill(0)
						.map((_, col) => {
							const key = `${row}-${col}`;
							return (
								<div
									className="cell"
									key={key}
									style={{
										backgroundColor: cellColor?.get(key),
									}}
									onMouseEnter={() => {
										onSelectChange([row, col]);
									}}
									onMouseLeave={() => {
										onSelectChange([-1, -1]);
									}}
									onMouseDown={(event: React.MouseEvent) => {
										handleMouseDown(event, key);
									}}
									onMouseUp={handleMouseUp}
									onMouseMove={(event: React.MouseEvent) => {
										handleMouseMove(event, key);
									}}
									onContextMenu={(e: React.MouseEvent) => {
										e.preventDefault();
									}}></div>
							);
						})
				)}
		</div>
	);
};

export default NonogramPlayground;

import { FC, useState } from "react";
import "./NonogramDisplay.css";
import NonogramPlayground from "./NonogramPlayground";
import NonogramPuzzle from "./NonogramPuzzle";

interface NonogramDisplayProps {
	puzzleRow: [number, number][][];
	puzzleCol: [number, number][][];
	colorMap: Map<number, string>;
}

const NonogramDisplay: FC<NonogramDisplayProps> = ({
	puzzleRow,
	puzzleCol,
	colorMap,
}) => {
	const [selectedPos, setSelectedPos] = useState<[number, number]>([-1, -1]);

	const handleSelectChange = (newPos: [number, number]) => {
		setSelectedPos(newPos)
	}

	return (
		<div className="game">
			<ul style={{ display: "flex", flexDirection: "column", justifyContent:"space-evenly" }}>
				<li>使用滑鼠於遊玩區域點擊<b>左鍵</b>或拖曳即可<b>上色</b></li>
				<li>使用滑鼠於遊玩區域點擊<b>右鍵</b>或拖曳即可<b>將顏色清除</b></li>
				<li>使用滑鼠於遊玩區域點擊<b>中鍵</b>或拖曳即可<b>將該格標記為無色</b></li>
				<li>使用滑鼠於遊玩區域滾動<b>滾輪</b>即可<b>更換顏色</b></li>
			</ul>
			<NonogramPuzzle puzzle={puzzleCol} colorMap={colorMap} type="col" selectedPos={selectedPos} />
			<NonogramPuzzle puzzle={puzzleRow} colorMap={colorMap} type="row" selectedPos={selectedPos} />
			<NonogramPlayground colorMap={colorMap} onSelectChange={handleSelectChange} />
		</div>
	);
};

export default NonogramDisplay;

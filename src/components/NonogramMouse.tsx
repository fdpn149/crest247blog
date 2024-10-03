import { FC } from "react";

interface Props {
	mousePos: { x: number; y: number };
	colorCirVis: boolean;
	colorList: string[];
	nowColorIndex: number;
}

const NonogramMouse: FC<Props> = ({
	mousePos,
	colorCirVis,
	colorList,
	nowColorIndex,
}) => {
	const colorCirStyle: React.CSSProperties = {
		position: "fixed",
		width: "20px",
		height: "20px",
		backgroundColor: colorList[nowColorIndex],
		borderRadius: "50%",
		left: `${mousePos.x - 0}px`, // 圓形的中心點要對齊滑鼠位置
		top: `${mousePos.y + 20}px`, // 圓形的中心點要對齊滑鼠位置
		visibility: colorCirVis ? "visible" : "hidden",
		border: "1px solid #000",
		boxShadow: "1px 1px 3px black",
	};
	return <div style={colorCirStyle}></div>;
};

export default NonogramMouse;

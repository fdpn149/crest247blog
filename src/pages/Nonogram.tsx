import { useNonogramImg } from "../hooks/useNonogramImg";
import { useNonogramPuzzle } from "../hooks/useNonogramPuzzle";
import NonogramDisplay from "../components/NonogramDisplay";

function Nonogram() {
	const { puzzleImgUrl } = useNonogramImg();
	const { puzzleRow, puzzleCol, colorMap } =
		useNonogramPuzzle(puzzleImgUrl);

	return (
		<>
			{/* {puzzleImg} */}
			<NonogramDisplay
				puzzleRow={puzzleRow}
				puzzleCol={puzzleCol}
				colorMap={colorMap}
			/>
		</>
	);
}

export default Nonogram;

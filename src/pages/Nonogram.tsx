import { useEffect, useState } from "react";
import "./Nonogram.css";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import firebase from "../utils/firebase";
import GetPixelColor from "../components/NonogramPuzzle";

function Nonogram() {
	const [cellColor, setCellColor] = useState<Map<string,string>>();
	const [puzzleImg, setPuzzleImg] = useState("");
	const [puzzleUrl, setPuzzleUrl] = useState("");

	useEffect(() => {
		firebase
			.storage()
			.ref("/images/Nonogram")
			.listAll()
			.then((res) => {
				const puzzles = res.items.map((itemRef) => {
					return itemRef.name;
				});
				const index = Math.floor(Math.random() * puzzles.length);
				const puzzle = puzzles[index];
				firebase
					.storage()
					.ref(`/images/Nonogram/${puzzle}`)
					.getDownloadURL()
					.then((url) => {
						console.log(url);
						setPuzzleUrl(url);
					});
				setPuzzleImg(puzzle);
			});
	}, []);

	return (
		<>
			{puzzleImg}
			<div className="game">
				{puzzleUrl ? <GetPixelColor imgUrl={puzzleUrl} /> : <div></div>}
				<div className="play-grid">
					{Array(16)
						.fill(0)
						.map((_, rowY) =>
							Array(16)
								.fill(0)
								.map((_, colX) => {
									return (
										<div
											className="cell"
											style={{
												backgroundColor: cellColor?.get(`${colX}-${rowY}`),
											}}
											key={`${colX}-${rowY}`}
											onClick={() => {
												setCellColor((prevColors) => ({
													...prevColors!,
													[`${colX}-${rowY}`]:
														prevColors?.get(`${colX}-${rowY}`) === "red"
															? undefined
															: "red", // 点击时在红色和蓝色之间切换
												}));
											}}
										/>
									);
								})
						)}
				</div>
			</div>
		</>
	);
}

export default Nonogram;

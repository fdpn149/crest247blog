import "firebase/compat/storage";
import "firebase/compat/firestore";
import firebase from "../utils/firebase";
import { useEffect, useState } from "react";

export const useNonogramImg = () => {
	const [puzzleImg, setPuzzleImg] = useState("");
	const [puzzleImgUrl, setPuzzleImgUrl] = useState("");

	useEffect(() => {
		firebase
			.storage()
			.ref("/images/Minecraft")
			.listAll()
			.then((res) => {
				const puzzles = res.items.map((itemRef) => {
					return itemRef.name;
				});
				const index = Math.floor(Math.random() * puzzles.length);
				const puzzle = puzzles[index];
				firebase
					.storage()
					.ref(`/images/Minecraft/${puzzle}`)
					.getDownloadURL()
					.then((url) => {
						setPuzzleImgUrl(url);
					});
				setPuzzleImg(puzzle);
			});
	}, []);

	return { puzzleImg, puzzleImgUrl };
};

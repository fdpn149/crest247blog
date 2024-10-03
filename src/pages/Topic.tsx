import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import firebase from "../utils/firebase";
import "firebase/compat/firestore";
import Card from "../components/Card";

const Topic: FC = () => {
	const location = useLocation();
	const basepath = decodeURIComponent(location.pathname).substring(6);

	const paths = basepath.split("/").filter(Boolean);
	let storePath = "";
	for (let i = 0; i < paths.length; i++) storePath += /topics/ + paths[i];

	const [cards, setCards] = useState<
		{ title: string; image: string; type: string }[]
	>([]);

	useEffect(() => {
		async function func() {
			let cardArray: { title: string; image: string; type: string }[] = [];

			const postCollectSnap = await firebase
				.firestore()
				.collection(`${storePath}/posts`)
				.get();

			const postData = postCollectSnap.docs.map((docSnapshot) => {
				const title = docSnapshot.id;
				const image = docSnapshot.data()["icon"];
				const type = "post";
				return { title, image, type };
			});
			cardArray.push(...postData);

			const topicCollectSnap = await firebase
				.firestore()
				.collection(`${storePath}/topics`)
				.get();

			const topicData = topicCollectSnap.docs.map((docSnapshot) => {
				const title = docSnapshot.id;
				const image = docSnapshot.data()["icon"];
				const type = "topic";
				return { title, image, type };
			});
			cardArray.push(...topicData);

			setCards(cardArray);
		}
		func();
	}, [storePath]);

	return (
		<div className="card-container">
			{cards
				.sort((a, b) => {
					if (a.title > b.title) return 1;
					else if (a.title < b.title) return -1;
					return 0;
				})
				.map((card, index) => (
					<Card
						key={index}
						title={card.title}
						description={""}
						image={card.image}
						route={
							card.type === "post"
								? `/post${basepath}/${card.title}`
								: `/topic${basepath}/${card.title}`
						}
					/>
				))}
		</div>
	);
};

export default Topic;

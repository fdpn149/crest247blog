import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "../utils/firebase";
import "firebase/compat/firestore";
import Card from "../components/Card";

const Topic: FC = () => {
	const { topicID } = useParams();
	const [cards, setCards] = useState<{ title: string, image: string, type: string}[]>([]);

	useEffect(() => {
		async function func() {
			let cardArray: { title: string, image: string, type: string }[] = [];

			await firebase
				.firestore()
				.collection(`/topics/${topicID}/posts`)
				.get()
				.then((collectionSnapshot) => {
					const data = collectionSnapshot.docs.map((docSnapshot) => {
						const title = docSnapshot.id;
						const image = docSnapshot.data()["icon"];
						const type = "post";
						return { title, image, type };
					});
					cardArray.push(...data);
				});
			await firebase
				.firestore()
				.collection(`/topics/${topicID}/topics`)
				.get()
				.then((collectionSnapshot) => {
					const data = collectionSnapshot.docs.map((docSnapshot) => {
						const title = docSnapshot.id;
						const image = docSnapshot.data()["icon"];
						const type = "topic";
						return { title, image, type };
					});
					cardArray.push(...data);
				});

			await setCards(cardArray);
		}
		func();
	}, []);

	console.log(topicID)
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
						route={card.type === "post" ? `/post/${topicID}/${card.title}` : `/topic/${topicID}/${card.title}`}
					/>
				))}
		</div>
	);
};

export default Topic;

import { useEffect, useState } from 'react';
import firebase from '../utils/firebase';
import 'firebase/compat/firestore';

import Card from '../components/Card';
import './Home.css';
import { TitleComponent } from '../components/TitleText';

const Home: React.FC = () => {
	const [topics, setTopics] = useState<{ title: string; image: string }[]>([]);

	useEffect(() => {
		firebase
			.firestore()
			.collection('/topics')
			.get()
			.then((collectionSnapshot) => {
				const data = collectionSnapshot.docs.map((docSnapshot) => {
					const title = docSnapshot.id;
					const image = docSnapshot.data()['icon'];
					return { title, image };
				});
				setTopics(data);
			});
	}, []);

	return (
		<>
			<TitleComponent />
			<div className="card-container">
				{topics.map((topic, index) => (
					<Card
						key={index}
						title={topic.title}
						description={''}
						image={topic.image}
						route={`/topic/${topic.title}`}
					/>
				))}
			</div>
		</>
	);
};

export default Home;

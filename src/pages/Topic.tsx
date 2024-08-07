import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import firebase from '../utils/firebase';
import 'firebase/compat/firestore';
import Card from '../components/Card';

const Topic: FC = () => {
	const { topicID } = useParams();
	const [posts, setPosts] = useState<{ title: string; image: string }[]>([]);

	useEffect(() => {
		firebase
			.firestore()
			.collection(`/topics/${topicID}/posts`)
			.get()
			.then((collectionSnapshot) => {
				const data = collectionSnapshot.docs.map((docSnapshot) => {
					const title = docSnapshot.id;
					const image = docSnapshot.data()['icon'];
					return { title, image };
				});
				setPosts(data);
			});
	}, []);

	return <div className="card-container">
    {posts.map((post, index) => (
        <Card
            key={index}
            title={post.title}
            description={''}
            image={post.image}
            route={`/post/${topicID}/${post.title}`}
        />
    ))}
</div>;
};

export default Topic;

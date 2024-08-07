import { FC, useEffect, useState } from 'react';
import firebase from '../utils/firebase';
import 'firebase/compat/firestore';
import PostView from '../components/PostView';
import { useParams } from 'react-router-dom';

import "./Post.css"

const Post: FC = () => {
	const { topicID, postID } = useParams();
	const [content, setContent] = useState<JSX.Element>(<></>);

	useEffect(() => {
		firebase
			.firestore()
			.collection(`/topics/${topicID}/posts`)
			.doc(postID)
			.onSnapshot((docSnapshot) => {
				const doc_data = docSnapshot.data();
				if (doc_data !== undefined) {
					const data = doc_data['content'];
					let json: Array<any> = JSON.parse(data);
					let result = <PostView json={json} />;
					setContent(result);
				}
			});
	}, []);

	return <div className="post-container">{content}</div>;
};

export default Post;

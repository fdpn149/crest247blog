import { FC, useEffect, useState } from "react";
import firebase from "../utils/firebase";
import "firebase/compat/firestore";
import PostView from "../components/PostView";

import "./Post.css";
import { useLocation } from "react-router-dom";

const Post: FC = () => {
	const location = useLocation();
	const basepath = decodeURIComponent(location.pathname).substring(5);

	const paths = basepath.split("/").filter(Boolean);
	let storePath = "";
	for (let i = 0; i < paths.length - 1; i++) storePath += "/topics/" + paths[i];
	storePath += "/posts/";

	const [content, setContent] = useState<JSX.Element>(<></>);

	useEffect(() => {
		firebase
			.firestore()
			.collection(storePath)
			.doc(paths[paths.length - 1])
			.onSnapshot((docSnapshot) => {
				const doc_data = docSnapshot.data();
				if (doc_data !== undefined) {
					const data = doc_data["content"];
					let json: Array<any> = JSON.parse(data);
					let result = <PostView json={json} />;
					setContent(result);
				}
			});
	}, [storePath]);

	return <div className="post-container">{content}</div>;
};

export default Post;

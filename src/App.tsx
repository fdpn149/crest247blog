import { FunctionComponent, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import firebase from './utils/firebase';
import 'firebase/compat/auth';

import Header from './components/Header';
import Home from './pages/Home';
import Account from './utils/Account';
import Topic from './pages/Topic';
import Post from './pages/Post';
import { useTheme } from './utils/useTheme';

const App: FunctionComponent = () => {
	let account = new Account();

	useEffect(() => {
		firebase
			.auth()
			.signInWithEmailAndPassword(account.user, account.password)
			.catch((error) => {
				console.error(error);
			})
			.then(() => {});
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/*"
					element={
						<>
							<Header />
							<Routes>
								<Route
									path="/topic/*"
									element={
										<Routes>
											<Route path=":topicID" element={<Topic />} />
										</Routes>
									}
								/>
								<Route
									path="/post/*"
									element={
										<Routes>
											<Route
												path=":topicID/:postID"
												element={<Post/>}
											/>
										</Routes>
									}
								/>
							</Routes>
						</>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default App;

import { FC } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header: FC = () => {
	const navigate = useNavigate();

	return (
		<header className="header">
			<h1
				className="title"
				onClick={() => {
					navigate('/');
				}}>
				波峰的小棧
			</h1>
			<nav className="nav">
				<button className="nav-button">按鈕一</button>
				<button className="nav-button">按鈕二</button>
				<button className="nav-button">按鈕三</button>
			</nav>
		</header>
	);
};

export default Header;

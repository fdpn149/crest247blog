import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import './Card.css';

interface Props {
	title: string;
	description: string;
	image: string;
	route: string;
}

const Card: FC<Props> = ({ title, description, image, route }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(route);
	};

	return (
		<div className="card-item" onClick={handleClick}>
			<img className="card-img" src={image} alt="" />
			<h2>{title}</h2>
			<p>{description}</p>
		</div>
	);
};

export default Card;

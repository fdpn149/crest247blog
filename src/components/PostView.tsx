import { FC, Fragment, ReactNode } from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import {
	tomorrow,
	tomorrowNight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import "./PostView.css";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "../utils/useTheme";

interface Props {
	json: Array<any>;
}

const PostView: FC<Props> = ({ json }) => {
	const colorScheme = useTheme();

	let parseMap: { [type: string]: any } = {
		h1: parseH1,
		h2: parseH2,
		h3: parseH3,
		ul: parseUl,
		li: parseLi,
		script: parseScript,
		img: parseImg,
		split: parseSplit,
	};

	function parse(arr: Array<any>) {
		let result: ReactNode[] = [];
		arr.forEach((element, index) => {
			result.push(
				<Fragment key={index}>
					{parseElement(element["type"], element["value"])}
				</Fragment>
			);
		});
		return result;
	}

	function parseElement(type: string, value: any) {
		return parseMap[type](value) ?? null;
	}

	function parseString(str: string) {
		let result: Array<any> = [];
		let captured = "";
		let mode = "_";
		for (let i = 0; i < str.length; i++) {
			switch (mode) {
				case "_":
					if (str[i] === "$") {
						mode = "$";
						captured += str[i];
					} else if (str[i] === "`") {
						mode = "`";
						result.push(captured);
						captured = "";
					} else captured += str[i];
					break;
				case "$":
					if (str[i] === "$") {
						mode = "$$";
						result.push(captured.substring(0, captured.length - 1));
						captured = "";
					} else if (str[i] === "`") {
						mode = "`";
						result.push(captured);
						captured = "";
					} else {
						mode = "_";
						captured += str[i];
					}
					break;
				case "$$":
					if (str[i] === "$") {
						mode = "$$$";
						captured += str[i];
					} else {
						captured += str[i];
					}
					break;
				case "$$$":
					if (str[i] === "$") {
						mode = "_";
						result.push(
							<InlineMath
								key={i}
								math={captured.substring(0, captured.length - 1)}
							/>
						);
						captured = "";
					} else {
						mode = "$$";
						captured += str[i];
					}
					break;
				case "`":
					if (str[i] === "`") {
						mode = "_";
						result.push(<code key={i}>{captured}</code>);
						captured = "";
					} else {
						captured += str[i];
					}
					break;
			}
		}
		result.push(captured);
		return result;
	}

	function parseH1(value: string) {
		return (
			<>
				<h1>{parseString(value)}</h1>
				<hr />
			</>
		);
	}
	function parseH2(value: string) {
		return <h2>{parseString(value)}</h2>;
	}
	function parseH3(value: string) {
		return <h3>{parseString(value)}</h3>;
	}

	function parseUl(arr: Array<string>) {
		return <ul>{parse(arr)}</ul>;
	}

	function parseLi(value: string | Array<any>) {
		if (typeof value === "string") {
			return <li>{parseString(value)}</li>;
		} else if (Array.isArray(value)) {
			let arr: Array<any> = [...value.slice(1)];
			return (
				<li>
					{parseString(value[0])}
					{parse(arr)}
				</li>
			);
		}
	}

	function parseScript(arr: Array<string>) {
		let type: string = arr[0];
		let script: string = arr[1];
		return (
			<SyntaxHighlighter
				language={type}
				style={colorScheme === "dark" ? tomorrowNight : tomorrow}
				className="codeBlock">
				{script}
			</SyntaxHighlighter>
		);
	}

	function parseImg(value: string) {
		return <img src={value} style={{ maxWidth: "100%", width: "90vw" }} />;
	}

	function parseSplit(arr: Array<any>) {
		const gridItems = [];
		for (let i = 0; i < arr.length; i += 2) {
			gridItems.push(
				<Fragment key={i}>
					<Col xs={12} md={arr[i]}>
						{parse([arr[i + 1]])}
					</Col>
				</Fragment>
			);
		}
		return <Row>{gridItems}</Row>;
	}

	return <>{parse(json)}</>;
};

export default PostView;

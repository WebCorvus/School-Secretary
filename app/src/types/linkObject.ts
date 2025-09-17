import { title } from "process";

export interface LinkObjectProps {
	title: string;
	url: string;
}

export const FakeLinkObject: LinkObjectProps = {
	title: "Test link object",
	url: "https://testurl.com",
};

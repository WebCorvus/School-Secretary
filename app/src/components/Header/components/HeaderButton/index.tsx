import Link from "next/link";
import Image from "next/image";
import type { ReactElement } from "react";

interface HeaderButtonProps {
	url: string;
	icon: string;
	mensage?: string;
	alt: string;
}

export default function HeaderButton({
	url,
	icon,
	mensage,
	alt,
}: HeaderButtonProps): ReactElement {
	return (
		<Link href={url}>
			<div className="flex flex-row gap-1">
				<Image src={icon} alt={alt} width={24} height={24} />
				{mensage && <p>{mensage}</p>}
			</div>
		</Link>
	);
}

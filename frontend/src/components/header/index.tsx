import Link from "next/link";

export default function Header() {
	return (
		<div className="">
			<ul className="p-1.5">
				<li>
					<Link className="btn btn-normal" href="/">
						Início
					</Link>

					<Link className="btn btn-normal" href="/students">
						Estudantes
					</Link>
				</li>
			</ul>
		</div>
	);
}

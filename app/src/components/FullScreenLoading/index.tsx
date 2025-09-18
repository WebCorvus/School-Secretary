"use client";

import { Spinner } from "@/components/ui/spinner";

export function FullScreenLoading() {
	return (
		<div className="absolute inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
			<div className="flex flex-col items-center space-y-4">
				<Spinner variant="ellipsis" />
				<p className="text-muted-foreground">Carregando...</p>
			</div>
		</div>
	);
}

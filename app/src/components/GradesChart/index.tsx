"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Legend } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartConfig,
} from "@/components/ui/chart";

import { GradesByYear } from "@/types/student";
import { GradeProps } from "@/types/grade";

interface GradesChartProps {
	grades: GradesByYear[];
	baseColor?: string;
}

export function GradesChart({
	grades,
	baseColor = "59, 130, 246",
}: GradesChartProps) {
	const subjects = Array.from(
		new Set(grades.flatMap((y) => y.grades.map((g) => g.subject.full_name)))
	);

	const data = subjects.map((subjectName) => {
		const item: Record<string, string | number> = { subject: subjectName };
		grades.forEach((yearGroup) => {
			const grade = yearGroup.grades.find(
				(g: GradeProps) => g.subject.full_name === subjectName
			);
			item[yearGroup.year] = grade ? grade.value : 0;
		});
		return item;
	});

	const chartConfig: ChartConfig = {};
	grades.forEach((yearGroup, index) => {
		const opacity = 0.4 + (index / grades.length) * 0.5;
		chartConfig[yearGroup.year] = {
			label: `${yearGroup.year}`,
			color: `rgba(${baseColor}, ${opacity})`,
		};
	});

	return (
		<Card>
			<CardHeader className="items-center pb-4">
				<CardTitle>Notas por Matéria</CardTitle>
				<CardDescription>
					Radar chart mostrando notas por ano
				</CardDescription>
			</CardHeader>
			<CardContent className="pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<RadarChart
						data={data}
						margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
					>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<PolarAngleAxis dataKey="subject" />
						<PolarGrid />
						{grades.map((yearGroup) => (
							<Radar
								key={yearGroup.year}
								dataKey={yearGroup.year}
								name={`${yearGroup.year}`}
								stroke={chartConfig[yearGroup.year].color}
								fill={chartConfig[yearGroup.year].color}
								fillOpacity={0.6}
							/>
						))}
						<Legend />
					</RadarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex items-center gap-2 leading-none font-medium">
					Trending up by 5.2% this month{" "}
					<TrendingUp className="h-4 w-4" />
				</div>
				<div className="text-muted-foreground flex items-center gap-2 leading-none">
					Anos disponíveis
				</div>
			</CardFooter>
		</Card>
	);
}

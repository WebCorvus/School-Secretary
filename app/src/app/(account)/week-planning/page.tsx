'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { FullScreenError } from '@/components/FullScreenError'
import { FullScreenLoading } from '@/components/FullScreenLoading'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Textarea } from '@/components/ui/textarea'
import { useGroups } from '@/hooks/useGroup'
import { useLessons } from '@/hooks/useLesson'
import { useUser } from '@/hooks/useUser'
import { useWeeklyLessonPlans } from '@/hooks/useWeeklyLessonPlan'
import type { LessonProps } from '@/types/lesson'
import type {
    WeeklyLessonPlanPostProps,
    WeeklyLessonPlanProps,
} from '@/types/weeklyLessonPlan'

const DAY_OPTIONS = [
    { id: 0, label: 'Domingo' },
    { id: 1, label: 'Segunda-feira' },
    { id: 2, label: 'Terça-feira' },
    { id: 3, label: 'Quarta-feira' },
    { id: 4, label: 'Quinta-feira' },
    { id: 5, label: 'Sexta-feira' },
    { id: 6, label: 'Sábado' },
]

export default function WeekPlanningPage() {
    const [selectedGroup, setSelectedGroup] = useState<number>()
    const [selectedWeek, setSelectedWeek] = useState<string>(
        getThisWeekStartDate(),
    )
    const [lessonPlans, setLessonPlans] = useState<
        Record<number, WeeklyLessonPlanProps>
    >({})
    const [lessons, setLessons] = useState<LessonProps[]>([])

    const { data: userInfo, loading: loadingUser } = useUser()
    const { groups, loading: loadingGroups, error: errorGroups } = useGroups()
    const { data: allLessons, loading: loadingLessons } = useLessons()
    const {
        data: weeklyPlans,
        loading: loadingPlans,
        createWeeklyLessonPlan,
        updateWeeklyLessonPlan,
        refetch,
    } = useWeeklyLessonPlans()

    // Filter lessons by selected group and current professor
    useEffect(() => {
        if (selectedGroup && allLessons && userInfo?.profile_details) {
            // Type guard to check if profile_details is ProfessorProps
            let professorId: number | undefined
            // For professor role, use the id from profile_details
            const profile = userInfo.profile_details
            if (userInfo.role === 'PROFESSOR' && 'id' in profile) {
                professorId = (profile as { id: number }).id
            }

            if (professorId) {
                const filteredLessons = allLessons.filter(
                    (lesson) =>
                        lesson.group === selectedGroup &&
                        lesson.professor === professorId,
                )
                setLessons(filteredLessons)
            }
        } else {
            setLessons([])
        }
    }, [selectedGroup, allLessons, userInfo])

    // Load existing planning data when week and group are selected
    // The backend already filters by current professor, so we just filter by group and week
    useEffect(() => {
        if (selectedGroup && selectedWeek && weeklyPlans) {
            // Filter weekly plans for the selected group and week
            const weekPlans = weeklyPlans.filter(
                (plan) =>
                    plan.lesson_details?.group === selectedGroup &&
                    plan.week_start_date === selectedWeek,
            )

            // Convert the filtered plans to the format we use in state
            const newLessonPlans: Record<number, WeeklyLessonPlanProps> = {}
            weekPlans.forEach((plan) => {
                if (plan.lesson) {
                    newLessonPlans[plan.lesson] = plan
                }
            })

            setLessonPlans(newLessonPlans)
        }
    }, [selectedGroup, selectedWeek, weeklyPlans])

    function getDayLabel(day: number) {
        return DAY_OPTIONS.find((opt) => opt.id === day)?.label || ''
    }

    function getThisWeekStartDate(): string {
        // Calculate the start of the current week (Monday)
        const today = new Date()
        const dayOfWeek = today.getDay() // 0 (Sunday) to 6 (Saturday)
        // Adjust to get Monday (day 1): if Sunday (0), go back 6 days; otherwise go back (day - 1) days
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
        const monday = new Date(today.setDate(diff))
        return monday.toISOString().split('T')[0]
    }

    const handleGroupChange = (value?: number) => {
        setSelectedGroup(value)
    }

    const handleWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedWeek(e.target.value)
    }

    const handlePlanChange = (
        lessonId: number,
        field: keyof WeeklyLessonPlanPostProps,
        value: string,
    ) => {
        if (!userInfo?.profile_details) {
            toast.error('Informações do professor não carregadas.')
            return
        }

        let professorId: number | undefined
        const profile = userInfo.profile_details
        if (userInfo.role === 'PROFESSOR' && 'id' in profile) {
            professorId = (profile as { id: number }).id
        }

        if (!professorId) {
            toast.error('Não foi possível identificar o professor.')
            return
        }

        setLessonPlans((prev) => {
            const existingPlan = prev[lessonId]

            if (existingPlan) {
                // Update existing plan
                return {
                    ...prev,
                    [lessonId]: {
                        ...existingPlan,
                        [field]: value,
                    },
                }
            } else {
                // Create new plan
                return {
                    ...prev,
                    [lessonId]: {
                        id: -1, // temporary ID
                        professor: professorId,
                        lesson: lessonId,
                        week_start_date: selectedWeek,
                        planning_content:
                            field === 'planning_content' ? value : '',
                        objectives: field === 'objectives' ? value : '',
                        resources_needed:
                            field === 'resources_needed' ? value : '',
                        notes: field === 'notes' ? value : '',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    } as unknown as WeeklyLessonPlanProps,
                }
            }
        })
    }

    const handleSave = async () => {
        if (!userInfo?.profile_details) {
            toast.error('Informações do professor não carregadas.')
            return
        }

        let professorId: number | undefined
        const profile = userInfo.profile_details
        if (userInfo.role === 'PROFESSOR' && 'id' in profile) {
            professorId = (profile as { id: number }).id
        }

        if (!professorId) {
            toast.error('Não foi possível identificar o professor.')
            return
        }

        try {
            for (const [lessonId, plan] of Object.entries(lessonPlans)) {
                const _lessonIdNum = parseInt(lessonId, 10)

                // Prepare the plan data for API call
                const planData: WeeklyLessonPlanPostProps = {
                    professor: professorId,
                    lesson: plan.lesson,
                    week_start_date: selectedWeek,
                    planning_content: plan.planning_content,
                    objectives: plan.objectives || '',
                    resources_needed: plan.resources_needed || '',
                    notes: plan.notes || '',
                }

                if (plan.id === -1 || !plan.id) {
                    // Create new plan
                    await createWeeklyLessonPlan(planData)
                } else {
                    // Update existing plan
                    await updateWeeklyLessonPlan(plan.id, planData)
                }
            }

            toast.success('Planejamento salvo com sucesso!')
            refetch() // Refresh data after saving
        } catch (error) {
            console.error('Error saving planning:', error)
            toast.error('Erro ao salvar o planejamento. Tente novamente.')
        }
    }

    if (loadingUser || loadingGroups || loadingLessons || loadingPlans)
        return <FullScreenLoading />

    if (errorGroups) return <FullScreenError error={errorGroups} />

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="p-6">
                    <CardTitle>Planejamento Semanal</CardTitle>
                    <CardDescription className="pt-2">
                        Selecione uma turma e a semana para planejar suas aulas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="space-y-2 w-full">
                            <Label htmlFor="group">Turma</Label>
                            <select
                                id="group"
                                value={selectedGroup || ''}
                                onChange={(e) =>
                                    handleGroupChange(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : undefined,
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            >
                                <option value="">Selecione uma turma</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2 w-full">
                            <Label htmlFor="week-start">Semana de</Label>
                            <Input
                                id="week-start"
                                type="date"
                                value={selectedWeek}
                                onChange={handleWeekChange}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {selectedGroup && lessons.length > 0 ? (
                        <div className="space-y-6">
                            {lessons
                                .filter(
                                    (lesson) =>
                                        lesson.day !== undefined &&
                                        lesson.day >= 0 &&
                                        lesson.day <= 6,
                                ) // All days of the week
                                .sort((a, b) => a.day - b.day)
                                .map((lesson) => {
                                    if (lesson.day === undefined) return null

                                    const plan =
                                        lessonPlans[lesson.id] ||
                                        ({
                                            planning_content: '',
                                            objectives: '',
                                            resources_needed: '',
                                            notes: '',
                                        } as WeeklyLessonPlanProps)

                                    return (
                                        <Card key={lesson.id}>
                                            <CardHeader className="p-4 pb-2">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                    <div>
                                                        <CardTitle className="text-lg">
                                                            {getDayLabel(
                                                                lesson.day,
                                                            )}{' '}
                                                            -{' '}
                                                            {
                                                                lesson
                                                                    .subject_details
                                                                    ?.full_name
                                                            }
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Horário:{' '}
                                                            {lesson.time}º
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4 p-4">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`planning-${lesson.id}`}
                                                    >
                                                        Planejamento da Aula
                                                    </Label>
                                                    <Textarea
                                                        id={`planning-${lesson.id}`}
                                                        value={
                                                            plan.planning_content ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            handlePlanChange(
                                                                lesson.id,
                                                                'planning_content',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Descreva o conteúdo e atividades planejadas para esta aula..."
                                                        className="min-h-[100px] p-3"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`objectives-${lesson.id}`}
                                                    >
                                                        Objetivos
                                                    </Label>
                                                    <Textarea
                                                        id={`objectives-${lesson.id}`}
                                                        value={
                                                            plan.objectives ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            handlePlanChange(
                                                                lesson.id,
                                                                'objectives',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Quais são os objetivos de aprendizagem desta aula?"
                                                        className="min-h-[100px] p-3"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`resources-${lesson.id}`}
                                                    >
                                                        Recursos Necessários
                                                    </Label>
                                                    <Textarea
                                                        id={`resources-${lesson.id}`}
                                                        value={
                                                            plan.resources_needed ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            handlePlanChange(
                                                                lesson.id,
                                                                'resources_needed',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Quais materiais ou recursos serão necessários?"
                                                        className="min-h-[100px] p-3"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`notes-${lesson.id}`}
                                                    >
                                                        Observações
                                                    </Label>
                                                    <Textarea
                                                        id={`notes-${lesson.id}`}
                                                        value={plan.notes || ''}
                                                        onChange={(e) =>
                                                            handlePlanChange(
                                                                lesson.id,
                                                                'notes',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Outras observações importantes..."
                                                        className="min-h-[100px] p-3"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                        </div>
                    ) : selectedGroup ? (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground">
                                    Nenhuma aula encontrada para esta turma.
                                </p>
                            </CardContent>
                        </Card>
                    ) : null}

                    {selectedGroup && (
                        <div className="flex justify-end">
                            <Button onClick={handleSave}>
                                Salvar Planejamento
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

import { useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
    format,
    getDay,
    parse,
    startOfWeek,
    addMonths,
    subMonths,
} from "date-fns";
import { ptBR, Locale } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import { Button } from "@/components/ui/button";

import { EventCard } from "./event-card";

import { Task } from "../types";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";

const locales = {
    "pt-BR": ptBR,
};

interface LocalizerConfig {
    format: (date: Date, formatStr: string) => string;
    parse: typeof parse;
    startOfWeek: () => Date;
    getDay: typeof getDay;
    locales: Record<string, Locale>;
}

const localizer = dateFnsLocalizer({
    format: (date: Date, formatStr: string) => format(date, formatStr, { locale: ptBR }),
    parse,
    startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
    getDay,
    locales,
} as LocalizerConfig);

interface DataCalendarProps {
    data: Task[];
};

interface CustomToolbarProps {
    date: Date;
    onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
};

const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
    return (
        <div className="flex mb-4 gap-x-2 items-center justify-center w-full lg:w-auto lg:justify-start capitalize">
            <Button
                onClick={() => onNavigate("PREV")}
                variant="secondary"
                size="icon"
            >
                <ChevronLeftIcon className="size-4" />
            </Button>
            <div className="flex items-center justify-center border border-input rounded-md px-3 py-2 h-8 w-full lg:w-[200px]">
                <CalendarIcon className="size-4 mr-2" />
                <p className="text-sm">{format(date, "MMMM yyyy", { locale: ptBR })}</p>
            </div>
            <Button
                onClick={() => onNavigate("NEXT")}
                variant="secondary"
                size="icon"
            >
                <ChevronRightIcon className="size-4" />
            </Button>
        </div>
    )
}

export const DataCalendar = ({
    data,
}: DataCalendarProps) => {
    const [value, setValue] = useState(new Date());

    const events = data.map((task) => ({
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        title: task.name,
        project: task.project,
        assignee: task.assignee,
        status: task.status,
        id: task.$id,
    }));

    const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
        if (action === "PREV") {
            setValue(subMonths(value, 1));
        } else if (action === "NEXT") {
            setValue(addMonths(value, 1));
        } else if (action === "TODAY") {
            setValue(new Date());
        }
    };

    return (
        <Calendar 
            localizer={localizer}
            date={value}
            events={events}
            views={["month"]}
            defaultView="month"
            toolbar
            showAllEvents
            className="h-full"
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
            formats={{
                weekdayFormat: (date) => format(date, "EEEE", { locale: ptBR }).charAt(0).toUpperCase() + format(date, "EEEE", { locale: ptBR }).slice(1),
                monthHeaderFormat: (date) => format(date, "MMMM yyyy", { locale: ptBR }).charAt(0).toUpperCase() + format(date, "MMMM yyyy", { locale: ptBR }).slice(1),
                dayFormat: (date) => format(date, "d", { locale: ptBR }),
            }}
            components={{
                eventWrapper: ({ event }) => (
                    <EventCard 
                        id={event.id}
                        title={event.title}
                        project={event.project}
                        assignee={event.assignee}
                        status={event.status}
                    />
                ),
                toolbar: () => (
                    <CustomToolbar date={value} onNavigate={handleNavigate} />
                )
            }}
        />
    );
};

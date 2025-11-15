import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DailyScheduleTabProps {
  schedule: Array<{
    id: string;
    title: string;
    details: string;
  }>;
}

export function DailyScheduleTab({ schedule }: DailyScheduleTabProps) {
  return (
    // Use the Accordion component.
    // type="single" means only one item can be open at a time.
    // collapsible means even that one can be closed.
    // defaultValue="item-0" will open the first day by default.
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-0"
    >
      {schedule.map((day, idx) => (
        <AccordionItem value={`item-${idx}`} key={day.id}>
          <AccordionTrigger>
            <div className="flex items-center gap-4 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm flex-shrink-0">
                {idx + 1}
              </div>
              <span className="text-lg font-semibold text-left">{day.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {/*
              We add padding-left to align the text, and
              border-l to connect it visually to the trigger.
            */}
            <p className="pl-[56px] pt-2 pb-4 border-l-2 border-primary/20 ml-5 text-foreground/80 text-sm leading-relaxed whitespace-pre-line">
              {day.details}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
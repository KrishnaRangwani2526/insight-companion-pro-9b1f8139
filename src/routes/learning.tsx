import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Play, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ActionButton, Badge, Card, PageHeader, Progress, SectionLabel, Sheet } from "@/components/ui-kit";
import { Bi } from "@/components/Bi";
import { LESSONS } from "@/lib/demo-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [
      { title: "Learning — Kalaa Setu" },
      { name: "description", content: "Short lessons on selling online, photos, pricing, stock, profit, marketing and bulk buyers." },
      { property: "og:title", content: "Learn to grow your business" },
      { property: "og:description", content: "Ten short lessons in simple language." },
    ],
  }),
  component: LearningPage,
});

const BODY: Record<string, string[]> = {
  default: [
    "Start with what you already have — your products and your phone.",
    "Do one small thing today rather than planning a big change for later.",
    "Write down what happened after a week so you can see if it worked.",
  ],
};

function LearningPage() {
  const { state, toggleLesson } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);
  const lesson = LESSONS.find((l) => l.id === openId);
  const doneCount = LESSONS.filter((l) => state.lessons[l.id]).length;

  return (
    <AppShell>
      <PageHeader title="Learning" subtitle="Short lessons, simple language" icon={GraduationCap} />

      <Card>
        <SectionLabel>
          <Bi>Your progress</Bi>
        </SectionLabel>
        <div className="flex items-center gap-3">
          <Progress value={(doneCount / LESSONS.length) * 100} tone="good" />
          <span className="shrink-0 font-mono text-[13px] font-bold">
            {doneCount}/{LESSONS.length}
          </span>
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">
          {doneCount === LESSONS.length ? "You have finished every lesson." : "Finish one lesson a day and you are done in ten days."}
        </p>
      </Card>

      <div className="space-y-2.5">
        {LESSONS.map((l) => {
          const done = !!state.lessons[l.id];
          return (
            <button key={l.id} onClick={() => setOpenId(l.id)} className="frost-tile flex w-full items-center gap-3 p-3.5 text-left">
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${done ? "bg-good-soft text-good" : "bg-primary-soft text-primary"}`}>
                {done ? <Check className="size-[18px]" /> : <Play className="size-[18px]" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold">{l.title}</span>
                <span className="block text-[12px] text-muted-foreground">
                  {l.mins} min · {l.cat}
                </span>
              </span>
              <Badge tone={l.level === "Beginner" ? "muted" : "accent"}>{l.level}</Badge>
            </button>
          );
        })}
      </div>

      <Sheet open={!!lesson} onClose={() => setOpenId(null)} title={lesson?.title ?? ""}>
        {lesson ? (
          <div className="space-y-3">
            <p className="text-[12px] font-semibold text-muted-foreground">
              {lesson.mins} minutes · {lesson.cat} · {lesson.level}
            </p>
            <div className="aspect-video w-full place-items-center rounded-2xl bg-surface-2 ring-1 ring-line grid">
              <Play className="size-10 text-primary" />
            </div>
            <ul className="space-y-2">
              {(BODY[lesson.id] ?? BODY["default"]!).map((p) => (
                <li key={p} className="flex gap-2 text-[14px] leading-relaxed">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
            <ActionButton
              className="w-full"
              onClick={() => {
                toggleLesson(lesson.id);
                toast.success(state.lessons[lesson.id] ? "Marked as not finished" : "Lesson finished");
                setOpenId(null);
              }}
            >
              {state.lessons[lesson.id] ? "Mark as not finished" : "Mark as finished"}
            </ActionButton>
          </div>
        ) : null}
      </Sheet>
    </AppShell>
  );
}

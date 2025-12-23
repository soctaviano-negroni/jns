import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Preparation } from "@/types/recipe";

interface PreparationStepsProps {
  preparation: Preparation;
}

export function PreparationSteps({ preparation }: PreparationStepsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Preparation</h2>
        <div className="flex items-center gap-3">
          {preparation.prepTimeMinutes && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{preparation.prepTimeMinutes} min</span>
            </div>
          )}
          {preparation.method && (
            <Badge variant="secondary">{preparation.method}</Badge>
          )}
        </div>
      </div>

      <ol className="space-y-4">
        {preparation.steps.map((step) => (
          <li key={step.step} className="flex gap-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber/10 text-sm font-medium text-amber-dark">
              {step.step}
            </div>
            <p className="pt-0.5 text-foreground leading-relaxed">
              {step.description}
            </p>
          </li>
        ))}
      </ol>

      {preparation.tools && preparation.tools.length > 0 && (
        <div className="pt-2">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Tools Required
          </h3>
          <div className="flex flex-wrap gap-2">
            {preparation.tools.map((tool) => (
              <Badge key={tool} variant="outline" className="font-normal">
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

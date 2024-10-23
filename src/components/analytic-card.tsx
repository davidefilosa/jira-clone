import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface AnalyticCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
}
export const AnalyticCard = ({
  title,
  value,
  variant,
  increaseValue,
}: AnalyticCardProps) => {
  const iconColor = variant === "up" ? "text-emerald-500" : "text-red-500";
  const increaseValueColor =
    variant === "up" ? "text-emerald-500" : "text-red-500";
  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;

  return (
    <Card className="shodow-none border-none w-full">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={cn("size-4", iconColor)} />
            <span
              className={cn(
                "truncate text-base font-medium",
                increaseValueColor
              )}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className="3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};

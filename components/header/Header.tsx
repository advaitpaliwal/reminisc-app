import { ThemeToggle } from "@/components/header/theme-toggle";
import { UserMenu } from "@/components/header/user-menu";
import { cn } from "@/lib/utils";
import { MemoriesSheet } from "@/components/header/MemoryPanel";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface HeaderProps {
  title: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, className }) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-2",
        className
      )}
    >
      <h1 className="px-2 text-xl font-semibold">{title}</h1>
      <div className="flex-1" />
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <UserMenu />
          </div>
        </TooltipTrigger>
        <TooltipContent>Account</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <MemoriesSheet />
          </div>
        </TooltipTrigger>
        <TooltipContent>Memories</TooltipContent>
      </Tooltip>

      <div />
    </header>
  );
};

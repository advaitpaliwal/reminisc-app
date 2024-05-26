import { ThemeToggle } from "@/components/header/theme-toggle";
import { UserMenu } from "@/components/header/user-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, className }) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4",
        className
      )}
    >
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex-1" />
      <UserMenu />
      <ThemeToggle />
      <div />
    </header>
  );
};

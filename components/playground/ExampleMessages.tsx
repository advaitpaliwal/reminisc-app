import { useUser } from "@/hooks/useUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ExampleMessage {
  title: string;
  description: string;
  placeholder?: string;
}

interface ExampleMessagesProps {
  onMessageClick: (description: string) => void;
}

export const ExampleMessages: React.FC<ExampleMessagesProps> = ({
  onMessageClick,
}) => {
  const { user, loading } = useUser();

  const getNamePlaceholder = () => {
    return user?.user_metadata.first_name && user?.user_metadata.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : "_______";
  };

  const messages: ExampleMessage[] = [
    {
      title: "Name",
      description: "My name is ",
      placeholder: getNamePlaceholder(),
    },
    {
      title: "Hobby",
      description: "I like to ",
      placeholder: "_______",
    },
    {
      title: "Major",
      description: "I am studying ",
      placeholder: "_______",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-[60vh] p-4 mt-10">
      <div className="text-center mb-7">
        <p className="text-4xl font-medium mb-5">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-200 to-rose-400">
            {loading
              ? "Hey"
              : `Hey, ${user?.user_metadata.first_name || "Name"}`}
          </span>
        </p>
        <p className="text-xl text-muted-foreground">
          What can I remember for you today?
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {messages.map((m) => (
          <Card
            key={m.title}
            className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col justify-center text-center w-full rounded-lg"
            onClick={() => onMessageClick(m.description)}
          >
            <CardHeader>
              <CardTitle>
                <span className="text-lg font-semibold">{m.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <span className="text-sm">{m.description}</span>
                <span className="text-sm italic">{m.placeholder}</span>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

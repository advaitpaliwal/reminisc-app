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
  const messages: ExampleMessage[] = [
    {
      title: "Name",
      description: "My name is ",
      placeholder: "Advait",
    },
    {
      title: "Hobby",
      description: "I like to ",
      placeholder: "play the piano",
    },
    {
      title: "Diet",
      description: "I am ",
      placeholder: "vegetarian",
    },
  ];

  return (
    <div className="flex items-center justify-center h-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 sm:p-4">
        {messages.map((m) => (
          <Card
            key={m.title}
            className="cursor-pointer"
            onClick={() => onMessageClick(m.description)}
          >
            <CardHeader>
              <CardTitle>
                <span className="text-lg">{m.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <span className="text-sm">{m.description}</span>
                <span className="text-sm italic text-gray-300">
                  {m.placeholder}
                </span>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

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
      placeholder: "Advait Paliwal",
    },
    {
      title: "Hobby",
      description: "I like to ",
      placeholder: "play the piano",
    },
    {
      title: "Career",
      description: "I am ",
      placeholder: "building an AI startup",
    },
  ];
  return (
    <div className="flex items-center justify-center h-full">
      <div className="grid grid-cols-3 gap-1 md:gap-4 md:p-4">
        {messages.map((m) => (
          <Card
            key={m.title}
            className="w-full cursor-pointer"
            onClick={() => onMessageClick(m.description)}
          >
            <CardHeader>
              <CardTitle>
                <span className="text-sm">{m.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <span className="text-sm">
                  {m.description}
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

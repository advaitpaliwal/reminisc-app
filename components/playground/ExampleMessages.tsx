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
}

interface ExampleMessagesProps {
  onMessageClick: (description: string) => void;
}

export const ExampleMessages: React.FC<ExampleMessagesProps> = ({
  onMessageClick,
}) => {
  const messages = [
    {
      title: "Name",
      description: "My name is Advait Paliwal",
    },
    {
      title: "Hobby",
      description: "I like to play the piano",
    },
    {
      title: "Career",
      description: "I am building an AI startup",
    },
  ];
  return (
    <div className="flex items-center justify-center h-full">
      <div className="grid grid-cols-3 gap-2 my-auto">
        {messages.map((m) => (
          <Card
            key={m.title}
            className="w-full rounded-xl cursor-pointer"
            onClick={() => onMessageClick(m.description)}
          >
            <CardHeader>
              <CardTitle>
                <span className="text-sm">{m.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <span>{m.description}</span>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

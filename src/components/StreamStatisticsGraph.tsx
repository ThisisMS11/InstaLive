import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from '@/imports/Shadcn_imports';
import image from '@/app/assets/google.svg';
export default function Component() {
  const data = [
    {
      id: '1a2b3c4d5e6f7g8h9i',
      url: 'https://i.pravatar.cc/200?img=2',
      name: 'John Doe',
      message: 'Hello, how are you?',
    },
    {
      id: '2b3c4d5e6f7g8h9i1a',
      url: 'https://i.pravatar.cc/200?img=3',
      name: 'Jane Smith',
      message: 'I am doing great!',
    },
    {
      id: '3c4d5e6f7g8h9i1a2b',
      url: 'https://i.pravatar.cc/200?img=4',
      name: 'Alice Johnson',
      message: 'What’s the update on the project?',
    },
    {
      id: '4d5e6f7g8h9i1a2b3c',
      url: 'https://i.pravatar.cc/200?img=5',
      name: 'Bob Brown',
      message: 'Looking forward to our meeting tomorrow.',
    },
    {
      id: '4d5e6f7g8h9i1a2b3cr',
      url: 'https://i.pravatar.cc/200?img=6',
      name: 'Mohit Brown',
      message: 'Looking forward to our meeting tomorrow.',
    },
  ];

  return (
    <div className="bg-white p-3 rounded-lg shadow h-full">
      <div className="h-1/6 text-2xl font-bold">Blocked Users</div>
      <div className="h-5/6  p-2 overflow-y-scroll">
        {data.map((e) => {
          return (
            <Accordion type="single" collapsible key={e.id} className="shadow">
              <AccordionItem value="item-1">
                <div className="flex w-full  items-center justify-between">
                  <Avatar className=" my-auto mr-3">
                    <AvatarImage src={e.url} />
                    <AvatarFallback>N/A</AvatarFallback>
                  </Avatar>
                  <AccordionTrigger>{e.name}</AccordionTrigger>
                  <Button className="bg-blue-600 text-white">Unblock</Button>
                </div>

                <AccordionContent className="p-2 text-gray-700">
                  {e.message}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import {
  Copy,
  Edit,
  PlusCircle,
  Trash,
  MoreHorizontal,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiKey {
  name: string;
  secretKey: string;
  created: string;
  lastUsed: string;
}

const initialApiKeys: ApiKey[] = [
  {
    name: "devEnvironment",
    secretKey: "rem-abcdefghijklmnopqrstuvwxyz0Eht",
    created: "May 1, 2024",
    lastUsed: "May 25, 2024",
  },
  {
    name: "productionKey",
    secretKey: "rem-abcdefghijklmnopqrstuvwxyzGZFW",
    created: "May 1, 2024",
    lastUsed: "May 25, 2024",
  },
];

const generateRandomKey = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "rem-";
  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export function ApiKeysTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [showSaveKeyDialog, setShowSaveKeyDialog] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [createKeyDialogOpen, setCreateKeyDialogOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [editKeyDialogOpen, setEditKeyDialogOpen] = useState(false);
  const [currentEditKey, setCurrentEditKey] = useState<ApiKey | null>(null);
  const [editKeyName, setEditKeyName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSubmit = () => {
    const generatedKey = generateRandomKey();
    setApiKeys([
      ...apiKeys,
      {
        name: "NewKey",
        secretKey: generatedKey,
        created: new Date().toDateString(),
        lastUsed: new Date().toDateString(),
      },
    ]);
    setNewKey(generatedKey);
    setCreateKeyDialogOpen(false);
    setShowSaveKeyDialog(true);
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const handleEdit = (key: ApiKey) => {
    setCurrentEditKey(key);
    setEditKeyName(key.name);
    setEditKeyDialogOpen(true);
  };

  const handleDelete = (keyToDelete: ApiKey) => {
    setApiKeys(apiKeys.filter((key) => key !== keyToDelete));
  };

  const handleSaveEdit = () => {
    setApiKeys(
      apiKeys.map((key) =>
        key === currentEditKey ? { ...key, name: editKeyName } : key
      )
    );
    setEditKeyDialogOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatKey = (key: string) => {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  const formatName = (name: string) => {
    return `${name.slice(0, 7)}...`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Dialog
            open={createKeyDialogOpen}
            onOpenChange={setCreateKeyDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="size-4" />
                Create new secret key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create new secret key</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="key-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="key-name"
                    placeholder="My Test Key"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleSubmit}>
                  Create secret key
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAME</TableHead>
                <TableHead>API KEY</TableHead>
                {!isMobile && <TableHead>CREATED</TableHead>}
                {!isMobile && <TableHead>LAST USED</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key, index) => (
                <TableRow key={index}>
                  <TableCell>{formatName(key.name)}</TableCell>
                  <TableCell>{formatKey(key.secretKey)}</TableCell>
                  {!isMobile && <TableCell>{key.created}</TableCell>}
                  {!isMobile && <TableCell>{key.lastUsed}</TableCell>}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleCopy(key.secretKey)}
                        >
                          {copiedKey === key.secretKey ? (
                            <Check className="mr-2 size-4" />
                          ) : (
                            <Copy className="mr-2 size-4" />
                          )}
                          {copiedKey === key.secretKey ? "Copied" : "Copy"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(key)}>
                          <Edit className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(key)}>
                          <Trash className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {showSaveKeyDialog && (
        <Dialog open={showSaveKeyDialog} onOpenChange={setShowSaveKeyDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save your key</DialogTitle>
              <DialogDescription>
                Please save this secret key somewhere safe and accessible. For
                security reasons, you won&apos;t be able to view it again
                through your account. If you lose this secret key, you&apos;ll
                need to generate a new one.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="secret-key" className="sr-only">
                  Secret Key
                </Label>
                <Input id="secret-key" value={newKey} readOnly />
              </div>
              <Button
                type="button"
                size="sm"
                className="px-3"
                onClick={() => handleCopy(newKey)}
              >
                <span className="sr-only">Copy</span>
                {copiedKey === newKey ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Done
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {editKeyDialogOpen && (
        <Dialog open={editKeyDialogOpen} onOpenChange={setEditKeyDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit API Key</DialogTitle>
              <DialogDescription>
                You can only edit the name of the API key.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-key-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-key-name"
                  value={editKeyName}
                  onChange={(e) => setEditKeyName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleSaveEdit}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

export default ApiKeysTable;

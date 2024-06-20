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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import useApiKeys from "@/hooks/useApiKeys";
import { ApiKey } from "@/types/apiKey";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function ApiKeysTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [showSaveKeyDialog, setShowSaveKeyDialog] = useState(false);
  const [createKeyDialogOpen, setCreateKeyDialogOpen] = useState(false);
  const [editKeyDialogOpen, setEditKeyDialogOpen] = useState(false);
  const [currentEditKey, setCurrentEditKey] = useState<ApiKey | null>(null);
  const [editKeyName, setEditKeyName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);

  const {
    apiKeys,
    loading,
    error,
    newKey,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  } = useApiKeys();

  const getKeyName = () => {
    const keyNumber = apiKeys.length + 1;
    const name = `Key ${keyNumber}`;
    return name;
  };

  const handleSubmit = async () => {
    let name = editKeyName.trim();
    if (!name) {
      name = getKeyName();
    }
    await createApiKey(name);
    toast.success("API key created successfully.");
    setEditKeyName("");
    setCreateKeyDialogOpen(false);
    setShowSaveKeyDialog(true);
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(key);
      toast.success("API key copied to clipboard.");
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const handleEdit = (key: ApiKey) => {
    setCurrentEditKey(key);
    setEditKeyName(key.name);
    setEditKeyDialogOpen(true);
  };

  const handleDelete = async () => {
    if (keyToDelete) {
      await deleteApiKey(keyToDelete.id);
      toast.success("API key revoked successfully.");
      setKeyToDelete(null);
    }
  };

  const confirmDelete = (key: ApiKey) => {
    setKeyToDelete(key);
  };

  const handleSaveEdit = async () => {
    if (currentEditKey) {
      await updateApiKey(currentEditKey.id, editKeyName);
      toast.success("API key name updated successfully.");
      setEditKeyDialogOpen(false);
    }
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
    if (isMobile) return `...${key.slice(-4)}`;
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  const formatName = (name: string) => {
    if (name.length <= 7) return name;
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
                    placeholder={getKeyName()}
                    className="col-span-3"
                    value={editKeyName}
                    onChange={(e) => setEditKeyName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
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
      {apiKeys.length > 0 && (
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>KEY</TableHead>
                  {!isMobile && <TableHead>CREATED</TableHead>}
                  {!isMobile && <TableHead>LAST USED</TableHead>}
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key: ApiKey) => (
                  <TableRow key={key.id}>
                    <TableCell>{formatName(key.name)}</TableCell>
                    <TableCell>{formatKey(key.secret_key)}</TableCell>
                    {!isMobile && <TableCell>{key.created_at}</TableCell>}
                    {!isMobile && (
                      <TableCell>{key.last_used_at || "Unused"}</TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleCopy(key.secret_key)}
                          >
                            {copiedKey === key.secret_key ? (
                              <Check className="mr-2 size-4" />
                            ) : (
                              <Copy className="mr-2 size-4" />
                            )}
                            {copiedKey === key.secret_key ? "Copied" : "Copy"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(key)}>
                            <Edit className="mr-2 size-4" />
                            Edit Name
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => confirmDelete(key)}>
                            <Trash className="mr-2 size-4" />
                            Revoke
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
      )}

      {showSaveKeyDialog && newKey && (
        <Dialog open={showSaveKeyDialog} onOpenChange={setShowSaveKeyDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save your key</DialogTitle>
              <DialogDescription>
                Please save this secret key somewhere safe and accessible. For
                security reasons, you won&apos;t be able to view it again
                through your account.
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveEdit();
                    }
                  }}
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

      {keyToDelete && (
        <AlertDialog
          open={keyToDelete !== null}
          onOpenChange={() => setKeyToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke secret key</AlertDialogTitle>
              <AlertDialogDescription>
                This API key will immediately be disabled. API requests made
                using this key will be rejected, which could cause any systems
                still depending on it to break. Once revoked, you&apos;ll no
                longer be able to view or modify this API key.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="delete-key" className="sr-only">
                  Secret Key
                </Label>
                <Input
                  id="delete-key"
                  value={formatKey(keyToDelete.secret_key)}
                  readOnly
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Revoke key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
}

export default ApiKeysTable;

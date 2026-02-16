import { Navigation } from "@/components/Navigation";
import { useUser } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Image as ImageIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function MoodBoard() {
  const { t } = useTranslation();
  const { data: user } = useUser();
  const { toast } = useToast();
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [newItemUrl, setNewItemUrl] = useState("");

  const { data: boards, isLoading: boardsLoading } = useQuery({
    queryKey: ["/api/moodboards"],
  });

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ["/api/moodboards", selectedBoardId, "items"],
    enabled: !!selectedBoardId,
    queryFn: async () => {
      const res = await fetch(`/api/moodboards/${selectedBoardId}/items`);
      return res.json();
    },
  });

  const createBoardMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest("POST", "/api/moodboards", { title });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moodboards"] });
      setNewBoardTitle("");
      toast({ title: "Mood board created!" });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ boardId, imageUrl }: { boardId: number; imageUrl: string }) => {
      const res = await apiRequest("POST", `/api/moodboards/${boardId}/items`, { imageUrl });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moodboards", selectedBoardId, "items"] });
      setNewItemUrl("");
      toast({ title: "Inspiration added!" });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/moodboard-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moodboards", selectedBoardId, "items"] });
      toast({ title: "Item removed" });
    },
  });

  if (boardsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-secondary">Inspiration Mood Boards</h1>
          <div className="flex gap-2">
            <Input 
              placeholder="Board Title" 
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              className="w-48"
            />
            <Button onClick={() => createBoardMutation.mutate(newBoardTitle)} disabled={!newBoardTitle}>
              <Plus className="w-4 h-4 mr-2" /> New Board
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            {boards?.map((board: any) => (
              <Button
                key={board.id}
                variant={selectedBoardId === board.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedBoardId(board.id)}
              >
                {board.title}
              </Button>
            ))}
          </div>

          <div className="md:col-span-3 space-y-8">
            {selectedBoardId ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" /> Add Inspiration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Input 
                      placeholder="Image URL" 
                      value={newItemUrl}
                      onChange={(e) => setNewItemUrl(e.target.value)}
                    />
                    <Button onClick={() => addItemMutation.mutate({ boardId: selectedBoardId, imageUrl: newItemUrl })} disabled={!newItemUrl}>
                      Add
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {itemsLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    items?.map((item: any) => (
                      <div key={item.id} className="relative group">
                        <img 
                          src={item.imageUrl} 
                          alt="Inspiration" 
                          className="w-full h-48 object-cover rounded-lg shadow-sm"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteItemMutation.mutate(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl text-muted-foreground">
                <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                <p>Select or create a mood board to start collecting inspiration.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
import { Navigation } from "@/components/Navigation";
import { useUser } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

type MoodBoardItem = { id: number; imageUrl: string };
type MoodBoardType = { id: number; title: string; items: MoodBoardItem[] };

const MB_KEY = "app_moodboards";
function loadBoards(): MoodBoardType[] {
  try { return JSON.parse(localStorage.getItem(MB_KEY) || "[]"); } catch { return []; }
}
function saveBoards(boards: MoodBoardType[]) {
  localStorage.setItem(MB_KEY, JSON.stringify(boards));
}

export default function MoodBoard() {
  const { t } = useTranslation();
  const { data: user } = useUser();
  const { toast } = useToast();
  const [boards, setBoards] = useState<MoodBoardType[]>(loadBoards);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [newItemUrl, setNewItemUrl] = useState("");

  const selectedBoard = boards.find((b) => b.id === selectedBoardId);
  const items = selectedBoard?.items ?? [];

  const createBoard = () => {
    if (!newBoardTitle.trim()) return;
    const updated = [...boards, { id: Date.now(), title: newBoardTitle.trim(), items: [] }];
    setBoards(updated);
    saveBoards(updated);
    setNewBoardTitle("");
    toast({ title: "Mood board created!" });
  };

  const addItem = (boardId: number, imageUrl: string) => {
    if (!imageUrl.trim()) return;
    const updated = boards.map((b) =>
      b.id === boardId ? { ...b, items: [...b.items, { id: Date.now(), imageUrl: imageUrl.trim() }] } : b
    );
    setBoards(updated);
    saveBoards(updated);
    setNewItemUrl("");
    toast({ title: "Inspiration added!" });
  };

  const deleteItem = (boardId: number, itemId: number) => {
    const updated = boards.map((b) =>
      b.id === boardId ? { ...b, items: b.items.filter((i) => i.id !== itemId) } : b
    );
    setBoards(updated);
    saveBoards(updated);
    toast({ title: "Item removed" });
  };

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
            <Button onClick={() => createBoard()} disabled={!newBoardTitle}>
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
                    <Button onClick={() => addItem(selectedBoardId, newItemUrl)} disabled={!newItemUrl}>
                      Add
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {items.map((item) => (
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
                        onClick={() => deleteItem(selectedBoardId!, item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                  }
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
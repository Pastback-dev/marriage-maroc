import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useProviders } from "@/hooks/use-providers";
import { ProviderCard } from "@/components/ProviderCard";
import { Loader2, SearchX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  categories: string[];
}

export function SearchResultsDialog({ isOpen, onClose, city, categories }: SearchResultsDialogProps) {
  const { data: providers, isLoading } = useProviders({
    city: city || undefined,
    categories: categories.length > 0 ? categories : undefined
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-[2rem] border-primary/20">
        <DialogHeader className="p-8 pb-4 bg-gradient-to-r from-primary/5 to-amber-50/50">
          <DialogTitle className="text-2xl font-display font-bold text-secondary">
            Search Results
          </DialogTitle>
          <DialogDescription>
            Found {providers?.length || 0} providers in {city || "all cities"} matching your selection.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-8 pt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium">Searching for the best vendors...</p>
            </div>
          ) : !providers || providers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <SearchX className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">No vendors found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Try adjusting your filters or selecting a different city to find more options.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
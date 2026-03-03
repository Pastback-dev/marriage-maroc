import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Home as HomeIcon, Plane, Edit2 } from "lucide-react";
import { type Guest } from "@shared/schema";
import { useUser } from "@/hooks/use-auth";

interface GuestTableProps {
  guests: Guest[] | undefined;
  isLoading: boolean;
  onEdit?: (guest: Guest) => void;
  onDelete?: (id: number) => void;
}

export function GuestTable({ guests, isLoading, onEdit, onDelete }: GuestTableProps) {
  const { data: user } = useUser();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>People</TableHead>
          <TableHead>Origin</TableHead>
          <TableHead>Gift/Person</TableHead>
          <TableHead>Total Gift</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
          </TableRow>
        ) : !guests || guests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
              No guests found.
            </TableCell>
          </TableRow>
        ) : (
          guests.map((guest) => (
            <TableRow key={guest.id} data-testid={`row-guest-${guest.id}`}>
              <TableCell className="font-medium">{guest.name}</TableCell>
              <TableCell className="capitalize">{guest.gender}</TableCell>
              <TableCell>{guest.numberOfGuests}</TableCell>
              <TableCell>
                {guest.type === 'local' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    <HomeIcon className="w-3 h-3" /> Local
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                    <Plane className="w-3 h-3" /> Foreign
                  </span>
                )}
              </TableCell>
              <TableCell>{guest.pricePerGuest} MAD</TableCell>
              <TableCell className="font-bold text-emerald-600">
                {((guest.pricePerGuest || 0) * (guest.numberOfGuests || 1)).toLocaleString()} MAD
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && user?.id === guest.userId && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-primary"
                      onClick={() => onEdit(guest)}
                      data-testid={`button-edit-guest-${guest.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && user?.id === guest.userId && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(guest.id)}
                      data-testid={`button-delete-guest-${guest.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
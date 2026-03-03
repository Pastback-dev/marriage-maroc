import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Home as HomeIcon, Plane, Edit2, MapPin, Calendar, Clock, FileText, Users, Gift } from "lucide-react";
import { type Guest } from "@shared/schema";
import { useUser } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";

interface GuestTableProps {
  guests: Guest[] | undefined;
  isLoading: boolean;
  onEdit?: (guest: Guest) => void;
  onDelete?: (id: number) => void;
}

export function GuestTable({ guests, isLoading, onEdit, onDelete }: GuestTableProps) {
  const { data: user } = useUser();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
        Loading guests...
      </div>
    );
  }

  if (!guests || guests.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>No guests found in your list.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        {guests.map((guest) => (
          <Card key={guest.id} className="overflow-hidden border-border/50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-secondary text-lg">{guest.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {guest.gender}
                    </span>
                    {guest.type === 'local' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                        <HomeIcon className="w-2.5 h-2.5" /> Local
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                        <Plane className="w-2.5 h-2.5" /> Foreign
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  {onEdit && user?.id === guest.userId && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(guest)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && user?.id === guest.userId && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(guest.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">People</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary/60" /> {guest.numberOfGuests}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Gift</p>
                  <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" /> {((guest.pricePerGuest || 0) * (guest.numberOfGuests || 1)).toLocaleString()} MAD
                  </p>
                </div>
              </div>

              {(guest.city || guest.eventDate || guest.eventTime) && (
                <div className="pt-3 border-t border-border/50 space-y-2">
                  {guest.city && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 text-primary" /> {guest.city}
                    </div>
                  )}
                  <div className="flex gap-4">
                    {guest.eventDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 text-primary" /> {guest.eventDate}
                      </div>
                    )}
                    {guest.eventTime && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 text-primary" /> {guest.eventTime}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {guest.description && (
                <div className="mt-3 p-2 bg-muted/30 rounded-lg text-[11px] text-muted-foreground italic">
                  <FileText className="w-3 h-3 inline mr-1 opacity-50" /> {guest.description}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>People</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Gift/Person</TableHead>
            <TableHead>Total Gift</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
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
              <TableCell>
                {guest.city ? (
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin className="w-3 h-3 text-primary" /> {guest.city}
                  </div>
                ) : "—"}
              </TableCell>
              <TableCell>
                {guest.eventDate ? (
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="w-3 h-3 text-primary" /> {guest.eventDate}
                  </div>
                ) : "—"}
              </TableCell>
              <TableCell>
                {guest.eventTime ? (
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="w-3 h-3 text-primary" /> {guest.eventTime}
                  </div>
                ) : "—"}
              </TableCell>
              <TableCell className="max-w-[150px] truncate text-xs text-muted-foreground">
                {guest.description || "—"}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
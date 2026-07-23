"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MuseumForm, type MuseumFormValues } from "./museum-form";

export function MuseumList({ museums }: { museums: MuseumFormValues[] }) {
  const [editing, setEditing] = useState<MuseumFormValues | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Museu</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {museums.map((museum) => (
            <TableRow key={museum.id}>
              <TableCell className="font-medium">{museum.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {museum.address || "—"}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: museum.colorHex }}
                  />
                  {museum.colorHex}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={museum.status === "ativo" ? "default" : "secondary"}>
                  {museum.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditing(museum)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {museums.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhum museu cadastrado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar museu</DialogTitle>
          </DialogHeader>
          {editing && (
            <MuseumForm museum={editing} onSaved={() => setEditing(null)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

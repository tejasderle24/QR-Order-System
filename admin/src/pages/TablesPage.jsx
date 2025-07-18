import { useEffect, useState } from "react";
import API from "../api";
import { QRCodeCanvas } from "qrcode.react";
import DashboardLayout from "@/layouts/DashboardLayout";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Edit, Trash2 } from "lucide-react";

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ tableId: "", name: "", capacity: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTableId, setCurrentTableId] = useState(null);

  const fetchTables = async () => {
    try {
      const res = await API.get("/api/tables");
      setTables(res.data);
    } catch (err) {
      toast.error("Failed to fetch tables");
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!form.tableId || !form.name || !form.capacity) {
        toast.error("Please fill all fields");
        return;
      }

      if (editMode) {
        await API.put(`/api/tables/${currentTableId}`, form);
        toast.success("Table updated successfully");
      } else {
        await API.post("/api/tables", form);
        toast.success("Table added successfully");
      }
      resetForm();
      fetchTables();
    } catch (err) {
      toast.error(`Error ${editMode ? "updating" : "creating"} table`);
    }
  };

  const deleteTable = async (id) => {
    try {
      await API.delete(`/api/tables/${id}`);
      toast.success("Table deleted successfully");
      fetchTables();
    } catch (err) {
      toast.error("Error deleting table");
    }
  };

  const resetForm = () => {
    setForm({ tableId: "", name: "", capacity: "" });
    setEditMode(false);
    setCurrentTableId(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (table) => {
    setForm({
      tableId: table.tableId,
      name: table.name,
      capacity: table.capacity,
    });
    setCurrentTableId(table._id);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const downloadQRCode = (tableId) => {
    const canvas = document.getElementById(`qrcode-${tableId}`);
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `table-${tableId}-qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Tables</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>Add Table</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editMode ? "Edit Table" : "Add New Table"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tableId">Table ID*</Label>
                  <Input
                    id="tableId"
                    placeholder="T1"
                    value={form.tableId}
                    onChange={(e) =>
                      setForm({ ...form, tableId: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name*</Label>
                  <Input
                    id="name"
                    placeholder="Table Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity*</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="4"
                    value={form.capacity}
                    onChange={(e) =>
                      setForm({ ...form, capacity: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  {editMode ? "Update Table" : "Add Table"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>QR Code</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => {
                const url = `${window.location.origin}/?tableId=${table.tableId}`;
                return (
                  <TableRow key={table._id}>
                    <TableCell className="font-medium">
                      {table.tableId}
                    </TableCell>
                    <TableCell>{table.name}</TableCell>
                    <TableCell>{table.capacity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <QRCodeCanvas
                          id={`qrcode-${table.tableId}`}
                          value={url}
                          size={80}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => downloadQRCode(table.tableId)}
                          title="Download QR Code"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(table)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTable(table._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TablesPage;
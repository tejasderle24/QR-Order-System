import React, { useEffect, useState } from 'react';
import API from '../api';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    category: '', 
    image: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  const categories = [
    'Appetizers',
    'Main Course',
    'Desserts',
    'Beverages',
    'Salads',
    'Sides'
  ];

  const fetchMenu = async () => {
    try {
      const res = await API.get('/api/menu');
      setMenu(res.data);
    } catch (error) {
      toast.error("Failed to fetch menu items");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setForm({ name: '', price: '', category: '', image: '' });
    setEditMode(false);
    setCurrentItemId(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      if (editMode) {
        await API.put(`/api/menu/${currentItemId}`, form);
        toast.success("Menu item updated successfully");
      } else {
        await API.post('/api/menu', form);
        toast.success("Menu item added successfully");
      }
      resetForm();
      setOpenDialog(false);
      fetchMenu();
    } catch (error) {
      toast.error(`Failed to ${editMode ? 'update' : 'add'} menu item`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await API.delete(`/api/menu/${id}`);
      toast.success("Menu item deleted successfully");
      fetchMenu();
    } catch (error) {
      toast.error("Failed to delete menu item");
    }
  };

  const openEditDialog = (item) => {
    setForm({
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image
    });
    setCurrentItemId(item._id);
    setEditMode(true);
    setOpenDialog(true);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Menu</h1>
          <Dialog open={openDialog} onOpenChange={(open) => {
            if (!open) resetForm();
            setOpenDialog(open);
          }}>
            <DialogTrigger asChild>
              <Button>Add New Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editMode ? 'Edit Menu Item' : 'Add New Menu Item'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name*</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price*</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Item price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => setForm({ ...form, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {form.image && (
                    <div className="mt-2">
                      <img 
                        src={form.image} 
                        alt="Preview" 
                        className="h-20 w-20 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleSubmit} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? editMode 
                      ? 'Updating...' 
                      : 'Adding...' 
                    : editMode 
                      ? 'Update Item' 
                      : 'Add Item'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                {/* <TableHead>Image</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menu.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  {/* <TableCell>
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                  </TableCell> */}
                  <TableCell className="flex justify-end gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteItem(item._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MenuPage;
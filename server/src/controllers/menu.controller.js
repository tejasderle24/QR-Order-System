import MenuItem from '../models/MenuItem.Model.js';

// Get all menu items
export const getMenuItems = async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
};

// Add new menu item
export const addMenuItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const updated = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  await MenuItem.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
};

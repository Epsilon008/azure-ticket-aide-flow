
import Equipment from '../models/Equipment.js';
import Category from '../models/Category.js';
import Assignment from '../models/Assignment.js';
import Employee from '../models/Employee.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalEquipment = await Equipment.countDocuments({ isActive: true });
    const criticalStock = await Equipment.countDocuments({
      isActive: true,
      $expr: { $lte: ['$currentStock', '$criticalLevel'] }
    });
    const totalEmployees = await Employee.countDocuments({ isActive: true });
    
    const totalStockValue = await Equipment.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$currentStock' } } }
    ]);

    const categoryStats = await Equipment.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$categoryInfo.name',
          totalStock: { $sum: '$currentStock' },
          criticalItems: {
            $sum: { $cond: [{ $lte: ['$currentStock', '$criticalLevel'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalEquipment,
        criticalStock,
        totalEmployees,
        totalStockValue: totalStockValue[0]?.total || 0,
        categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

export const getEquipments = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const equipments = await Equipment.find(filter)
      .populate('category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: equipments,
      count: equipments.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des équipements',
      error: error.message
    });
  }
};

export const createEquipment = async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();
    
    const populatedEquipment = await Equipment.findById(equipment._id)
      .populate('category');

    res.status(201).json({
      success: true,
      data: populatedEquipment,
      message: 'Équipement créé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'équipement',
      error: error.message
    });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('category');

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Équipement non trouvé'
      });
    }

    res.json({
      success: true,
      data: equipment,
      message: 'Équipement mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'équipement',
      error: error.message
    });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Équipement non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Équipement supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'équipement',
      error: error.message
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories',
      error: error.message
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      data: category,
      message: 'Catégorie créée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la catégorie',
      error: error.message
    });
  }
};

export const getAssignmentHistory = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('employee', 'name department')
      .populate('equipment', 'name')
      .populate('assignedBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: assignments,
      count: assignments.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique',
      error: error.message
    });
  }
};


import Employee from '../models/Employee.js';
import Equipment from '../models/Equipment.js';
import Assignment from '../models/Assignment.js';

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true })
      .populate('assignedItems.equipment')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: employees,
      count: employees.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des employés',
      error: error.message
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    
    const populatedEmployee = await Employee.findById(employee._id)
      .populate('assignedItems.equipment');

    res.status(201).json({
      success: true,
      data: populatedEmployee,
      message: 'Employé créé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'employé',
      error: error.message
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedItems.equipment');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employé non trouvé'
      });
    }

    res.json({
      success: true,
      data: employee,
      message: 'Employé mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'employé',
      error: error.message
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employé non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Employé supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'employé',
      error: error.message
    });
  }
};

export const assignEquipment = async (req, res) => {
  try {
    const { employeeId, equipmentId, quantity } = req.body;
    
    const employee = await Employee.findById(employeeId);
    const equipment = await Equipment.findById(equipmentId);

    if (!employee || !equipment) {
      return res.status(404).json({
        success: false,
        message: 'Employé ou équipement non trouvé'
      });
    }

    if (equipment.currentStock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuffisant'
      });
    }

    // Mettre à jour l'employé
    const existingAssignment = employee.assignedItems.find(
      item => item.equipment.toString() === equipmentId
    );

    if (existingAssignment) {
      existingAssignment.quantity += quantity;
    } else {
      employee.assignedItems.push({
        equipment: equipmentId,
        quantity,
        assignedDate: new Date()
      });
    }

    // Mettre à jour le stock
    equipment.currentStock -= quantity;

    // Créer l'historique d'attribution
    const assignment = new Assignment({
      employee: employeeId,
      equipment: equipmentId,
      quantity,
      type: 'assignment',
      assignedBy: req.user.userId
    });

    await Promise.all([
      employee.save(),
      equipment.save(),
      assignment.save()
    ]);

    res.json({
      success: true,
      message: 'Équipement attribué avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'attribution',
      error: error.message
    });
  }
};

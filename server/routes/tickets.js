
import express from 'express';
import Ticket from '../models/Ticket.js';

const router = express.Router();

// GET - Récupérer tous les tickets avec filtres
router.get('/', async (req, res) => {
  try {
    const { status, type, priority, search } = req.query;
    let filter = {};

    // Application des filtres
    if (status && status !== 'all') filter.status = status;
    if (type && type !== 'all') filter.type = type;
    if (priority && priority !== 'all') filter.priority = priority;

    // Recherche textuelle
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: tickets,
      count: tickets.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tickets',
      error: error.message
    });
  }
});

// GET - Récupérer un ticket par ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).lean();
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du ticket',
      error: error.message
    });
  }
});

// POST - Créer un nouveau ticket
router.post('/', async (req, res) => {
  try {
    const ticketData = req.body;
    
    // Validation basique
    if (!ticketData.title || !ticketData.description || !ticketData.type) {
      return res.status(400).json({
        success: false,
        message: 'Titre, description et type sont requis'
      });
    }

    const ticket = new Ticket(ticketData);
    await ticket.save();

    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Ticket créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création du ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du ticket',
      error: error.message
    });
  }
});

// PUT - Mettre à jour un ticket
router.put('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé'
      });
    }

    res.json({
      success: true,
      data: ticket,
      message: 'Ticket mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du ticket',
      error: error.message
    });
  }
});

// DELETE - Supprimer un ticket
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Ticket supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du ticket',
      error: error.message
    });
  }
});

// PUT - Ajouter des solutions IA à un ticket
router.put('/:id/solutions', async (req, res) => {
  try {
    const { solutions } = req.body;
    
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $push: { solutions: { $each: solutions } } },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé'
      });
    }

    res.json({
      success: true,
      data: ticket,
      message: 'Solutions ajoutées avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout des solutions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout des solutions',
      error: error.message
    });
  }
});

export default router;

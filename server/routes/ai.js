
import express from 'express';
import { AIService } from '../services/aiService.js';
import Ticket from '../models/Ticket.js';

const router = express.Router();

// POST - Générer des solutions IA pour un ticket
router.post('/generate-solutions/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    // Récupérer le ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé'
      });
    }

    // Vérifier que c'est un ticket de panne
    if (ticket.type !== 'panne') {
      return res.status(400).json({
        success: false,
        message: 'Les solutions IA ne sont disponibles que pour les tickets de panne'
      });
    }

    // Générer les solutions
    const solutions = await AIService.generateSolutions(
      ticket.description,
      ticket.title
    );

    // Ajouter les solutions au ticket
    ticket.solutions = solutions;
    await ticket.save();

    res.json({
      success: true,
      data: {
        ticketId: ticket._id,
        solutions: solutions
      },
      message: 'Solutions générées avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la génération des solutions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération des solutions',
      error: error.message
    });
  }
});

// POST - Générer des solutions à partir d'une description (pour prévisualisation)
router.post('/preview-solutions', async (req, res) => {
  try {
    const { description, title } = req.body;
    
    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description requise'
      });
    }

    const solutions = await AIService.generateSolutions(description, title || 'Problème technique');

    res.json({
      success: true,
      data: {
        solutions: solutions
      },
      message: 'Solutions générées avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la génération des solutions de prévisualisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération des solutions',
      error: error.message
    });
  }
});

// GET - Obtenir les statistiques des solutions IA
router.get('/solutions/stats', async (req, res) => {
  try {
    const tickets = await Ticket.find({ type: 'panne', solutions: { $exists: true, $not: { $size: 0 } } });
    
    const stats = {
      totalTicketsWithSolutions: tickets.length,
      averageConfidence: 0,
      solutionsByConfidence: {
        high: 0,    // > 80%
        medium: 0,  // 60-80%
        low: 0      // < 60%
      }
    };

    let totalConfidence = 0;
    let solutionCount = 0;

    tickets.forEach(ticket => {
      ticket.solutions.forEach(solution => {
        totalConfidence += solution.confidence;
        solutionCount++;
        
        if (solution.confidence > 80) stats.solutionsByConfidence.high++;
        else if (solution.confidence >= 60) stats.solutionsByConfidence.medium++;
        else stats.solutionsByConfidence.low++;
      });
    });

    if (solutionCount > 0) {
      stats.averageConfidence = Math.round(totalConfidence / solutionCount);
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

export default router;

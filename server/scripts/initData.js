
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Category from '../models/Category.js';
import Equipment from '../models/Equipment.js';
import dotenv from 'dotenv';

dotenv.config();

const initializeData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket-system');
    console.log('✅ Connecté à MongoDB');

    // Vérifier si les utilisateurs existent déjà
    const existingUsers = await User.countDocuments();
    if (existingUsers === 0) {
      // Créer les utilisateurs de démonstration
      const adminPassword = await bcrypt.hash('admin123', 12);
      const userPassword = await bcrypt.hash('user123', 12);

      await User.create([
        {
          username: 'Admin',
          email: 'admin@example.com',
          password: adminPassword,
          role: 'admin',
          department: 'IT'
        },
        {
          username: 'Utilisateur',
          email: 'user@example.com',
          password: userPassword,
          role: 'user',
          department: 'Support'
        }
      ]);

      console.log('✅ Utilisateurs de démonstration créés');
    }

    // Créer des catégories par défaut
    const existingCategories = await Category.countDocuments();
    if (existingCategories === 0) {
      await Category.create([
        { name: 'Ordinateurs', description: 'Ordinateurs de bureau et portables' },
        { name: 'Périphériques', description: 'Souris, claviers, écrans' },
        { name: 'Réseau', description: 'Routeurs, switches, câbles' },
        { name: 'Téléphonie', description: 'Téléphones et équipements télécom' }
      ]);

      console.log('✅ Catégories par défaut créées');
    }

    console.log('🎉 Initialisation terminée');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
};

initializeData();

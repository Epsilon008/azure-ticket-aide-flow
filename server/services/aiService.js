
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class AIService {
  static async generateSolutions(ticketDescription, ticketTitle) {
    try {
      const prompt = `
Tu es un expert en support technique informatique. 
Analyse ce problème technique et propose 3 solutions concrètes et pratiques.

PROBLÈME:
Titre: ${ticketTitle}
Description: ${ticketDescription}

Pour chaque solution, fournis:
1. Un titre court et clair
2. Un niveau de confiance (0-100%)
3. Le temps estimé de résolution
4. Des étapes détaillées

Réponds UNIQUEMENT en JSON valide dans ce format:
{
  "solutions": [
    {
      "solution": "Titre de la solution",
      "confidence": 85,
      "estimatedTime": "15-30 minutes",
      "steps": [
        "Étape 1 détaillée",
        "Étape 2 détaillée",
        "Étape 3 détaillée"
      ]
    }
  ]
}

Assure-toi que les solutions sont:
- Pratiques et réalisables
- Ordonnées par probabilité de succès
- Adaptées au niveau technique moyen
- Avec des étapes claires et précises
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en support technique. Réponds uniquement en JSON valide."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      });

      const responseText = completion.choices[0].message.content.trim();
      
      // Nettoyage de la réponse pour extraire le JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Format de réponse IA invalide');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Validation et ajout d'IDs uniques
      const solutions = parsedResponse.solutions.map((solution, index) => ({
        id: `ai_${Date.now()}_${index}`,
        solution: solution.solution,
        confidence: Math.min(Math.max(solution.confidence, 0), 100),
        estimatedTime: solution.estimatedTime,
        steps: solution.steps || []
      }));

      return solutions;
    } catch (error) {
      console.error('Erreur lors de la génération des solutions IA:', error);
      
      // Solutions de fallback en cas d'erreur
      return [
        {
          id: `fallback_${Date.now()}`,
          solution: "Vérification des connexions et redémarrage",
          confidence: 70,
          estimatedTime: "10-15 minutes",
          steps: [
            "Vérifier tous les câbles et connexions",
            "Redémarrer l'équipement concerné",
            "Tester le fonctionnement",
            "Documenter les résultats"
          ]
        }
      ];
    }
  }

  static async generateSolutionsFromDescription(description) {
    // Méthode simplifiée pour les cas où on n'a que la description
    return this.generateSolutions(description, "Problème technique");
  }
}

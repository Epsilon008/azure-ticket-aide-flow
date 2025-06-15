
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AISolution } from '@/types/ticket';
import { Brain, Clock, CheckCircle, Loader2 } from 'lucide-react';

interface AISolutionsProps {
  ticketDescription: string;
  solutions?: AISolution[];
  onGenerateSolutions: () => void;
  loading?: boolean;
}

export const AISolutions = ({ ticketDescription, solutions = [], onGenerateSolutions, loading }: AISolutionsProps) => {
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'Haute';
    if (confidence >= 60) return 'Moyenne';
    return 'Faible';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>Solutions IA</span>
          </CardTitle>
          <Button 
            onClick={onGenerateSolutions}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              'Générer des solutions'
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {solutions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune solution générée pour le moment.</p>
            <p className="text-sm">Cliquez sur "Générer des solutions" pour obtenir des recommandations IA.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {solutions.map((solution) => (
              <Card 
                key={solution.id}
                className={`cursor-pointer transition-all ${
                  selectedSolution === solution.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedSolution(selectedSolution === solution.id ? null : solution.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex-1">
                      {solution.solution}
                    </h3>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={getConfidenceColor(solution.confidence)} variant="secondary">
                        {getConfidenceText(solution.confidence)} ({solution.confidence}%)
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {solution.estimatedTime}
                      </div>
                    </div>
                  </div>
                  
                  {selectedSolution === solution.id && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Étapes de résolution :</h4>
                      <ol className="space-y-2">
                        {solution.steps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                      <div className="mt-4 flex justify-end">
                        <Button size="sm" variant="outline" className="mr-2">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marquer comme appliquée
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

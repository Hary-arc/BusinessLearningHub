
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

interface QuizViewProps {
  title: string;
  description: string;
  questions: QuizQuestion[];
  courseName: string;
  instructor: string;
  onSubmit: (answers: number[]) => void;
}

export function QuizView({ title, description, questions, courseName, instructor, onSubmit }: QuizViewProps) {
  const [currentAnswers, setCurrentAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [progress, setProgress] = useState(0);

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...currentAnswers];
    newAnswers[questionIndex] = answerIndex;
    setCurrentAnswers(newAnswers);
    setProgress((newAnswers.filter(a => a !== -1).length / questions.length) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-gray-500">{courseName} • {instructor}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>

      {questions.map((question, index) => (
        <Card key={question.id} className="mb-4">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-base">
                Question {index + 1}: {question.question}
              </CardTitle>
              <span className="text-sm text-gray-500">{question.marks} Mark{question.marks > 1 ? 's' : ''}</span>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={currentAnswers[index]?.toString()}
              onValueChange={(value) => handleAnswerChange(index, parseInt(value))}
            >
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value={optionIndex.toString()} id={`q${question.id}-a${optionIndex}`} />
                  <Label htmlFor={`q${question.id}-a${optionIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => onSubmit(currentAnswers)}>Save Draft</Button>
        <Button onClick={() => onSubmit(currentAnswers)}>Submit Quiz</Button>
      </div>
    </div>
  );
}
